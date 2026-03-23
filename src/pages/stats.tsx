/** @jsxImportSource @emotion/react */
import { colors } from '@components/_layout/client/theme/colors';
import View from '@components/_layout/client/View';
import NumberButton from '@components/_ui/button/NumberButton';
import { useState } from 'react';

// ── 더미 데이터 ──────────────────────────────────────
const DUMMY_ACCUMULATE = [
    167, 152, 170, 159, 153, 163, 168, 155, 133, 160,
    164, 177, 175, 170, 165, 166, 169, 172, 167, 166,
    165, 141, 148, 165, 150, 164, 180, 151, 152, 156,
    164, 141, 173, 180, 161, 162, 171, 169, 165, 172,
    147, 153, 162, 161, 172,
];
const DUMMY_UNPICK = [
    6, 7, 0, 11, 3, 8, 6, 4, 6, 0, 3, 14, 1, 0, 0,
    11, 6, 13, 1, 7, 1, 9, 0, 0, 3, 5, 2, 12, 13, 2,
    4, 16, 2, 21, 5, 3, 7, 3, 7, 5, 4, 8, 19, 1, 1,
];
const DUMMY_ODD_EVEN = [
    { label: '6:0', count: 12 }, { label: '5:1', count: 89 },
    { label: '4:2', count: 312 }, { label: '3:3', count: 398 },
    { label: '2:4', count: 287 }, { label: '1:5', count: 96 },
    { label: '0:6', count: 22 },
];
const DUMMY_HIGH_LOW = [
    { label: '6:0', count: 9 }, { label: '5:1', count: 76 },
    { label: '4:2', count: 298 }, { label: '3:3', count: 421 },
    { label: '2:4', count: 301 }, { label: '1:5', count: 88 },
    { label: '0:6', count: 23 },
];
const DUMMY_SUM_RANGE = [
    { label: '~80', count: 18 }, { label: '81~100', count: 87 },
    { label: '101~120', count: 198 }, { label: '121~140', count: 289 },
    { label: '141~160', count: 274 }, { label: '161~180', count: 201 },
    { label: '181~200', count: 109 }, { label: '201~', count: 40 },
];
const DUMMY_COLOR = [
    { label: '1~10', color: '#F8E71C', darkColor: '#D48E00', count: 1891 },
    { label: '11~20', color: '#5AC8FA', darkColor: '#003366', count: 1932 },
    { label: '21~30', color: '#FF4C4C', darkColor: '#800020', count: 1987 },
    { label: '31~40', color: '#D3D3D3', darkColor: '#2C2C2C', count: 1954 },
    { label: '41~45', color: '#7ED321', darkColor: '#006400', count: 972 },
];
const DUMMY_DIGIT = [
    { digit: 0, count: 712 }, { digit: 1, count: 891 }, { digit: 2, count: 834 },
    { digit: 3, count: 867 }, { digit: 4, count: 823 }, { digit: 5, count: 798 },
    { digit: 6, count: 812 }, { digit: 7, count: 856 }, { digit: 8, count: 779 },
    { digit: 9, count: 828 },
];
const DUMMY_PAIRS = [
    { a: 27, b: 34, count: 48 }, { a: 3, b: 15, count: 45 }, { a: 12, b: 27, count: 44 },
    { a: 6, b: 33, count: 43 }, { a: 18, b: 27, count: 42 }, { a: 9, b: 34, count: 41 },
    { a: 14, b: 27, count: 40 }, { a: 3, b: 27, count: 39 }, { a: 27, b: 38, count: 39 },
    { a: 12, b: 34, count: 38 }, { a: 7, b: 27, count: 37 }, { a: 15, b: 34, count: 37 },
    { a: 1, b: 27, count: 36 }, { a: 6, b: 27, count: 36 }, { a: 20, b: 34, count: 35 },
    { a: 27, b: 40, count: 35 }, { a: 13, b: 27, count: 34 }, { a: 34, b: 38, count: 34 },
    { a: 9, b: 27, count: 33 }, { a: 19, b: 34, count: 33 },
];
const DUMMY_AC = [
    { ac: 3, count: 8 }, { ac: 4, count: 42 }, { ac: 5, count: 112 },
    { ac: 6, count: 287 }, { ac: 7, count: 389 }, { ac: 8, count: 241 },
    { ac: 9, count: 137 },
];

