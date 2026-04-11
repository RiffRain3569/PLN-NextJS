/** @jsxImportSource @emotion/react */
import { colors } from '@components/_layout/client/theme/colors';
import View from '@components/_layout/client/View';
import NumberButton from '@components/_ui/button/NumberButton';
import {
    fetchStatsFreq, fetchStatsSum, fetchStatsOddEven,
    fetchStatsDigit, fetchStatsPairs, fetchStatsAc,
} from '@apis/client/lotto';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// ── 탭 정의 ──────────────────────────────────────────
const TABS = ['출현빈도', '핫&콜드', '번호합', '홀짝/고저', '끝수', '번호쌍', 'AC값', '마킹패턴'] as const;
type Tab = typeof TABS[number];

type FilterParams = { fromId: number; toId: number; includeBonus: boolean };

// ── 공통 컴포넌트 ─────────────────────────────────────
const Section = ({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) => (
    <div css={{ background: colors.background2, padding: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
        <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white, marginBottom: desc ? 6 : 16 }}>{title}</p>
        {desc && <p css={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: 16 }}>{desc}</p>}
        {children}
    </div>
);

const Bar = ({ value, max, color = colors.primary.main }: { value: number; max: number; color?: string }) => (
    <div css={{ height: 8, background: colors.line, borderRadius: 4, overflow: 'hidden' }}>
        <div css={{ height: '100%', width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
    </div>
);

const RatioRow = ({ label, count, total, max, color }: { label: string; count: number; total: number; max: number; color?: string }) => (
    <div>
        <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <p css={{ fontSize: '0.85rem' }}>{label}</p>
            <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>{count}회 ({total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'}%)</p>
        </div>
        <Bar value={count} max={max} color={color} />
    </div>
);

const Loading = () => <p css={{ fontSize: '0.85rem', opacity: 0.5, padding: '20px 0' }}>불러오는 중...</p>;

// ── 탭 컴포넌트들 ─────────────────────────────────────
const FreqTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-freq', fromId, toId, includeBonus],
        queryFn: () => fetchStatsFreq({ fromId, toId, includeBonus }),
    });
    if (isLoading || !data) return <Loading />;

    const accumulate: number[] = data.accumulate;
    const max = Math.max(...accumulate);
    const sorted = accumulate.map((cnt: number, i: number) => ({ num: i + 1, cnt })).sort((a: any, b: any) => b.cnt - a.cnt);

    return (
        <Section title='번호별 누적 출현 횟수'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.map(({ num, cnt }: { num: number; cnt: number }) => (
                    <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{ width: 32, flexShrink: 0 }}><NumberButton number={num} disabled mobileSize="sm" /></div>
                        <div css={{ flex: 1 }}><Bar value={cnt} max={max} /></div>
                        <p css={{ fontSize: '0.8rem', width: 32, textAlign: 'right', opacity: 0.8 }}>{cnt}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const HotColdTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-freq', fromId, toId, includeBonus],
        queryFn: () => fetchStatsFreq({ fromId, toId, includeBonus }),
    });
    if (isLoading || !data) return <Loading />;

    const unpick: number[] = data.unpick;
    const withIndex = unpick.map((cnt: number, i: number) => ({ num: i + 1, cnt }));
    const hot = [...withIndex].sort((a, b) => a.cnt - b.cnt).slice(0, 20);
    const cold = [...withIndex].sort((a, b) => b.cnt - a.cnt).slice(0, 10);
    const maxCold = cold[0]?.cnt ?? 1;

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Section title='🔥 핫넘버 — 최근 자주 나온 번호'>
                <div css={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {hot.map(({ num, cnt }) => (
                        <div key={num} css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <NumberButton number={num} disabled mobileSize="sm" />
                            <p css={{ fontSize: '0.65rem', opacity: 0.6 }}>{cnt}회 전</p>
                        </div>
                    ))}
                </div>
            </Section>
            <Section title='❄️ 콜드넘버 — 오래 안 나온 번호'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cold.map(({ num, cnt }) => (
                        <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div css={{ width: 32, flexShrink: 0 }}><NumberButton number={num} disabled mobileSize="sm" /></div>
                            <div css={{ flex: 1 }}><Bar value={cnt} max={maxCold} color='#5AC8FA' /></div>
                            <p css={{ fontSize: '0.8rem', width: 40, textAlign: 'right', opacity: 0.8 }}>{cnt}회 전</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

const SumTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-sum', fromId, toId],
        queryFn: () => fetchStatsSum({ fromId, toId }),
    });
    if (isLoading || !data) return <Loading />;

    const ranges: { label: string; count: number }[] = data.ranges;
    const max = Math.max(...ranges.map((d: any) => d.count));
    const total = ranges.reduce((a: number, b: any) => a + b.count, 0);

    return (
        <Section title='당첨번호 합계 구간 분포' desc='통계적으로 121~180 구간에 전체의 약 64%가 집중됩니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ranges.map(({ label, count }: { label: string; count: number }) => (
                    <RatioRow key={label} label={label} count={count} total={total} max={max} />
                ))}
            </div>
        </Section>
    );
};

const OddEvenTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-odd-even', fromId, toId, includeBonus],
        queryFn: () => fetchStatsOddEven({ fromId, toId, includeBonus }),
    });
    if (isLoading || !data) return <Loading />;

    const oddEven: { label: string; count: number }[] = data.oddEven;
    const highLow: { label: string; count: number }[] = data.highLow;
    const color: { label: string; color: string; darkColor: string; count: number }[] = data.color;

    const maxOE = Math.max(...oddEven.map((d: any) => d.count));
    const totalOE = oddEven.reduce((a: number, b: any) => a + b.count, 0);
    const maxHL = Math.max(...highLow.map((d: any) => d.count));
    const totalHL = highLow.reduce((a: number, b: any) => a + b.count, 0);
    const totalColor = color.reduce((a: number, b: any) => a + b.count, 0);

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Section title='홀짝 비율 분포 (홀:짝)'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {oddEven.map(({ label, count }: any) => (
                        <RatioRow key={label} label={label} count={count} total={totalOE} max={maxOE} />
                    ))}
                </div>
            </Section>
            <Section title='고저 비율 분포 (저:고)' desc='저수 1~22, 고수 23~45'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {highLow.map(({ label, count }: any) => (
                        <RatioRow key={label} label={label} count={count} total={totalHL} max={maxHL} color='#5AC8FA' />
                    ))}
                </div>
            </Section>
            <Section title='색상(구간)별 출현 분포'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {color.map(({ label, color: c, darkColor, count }: any) => (
                        <div key={label}>
                            <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div css={{ width: 14, height: 14, borderRadius: '50%', background: `radial-gradient(circle at left top, ${c}, ${darkColor})` }} />
                                    <p css={{ fontSize: '0.85rem' }}>{label}</p>
                                </div>
                                <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>{count}회 ({totalColor > 0 ? ((count / totalColor) * 100).toFixed(1) : '0.0'}%)</p>
                            </div>
                            <Bar value={count} max={totalColor / 4} color={c} />
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

const DigitTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-digit', fromId, toId, includeBonus],
        queryFn: () => fetchStatsDigit({ fromId, toId, includeBonus }),
    });
    if (isLoading || !data) return <Loading />;

    const digits: { digit: number; count: number }[] = data.digits;
    const max = Math.max(...digits.map((d: any) => d.count));
    const total = digits.reduce((a: number, b: any) => a + b.count, 0);

    return (
        <Section title='끝수(일의 자리) 분포' desc='당첨번호 6개의 일의 자리 숫자(0~9) 출현 빈도입니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {digits.map(({ digit, count }: any) => (
                    <div key={digit} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: colors.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 'bold',
                        }}>{digit}</div>
                        <div css={{ flex: 1 }}><Bar value={count} max={max} color={colors.orange} /></div>
                        <p css={{ fontSize: '0.8rem', width: 60, textAlign: 'right', opacity: 0.8 }}>
                            {count} ({total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'}%)
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const PairTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-pairs', fromId, toId],
        queryFn: () => fetchStatsPairs({ fromId, toId }),
    });
    if (isLoading || !data) return <Loading />;

    const pairs: { a: number; b: number; count: number }[] = data.pairs;
    const max = pairs[0]?.count ?? 1;

    return (
        <Section title='번호쌍 동시 출현 TOP 20' desc='같이 자주 당첨된 번호 조합입니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pairs.map(({ a, b, count }: any, i: number) => (
                    <div key={i} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <p css={{ fontSize: '0.75rem', opacity: 0.5, width: 20, flexShrink: 0 }}>{i + 1}</p>
                        <div css={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <NumberButton number={a} disabled />
                            <NumberButton number={b} disabled />
                        </div>
                        <div css={{ flex: 1 }}><Bar value={count} max={max} color='#7ED321' /></div>
                        <p css={{ fontSize: '0.8rem', width: 36, textAlign: 'right', opacity: 0.8 }}>{count}회</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const AcTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-ac', fromId, toId],
        queryFn: () => fetchStatsAc({ fromId, toId }),
    });
    if (isLoading || !data) return <Loading />;

    const acValues: { ac: number; count: number }[] = data.acValues;
    const max = Math.max(...acValues.map((d: any) => d.count));
    const total = acValues.reduce((a: number, b: any) => a + b.count, 0);

    return (
        <Section
            title='AC값 분포'
            desc='AC(Arithmetic Complexity)값은 번호 조합의 다양성 지표입니다. 6개 번호 간 차이값의 중복을 제거한 개수에서 5를 뺀 값 (0~9). 높을수록 번호가 고르게 분산됨.'
        >
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {acValues.map(({ ac, count }: any) => (
                    <div key={ac} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{
                            width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                            background: colors.background, border: `1px solid ${colors.line}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 'bold',
                        }}>{ac}</div>
                        <div css={{ flex: 1 }}><Bar value={count} max={max} color='#9B4DCA' /></div>
                        <p css={{ fontSize: '0.8rem', width: 60, textAlign: 'right', opacity: 0.8 }}>
                            {count}회 ({total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'}%)
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const MarkingTab = ({ fromId, toId, includeBonus }: FilterParams) => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats-freq', fromId, toId, includeBonus],
        queryFn: () => fetchStatsFreq({ fromId, toId, includeBonus }),
    });
    if (isLoading || !data) return <Loading />;

    const accumulate: number[] = data.accumulate;
    const max = Math.max(...accumulate);
    const min = Math.min(...accumulate);
    const rows = [
        [1,2,3,4,5,6,7,8,9],
        [10,11,12,13,14,15,16,17,18],
        [19,20,21,22,23,24,25,26,27],
        [28,29,30,31,32,33,34,35,36],
        [37,38,39,40,41,42,43,44,45],
    ];
    const getOpacity = (num: number) => {
        const cnt = accumulate[num - 1];
        return 0.15 + ((cnt - min) / (max - min || 1)) * 0.85;
    };

    return (
        <Section title='마킹 패턴 히트맵' desc='번호별 출현 빈도를 로또 용지 격자 형태로 시각화합니다. 진할수록 자주 나온 번호입니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {rows.map((row, ri) => (
                    <div key={ri} css={{ display: 'flex', gap: 4 }}>
                        {row.map((num) => (
                            <div
                                key={num}
                                css={{
                                    flex: 1, aspectRatio: '1', borderRadius: 4,
                                    background: colors.primary.main,
                                    opacity: getOpacity(num),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: 'bold', color: '#fff',
                                    minWidth: 0,
                                }}
                            >
                                {num}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div css={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <p css={{ fontSize: '0.75rem', opacity: 0.5 }}>적음</p>
                <div css={{ flex: 1, height: 6, borderRadius: 3, background: `linear-gradient(to right, ${colors.primary.main}26, ${colors.primary.main})` }} />
                <p css={{ fontSize: '0.75rem', opacity: 0.5 }}>많음</p>
            </div>
        </Section>
    );
};

// ── 메인 페이지 ───────────────────────────────────────
const StatsPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('출현빈도');
    const [fromRound, setFromRound] = useState<string>('1');
    const [toRound, setToRound] = useState<string>('1216');
    const [includeBonus, setIncludeBonus] = useState(false);

    // URL 쿼리 → 상태 동기화 (새로고침/뒤로가기 복원)
    useEffect(() => {
        if (!router.isReady) return;
        const { tab } = router.query;
        if (tab && TABS.includes(tab as Tab)) setActiveTab(tab as Tab);
    }, [router.query.tab, router.isReady]);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        router.push({ query: { ...router.query, tab } }, undefined, { shallow: true });
    };

    const filterParams: FilterParams = {
        fromId: Number(fromRound) || 1,
        toId: Number(toRound) || 1216,
        includeBonus,
    };

    return (
        <View>
            <div css={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p css={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.white }}>로또 분석</p>

                {/* 전역 필터 */}
                <div css={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <div css={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p css={{ fontSize: '0.8rem', opacity: 0.6 }}>회차</p>
                        <input
                            type='number'
                            value={fromRound}
                            min={1}
                            onChange={(e) => setFromRound(e.target.value)}
                            css={{
                                width: 72, padding: '6px 10px',
                                background: colors.background2, border: `1px solid ${colors.line}`,
                                fontSize: '0.85rem', borderRadius: 2,
                            }}
                        />
                        <p css={{ fontSize: '0.8rem', opacity: 0.5 }}>~</p>
                        <input
                            type='number'
                            value={toRound}
                            min={1}
                            onChange={(e) => setToRound(e.target.value)}
                            css={{
                                width: 72, padding: '6px 10px',
                                background: colors.background2, border: `1px solid ${colors.line}`,
                                fontSize: '0.85rem', borderRadius: 2,
                            }}
                        />
                    </div>
                    <div css={{ display: 'flex', gap: 4 }}>
                        {[50, 100, 200].map((n) => (
                            <button
                                key={n}
                                onClick={() => { setFromRound(String(Number(toRound) - n + 1)); }}
                                css={{
                                    padding: '6px 10px', fontSize: '0.8rem', borderRadius: 2,
                                    background: colors.background2, border: `1px solid ${colors.line}`,
                                    '&:hover': { borderColor: colors.primary.main },
                                }}
                            >최근 {n}</button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIncludeBonus((v) => !v)}
                        css={{
                            padding: '6px 12px', fontSize: '0.8rem', borderRadius: 2,
                            background: includeBonus ? colors.secondary.main : colors.background2,
                            border: `1px solid ${includeBonus ? colors.secondary.main : colors.line}`,
                            transition: 'all 0.2s',
                        }}
                    >보너스 {includeBonus ? '포함' : '제외'}</button>
                </div>

                {/* 탭 */}
                <div css={{ display: 'flex', borderBottom: `1px solid ${colors.line}`, overflowX: 'auto' }}>
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                css={{
                                    padding: '10px 16px', whiteSpace: 'nowrap', background: 'none',
                                    fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 'normal',
                                    color: isActive ? colors.white : colors.text,
                                    borderBottom: isActive ? `2px solid ${colors.white}` : '2px solid transparent',
                                    marginBottom: -1, transition: 'all 0.2s',
                                }}
                            >{tab}</button>
                        );
                    })}
                </div>

                {/* 탭 콘텐츠 */}
                {activeTab === '출현빈도' && <FreqTab {...filterParams} />}
                {activeTab === '핫&콜드' && <HotColdTab {...filterParams} />}
                {activeTab === '번호합' && <SumTab {...filterParams} />}
                {activeTab === '홀짝/고저' && <OddEvenTab {...filterParams} />}
                {activeTab === '끝수' && <DigitTab {...filterParams} />}
                {activeTab === '번호쌍' && <PairTab {...filterParams} />}
                {activeTab === 'AC값' && <AcTab {...filterParams} />}
                {activeTab === '마킹패턴' && <MarkingTab {...filterParams} />}
            </div>
        </View>
    );
};

export default StatsPage;
