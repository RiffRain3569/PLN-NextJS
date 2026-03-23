/** @jsxImportSource @emotion/react */
import { colors } from '@components/_layout/client/theme/colors';
import View from '@components/_layout/client/View';
import NumberButton from '@components/_ui/button/NumberButton';
import { useState } from 'react';

// ── 더미 데이터 ──────────────────────────────────────
// 누적 출현 횟수 (accumulateList 기반, 인덱스 = 번호-1)
const DUMMY_ACCUMULATE = [
    167, 152, 170, 159, 153, 163, 168, 155, 133, 160,
    164, 177, 175, 170, 165, 166, 169, 172, 167, 166,
    165, 141, 148, 165, 150, 164, 180, 151, 152, 156,
    164, 141, 173, 180, 161, 162, 171, 169, 165, 172,
    147, 153, 162, 161, 172,
];

// 미출현 횟수 (unpickCntList 기반)
const DUMMY_UNPICK = [
    6, 7, 0, 11, 3, 8, 6, 4, 6, 0, 3, 14, 1, 0, 0,
    11, 6, 13, 1, 7, 1, 9, 0, 0, 3, 5, 2, 12, 13, 2,
    4, 16, 2, 21, 5, 3, 7, 3, 7, 5, 4, 8, 19, 1, 1,
];

// 홀짝 비율 더미 (회차별)
const DUMMY_ODD_EVEN = [
    { label: '6:0', count: 12 }, { label: '5:1', count: 89 },
    { label: '4:2', count: 312 }, { label: '3:3', count: 398 },
    { label: '2:4', count: 287 }, { label: '1:5', count: 96 },
    { label: '0:6', count: 22 },
];

// 번호합 구간 더미
const DUMMY_SUM_RANGE = [
    { label: '~80', count: 18 }, { label: '81~100', count: 87 },
    { label: '101~120', count: 198 }, { label: '121~140', count: 289 },
    { label: '141~160', count: 274 }, { label: '161~180', count: 201 },
    { label: '181~200', count: 109 }, { label: '201~', count: 40 },
];

// 색상(구간) 분포 더미
const DUMMY_COLOR = [
    { label: '1~10', color: '#F8E71C', darkColor: '#D48E00', count: 1891 },
    { label: '11~20', color: '#5AC8FA', darkColor: '#003366', count: 1932 },
    { label: '21~30', color: '#FF4C4C', darkColor: '#800020', count: 1987 },
    { label: '31~40', color: '#D3D3D3', darkColor: '#2C2C2C', count: 1954 },
    { label: '41~45', color: '#7ED321', darkColor: '#006400', count: 972 },
];

// ── 탭 정의 ──────────────────────────────────────────
const TABS = ['출현빈도', '핫&콜드', '번호합', '홀짝/고저'] as const;
type Tab = typeof TABS[number];

// ── 공통 섹션 카드 ────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div css={{ background: colors.background2, padding: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
        <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white, marginBottom: 16 }}>{title}</p>
        {children}
    </div>
);

// ── 가로 막대 ─────────────────────────────────────────
const Bar = ({ value, max, color = colors.primary.main }: { value: number; max: number; color?: string }) => (
    <div css={{ height: 8, background: colors.line, borderRadius: 4, overflow: 'hidden' }}>
        <div
            css={{
                height: '100%',
                width: `${(value / max) * 100}%`,
                background: color,
                borderRadius: 4,
                transition: 'width 0.4s ease',
            }}
        />
    </div>
);