// ── 탭 정의 ──────────────────────────────────────────
const TABS = ['출현빈도', '핫&콜드', '번호합', '홀짝/고저', '끝수', '번호쌍', 'AC값', '마킹패턴'] as const;
type Tab = typeof TABS[number];


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
        <div css={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
    </div>
);

const RatioRow = ({ label, count, total, max, color }: { label: string; count: number; total: number; max: number; color?: string }) => (
    <div>
        <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <p css={{ fontSize: '0.85rem' }}>{label}</p>
            <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>{count}회 ({((count / total) * 100).toFixed(1)}%)</p>
        </div>
        <Bar value={count} max={max} color={color} />
    </div>
);

// ── 탭 컴포넌트들 ─────────────────────────────────────
const FreqTab = () => {
    const max = Math.max(...DUMMY_ACCUMULATE);
    const sorted = [...DUMMY_ACCUMULATE.map((cnt, i) => ({ num: i + 1, cnt }))].sort((a, b) => b.cnt - a.cnt);
    return (
        <Section title='번호별 누적 출현 횟수'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.map(({ num, cnt }) => (
                    <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{ width: 32, flexShrink: 0 }}><NumberButton number={num} disabled /></div>
                        <div css={{ flex: 1 }}><Bar value={cnt} max={max} /></div>
                        <p css={{ fontSize: '0.8rem', width: 32, textAlign: 'right', opacity: 0.8 }}>{cnt}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const HotColdTab = () => {
    const withIndex = DUMMY_UNPICK.map((cnt, i) => ({ num: i + 1, cnt }));
    const hot = [...withIndex].sort((a, b) => a.cnt - b.cnt).slice(0, 10);
    const cold = [...withIndex].sort((a, b) => b.cnt - a.cnt).slice(0, 10);
    const maxCold = cold[0]?.cnt ?? 1;
    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Section title='🔥 핫넘버 — 최근 자주 나온 번호'>
                <div css={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {hot.map(({ num, cnt }) => (
                        <div key={num} css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <NumberButton number={num} disabled />
                            <p css={{ fontSize: '0.65rem', opacity: 0.6 }}>{cnt}회 전</p>
                        </div>
                    ))}
                </div>
            </Section>
            <Section title='❄️ 콜드넘버 — 오래 안 나온 번호'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cold.map(({ num, cnt }) => (
                        <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div css={{ width: 32, flexShrink: 0 }}><NumberButton number={num} disabled /></div>
                            <div css={{ flex: 1 }}><Bar value={cnt} max={maxCold} color='#5AC8FA' /></div>
                            <p css={{ fontSize: '0.8rem', width: 40, textAlign: 'right', opacity: 0.8 }}>{cnt}회 전</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

const SumTab = () => {
    const max = Math.max(...DUMMY_SUM_RANGE.map((d) => d.count));
    const total = DUMMY_SUM_RANGE.reduce((a, b) => a + b.count, 0);
    return (
        <Section title='당첨번호 합계 구간 분포' desc='통계적으로 121~180 구간에 전체의 약 64%가 집중됩니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {DUMMY_SUM_RANGE.map(({ label, count }) => (
                    <RatioRow key={label} label={label} count={count} total={total} max={max} />
                ))}
            </div>
        </Section>
    );
};

const OddEvenTab = () => {
    const maxOE = Math.max(...DUMMY_ODD_EVEN.map((d) => d.count));
    const totalOE = DUMMY_ODD_EVEN.reduce((a, b) => a + b.count, 0);
    const maxHL = Math.max(...DUMMY_HIGH_LOW.map((d) => d.count));
    const totalHL = DUMMY_HIGH_LOW.reduce((a, b) => a + b.count, 0);
    const totalColor = DUMMY_COLOR.reduce((a, b) => a + b.count, 0);
    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Section title='홀짝 비율 분포 (홀:짝)'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {DUMMY_ODD_EVEN.map(({ label, count }) => (
                        <RatioRow key={label} label={label} count={count} total={totalOE} max={maxOE} />
                    ))}
                </div>
            </Section>
            <Section title='고저 비율 분포 (저:고)' desc='저수 1~22, 고수 23~45'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {DUMMY_HIGH_LOW.map(({ label, count }) => (
                        <RatioRow key={label} label={label} count={count} total={totalHL} max={maxHL} color='#5AC8FA' />
                    ))}
                </div>
            </Section>
            <Section title='색상(구간)별 출현 분포'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {DUMMY_COLOR.map(({ label, color, darkColor, count }) => (
                        <div key={label}>
                            <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div css={{ width: 14, height: 14, borderRadius: '50%', background: `radial-gradient(circle at left top, ${color}, ${darkColor})` }} />
                                    <p css={{ fontSize: '0.85rem' }}>{label}</p>
                                </div>
                                <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>{count}회 ({((count / totalColor) * 100).toFixed(1)}%)</p>
                            </div>
                            <Bar value={count} max={totalColor / 4} color={color} />
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

const DigitTab = () => {
    const max = Math.max(...DUMMY_DIGIT.map((d) => d.count));
    const total = DUMMY_DIGIT.reduce((a, b) => a + b.count, 0);
    return (
        <Section title='끝수(일의 자리) 분포' desc='당첨번호 6개의 일의 자리 숫자(0~9) 출현 빈도입니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DUMMY_DIGIT.map(({ digit, count }) => (
                    <div key={digit} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: colors.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 'bold',
                        }}>{digit}</div>
                        <div css={{ flex: 1 }}><Bar value={count} max={max} color={colors.orange} /></div>
                        <p css={{ fontSize: '0.8rem', width: 60, textAlign: 'right', opacity: 0.8 }}>
                            {count} ({((count / total) * 100).toFixed(1)}%)
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const PairTab = () => {
    const max = DUMMY_PAIRS[0]?.count ?? 1;
    return (
        <Section title='번호쌍 동시 출현 TOP 20' desc='같이 자주 당첨된 번호 조합입니다.'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DUMMY_PAIRS.map(({ a, b, count }, i) => (
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

const AcTab = () => {
    const max = Math.max(...DUMMY_AC.map((d) => d.count));
    const total = DUMMY_AC.reduce((a, b) => a + b.count, 0);
    return (
        <Section
            title='AC값 분포'
            desc='AC(Arithmetic Complexity)값은 번호 조합의 다양성 지표입니다. 6개 번호 간 차이값의 중복을 제거한 개수에서 5를 뺀 값 (0~9). 높을수록 번호가 고르게 분산됨.'
        >
            <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DUMMY_AC.map(({ ac, count }) => (
                    <div key={ac} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{
                            width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                            background: colors.background, border: `1px solid ${colors.line}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 'bold',
                        }}>{ac}</div>
                        <div css={{ flex: 1 }}><Bar value={count} max={max} color='#9B4DCA' /></div>
                        <p css={{ fontSize: '0.8rem', width: 60, textAlign: 'right', opacity: 0.8 }}>
                            {count}회 ({((count / total) * 100).toFixed(1)}%)
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const MarkingTab = () => {
    const max = Math.max(...DUMMY_ACCUMULATE);
    const min = Math.min(...DUMMY_ACCUMULATE);
    // 5행 × 9열 (1~45, 빈 셀 3개)
    const rows = [
        [1,2,3,4,5,6,7,8,9],
        [10,11,12,13,14,15,16,17,18],
        [19,20,21,22,23,24,25,26,27],
        [28,29,30,31,32,33,34,35,36],
        [37,38,39,40,41,42,43,44,45],
    ];
    const getOpacity = (num: number) => {
        const cnt = DUMMY_ACCUMULATE[num - 1];
        return 0.15 + ((cnt - min) / (max - min)) * 0.85;
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
    const [activeTab, setActiveTab] = useState<Tab>('출현빈도');
    const [fromRound, setFromRound] = useState<string>('1');
    const [toRound, setToRound] = useState<string>('1216');
    const [includeBonus, setIncludeBonus] = useState(false);

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
                                onClick={() => setActiveTab(tab)}
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
                {activeTab === '출현빈도' && <FreqTab />}
                {activeTab === '핫&콜드' && <HotColdTab />}
                {activeTab === '번호합' && <SumTab />}
                {activeTab === '홀짝/고저' && <OddEvenTab />}
                {activeTab === '끝수' && <DigitTab />}
                {activeTab === '번호쌍' && <PairTab />}
                {activeTab === 'AC값' && <AcTab />}
                {activeTab === '마킹패턴' && <MarkingTab />}
            </div>
        </View>
    );
};

export default StatsPage;
