import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';

// RSAKey.js (Tom Wu) 방식: PKCS#1 v1.5, hex 출력
// 홀수 길이 hex 문자열은 Buffer.from이 마지막 char를 버리므로 앞에 0 패딩 필요
const padHex = (hex: string) => (hex.length % 2 === 0 ? hex : '0' + hex);

function rsaEncrypt(text: string, modulusHex: string, exponentHex: string): string {
    const key = crypto.createPublicKey({
        key: {
            kty: 'RSA',
            n: Buffer.from(padHex(modulusHex), 'hex').toString('base64url'),
            e: Buffer.from(padHex(exponentHex), 'hex').toString('base64url'),
        },
        format: 'jwk',
    });
    return crypto
        .publicEncrypt({ key, padding: crypto.constants.RSA_PKCS1_PADDING }, new Uint8Array(Buffer.from(text, 'utf8')))
        .toString('hex');
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, userPw } = req.body;

    if (!userId || !userPw) {
        return res.status(400).json({ message: 'ID 또는 비밀번호가 없습니다.' });
    }

    const commonHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'www.dhlottery.co.kr',
        Origin: 'https://www.dhlottery.co.kr',
        Referer: 'https://www.dhlottery.co.kr/login',
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    };

    const extractCookies = (headers: AxiosResponseHeaders) => {
        const setCookies: string[] = (headers as any)['set-cookie'] || [];
        const map = new Map<string, string>();
        setCookies.forEach((c) => {
            const part = c.split(';')[0];
            const idx = part.indexOf('=');
            if (idx > 0) map.set(part.slice(0, idx), part.slice(idx + 1));
        });
        return map;
    };

    // 쿠키 Map에 set-cookie 헤더를 병합 (나중 값이 이전 값을 덮어씀)
    const mergeCookies = (cookieMap: Map<string, string>, setCookies: string[]) => {
        setCookies.forEach((c) => {
            const part = c.split(';')[0];
            const idx = part.indexOf('=');
            if (idx > 0) cookieMap.set(part.slice(0, idx), part.slice(idx + 1));
        });
    };

    const cookieMapToHeader = (cookieMap: Map<string, string>) =>
        Array.from(cookieMap.entries())
            .map(([k, v]) => `${k}=${v}`)
            .join('; ');

    try {
        // 1단계: RSA 공개키 발급 (세션 동시 발급)
        const rsaRes = await axios.get('https://www.dhlottery.co.kr/login/selectRsaModulus.do', {
            headers: { 'User-Agent': commonHeaders['User-Agent'] },
        });

        const rsaData = rsaRes.data?.data ?? rsaRes.data ?? {};
        const { rsaModulus, publicExponent } = rsaData;

        if (!rsaModulus || !publicExponent) {
            return res.status(500).json({ message: 'RSA 키 발급에 실패하였습니다.' });
        }

        // RSA 발급 시 받은 세션 쿠키 (Map으로 관리하여 중복 방지)
        const cookieMap = extractCookies(rsaRes.headers as AxiosResponseHeaders);
        // 2단계: userId, 비밀번호 암호화
        const encUserId = rsaEncrypt(userId, rsaModulus, publicExponent);
        const encPassword = rsaEncrypt(userPw, rsaModulus, publicExponent);

        // 3단계: 로그인 요청 (동일한 세션으로)
        const loginResponse: AxiosResponse = await axios.post(
            'https://www.dhlottery.co.kr/login/securityLoginCheck.do',
            qs.stringify({ userId: encUserId, userPswdEncn: encPassword }),
            {
                headers: { ...commonHeaders, Cookie: cookieMapToHeader(cookieMap) },
                maxRedirects: 0,
                validateStatus: () => true,
            },
        );

        // 4단계: 로그인 응답 쿠키 병합 (새 DHJSESSIONID가 기존 것을 덮어씀)
        mergeCookies(cookieMap, (loginResponse.headers as AxiosResponseHeaders)['set-cookie'] || []);

        // 모든 set-cookie 원본 수집 (브라우저에 전달하기 위해)
        const rawSetCookies: string[] = [...((loginResponse.headers as AxiosResponseHeaders)['set-cookie'] || [])];

        // 5단계: 리다이렉트 추적
        if (loginResponse.status >= 300 && loginResponse.status < 400) {
            let location = (loginResponse.headers as AxiosResponseHeaders)['location'] ?? '';
            if (location && !location.startsWith('http')) {
                location = `https://www.dhlottery.co.kr${location}`;
            }
            if (location) {
                const redirectResponse: AxiosResponse = await axios.get(location, {
                    headers: { ...commonHeaders, Cookie: cookieMapToHeader(cookieMap) },
                    maxRedirects: 0,
                    validateStatus: () => true,
                });
                const redirectCookies = (redirectResponse.headers as AxiosResponseHeaders)['set-cookie'] || [];
                mergeCookies(cookieMap, redirectCookies);
                rawSetCookies.push(...redirectCookies);
            }
        }

        // 6단계: 마이페이지 접근으로 로그인 성공 여부 확인
        const mypageResponse: AxiosResponse = await axios.get('https://www.dhlottery.co.kr/mypage/home', {
            headers: { ...commonHeaders, Cookie: cookieMapToHeader(cookieMap) },
            maxRedirects: 0,
            validateStatus: () => true,
        });

        const isRedirectedToLogin =
            mypageResponse.status >= 300 &&
            mypageResponse.status < 400 &&
            ((mypageResponse.headers as AxiosResponseHeaders)['location'] ?? '').includes('login');

        if (mypageResponse.status === 200 && mypageResponse.data?.includes('isLoggedIn = false')) {
            return res.status(401).json({ message: '로그인에 실패하였습니다. ID/PW를 확인해주세요.' });
        }

        if (isRedirectedToLogin) {
            return res.status(401).json({ message: '로그인에 실패하였습니다. ID/PW를 확인해주세요.' });
        }

        const mypageCookies = (mypageResponse.headers as AxiosResponseHeaders)['set-cookie'] || [];
        mergeCookies(cookieMap, mypageCookies);
        rawSetCookies.push(...mypageCookies);

        const dhjSession = cookieMap.get('DHJSESSIONID');

        const dhlCookies = rawSetCookies.map((cookie) =>
            cookie
                .replace('Domain=.dhlottery.co.kr;', '')
                .replace(/;\s*Secure/gi, '')
                .replace(/;\s*SameSite=None/gi, '; SameSite=Lax'),
        );
        // userId를 직접 설정 (DHL 서버 쿠키 의존 없이 안정적으로 관리)
        dhlCookies.push(`dhl_userId=${userId}; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax`);

        res.setHeader('Set-Cookie', dhlCookies);
        return res.status(200).json({ sessionId: dhjSession });
    } catch (e) {
        console.error('dhl sign-in error', e);
        return res.status(500).json({ message: '동행복권 서버 연결에 실패하였습니다.' });
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;