// ── 출현빈도 탭 ───────────────────────────────────────
const FreqTab = () => {
    const max = Math.max(...DUMMY_ACCUMULATE);
    const sorted = DUMMY_ACCUMULATE
        .map((cnt, i) => ({ num: i + 1, cnt }))
        .sort((a, b) => b.cnt - a.cnt);

    return (
        <Section title='번호별 누적 출현 횟수 (전체 회차)'>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.map(({ num, cnt }) => (
                    <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div css={{ width: 32, flexShrink: 0 }}>
                            <NumberButton number={num} disabled />
                        </div>
                        <div css={{ flex: 1 }}>
                            <Bar value={cnt} max={max} />
                        </div>
                        <p css={{ fontSize: '0.8rem', width: 32, textAlign: 'right', opacity: 0.8 }}>{cnt}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

// ── 핫&콜드 탭 ───────────────────────────────────────
const HotColdTab = () => {
    const withIndex = DUMMY_UNPICK.map((cnt, i) => ({ num: i + 1, cnt }));
    const hot = [...withIndex].sort((a, b) => a.cnt - b.cnt).slice(0, 10);
    const cold = [...withIndex].sort((a, b) => b.cnt - a.cnt).slice(0, 10);
    const maxCold = cold[0]?.cnt ?? 1;

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Section title='🔥 핫넘버 — 최근 자주 나온 번호'>
                <div css={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
                            <div css={{ width: 32, flexShrink: 0 }}>
                                <NumberButton number={num} disabled />
                            </div>
                            <div css={{ flex: 1 }}>
                                <Bar value={cnt} max={maxCold} color='#5AC8FA' />
                            </div>
                            <p css={{ fontSize: '0.8rem', width: 40, textAlign: 'right', opacity: 0.8 }}>{cnt}회 전</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

// ── 번호합 탭 ─────────────────────────────────────────
const SumTab = () => {
    const max = Math.max(...DUMMY_SUM_RANGE.map((d) => d.count));
    const total = DUMMY_SUM_RANGE.reduce((a, b) => a + b.count, 0);

    return (
        <Section title='당첨번호 합계 구간 분포'>
            <p css={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: 16 }}>
                통계적으로 합계 121~180 구간에 전체의 약 64%가 집중됩니다.
            </p>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {DUMMY_SUM_RANGE.map(({ label, count }) => (
                    <div key={label}>
                        <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <p css={{ fontSize: '0.85rem' }}>{label}</p>
                            <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                {count}회 ({((count / total) * 100).toFixed(1)}%)
                            </p>
                        </div>
                        <Bar value={count} max={max} />
                    </div>
                ))}
            </div>
        </Section>
    );
};

// ── 홀짝/고저 탭 ─────────────────────────────────────
const OddEvenTab = () => {
    const maxOE = Math.max(...DUMMY_ODD_EVEN.map((d) => d.count));
    const totalOE = DUMMY_ODD_EVEN.reduce((a, b) => a + b.count, 0);

    const colorData = DUMMY_COLOR;
    const totalColor = colorData.reduce((a, b) => a + b.count, 0);

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Section title='홀짝 비율 분포 (홀:짝)'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {DUMMY_ODD_EVEN.map(({ label, count }) => (
                        <div key={label}>
                            <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <p css={{ fontSize: '0.85rem' }}>{label}</p>
                                <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                    {count}회 ({((count / totalOE) * 100).toFixed(1)}%)
                                </p>
                            </div>
                            <Bar value={count} max={maxOE} />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title='색상(구간)별 출현 분포'>
                <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {colorData.map(({ label, color, darkColor, count }) => (
                        <div key={label}>
                            <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div
                                        css={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle at left top, ${color}, ${darkColor})`,
                                        }}
                                    />
                                    <p css={{ fontSize: '0.85rem' }}>{label}</p>
                                </div>
                                <p css={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                    {count}회 ({((count / totalColor) * 100).toFixed(1)}%)
                                </p>
                            </div>
                            <Bar value={count} max={totalColor / 4} color={color} />
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

// ── 메인 페이지 ───────────────────────────────────────
const StatsPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('출현빈도');

    return (
        <View>
            <div css={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p css={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.white }}>로또 분석</p>

                {/* 탭 */}
                <div
                    css={{
                        display: 'flex',
                        borderBottom: `1px solid ${colors.line}`,
                        overflowX: 'auto',
                    }}
                >
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                css={{
                                    padding: '10px 20px',
                                    whiteSpace: 'nowrap',
                                    background: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    color: isActive ? colors.white : colors.text,
                                    borderBottom: isActive ? `2px solid ${colors.white}` : '2px solid transparent',
                                    marginBottom: -1,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* 탭 콘텐츠 */}
                {activeTab === '출현빈도' && <FreqTab />}
                {activeTab === '핫&콜드' && <HotColdTab />}
                {activeTab === '번호합' && <SumTab />}
                {activeTab === '홀짝/고저' && <OddEvenTab />}
            </div>
        </View>
    );
};

export default StatsPage;
