/** @jsxImportSource @emotion/react */
import { colors } from '@components/_layout/client/theme/colors';
import View from '@components/_layout/client/View';
import NumberButton from '@components/_ui/button/NumberButton';
import { savePickState } from '@store/lotto';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { shuffleArray } from 'utils/common';
import { is_ban_patten } from 'utils/lotto';

// 임시 더미 예측 번호 풀 (API 연동 전)
const DUMMY_PICK_POOL = [3, 6, 7, 9, 10, 14, 15, 17, 18, 20, 23, 24, 25, 27, 38];

type Combo = { nums: number[]; sum: number; oddCnt: number; highCnt: number };

const calcStats = (nums: number[]): Combo => ({
    nums,
    sum: nums.reduce((a, b) => a + b, 0),
    oddCnt: nums.filter((n) => n % 2 === 1).length,
    highCnt: nums.filter((n) => n >= 23).length,
});

const genCombos = (pool: number[], count: number, useBan: boolean): Combo[] => {
    const result: Combo[] = [];
    for (let i = 0; i < count * 20; i++) {
        const nums = shuffleArray(pool).slice(0, 6).sort((a, b) => a - b);
        if (useBan && is_ban_patten(nums)) continue;
        if (!result.find((r) => r.nums.join() === nums.join())) {
            result.push(calcStats(nums));
        }
        if (result.length >= count) break;
    }
    return result;
};

// ── 번호 풀 표시 ──────────────────────────────────────
const PoolSection = ({ pool }: { pool: number[] }) => (
    <div
        css={{
            background: colors.background2,
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
        }}
    >
        <p css={{ fontSize: '0.8rem', color: colors.text, opacity: 0.6, marginBottom: 12 }}>
            예측 번호 풀 ({pool.length}개)
        </p>
        <div css={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {pool.map((num) => (
                <NumberButton key={num} number={num} disabled />
            ))}
        </div>
    </div>
);

// ── 조합 행 ───────────────────────────────────────────
const ComboRow = ({ combo, onAdd }: { combo: Combo; onAdd: () => void }) => (
    <div
        css={{
            background: colors.background2,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
    >
        {/* 번호 */}
        <div css={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {combo.nums.map((num, i) => (
                <NumberButton key={i} number={num} disabled />
            ))}
        </div>

        {/* 통계 + 추가 버튼 */}
        <div css={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div css={{ display: 'flex', gap: 10 }}>
                {[
                    { label: '합', value: combo.sum },
                    { label: '홀', value: `${combo.oddCnt}:${6 - combo.oddCnt}` },
                    { label: '고', value: `${combo.highCnt}:${6 - combo.highCnt}` },
                ].map(({ label, value }) => (
                    <div key={label} css={{ textAlign: 'center' }}>
                        <p css={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: 2 }}>{label}</p>
                        <p css={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{value}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={onAdd}
                css={{
                    padding: '6px 14px',
                    background: colors.primary.main,
                    fontSize: '0.8rem',
                    borderRadius: 2,
                    '&:hover': { background: colors.primary.dark },
                }}
            >
                담기
            </button>
        </div>
    </div>
);

// ── 메인 페이지 ───────────────────────────────────────
const PredictPage = () => {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [count, setCount] = useState(5);
    const [useBan, setUseBan] = useState(true);
    const [curSavePick, setSavePick] = useRecoilState<(number[] | null)[]>(savePickState);

    const handleGenerate = () => {
        setCombos(genCombos(DUMMY_PICK_POOL, count, useBan));
    };

    const handleAdd = (nums: number[]) => {
        if (curSavePick.length >= 5) {
            alert('저장함이 가득 찼습니다 (최대 5개)');
            return;
        }
        setSavePick((s) => [...s, nums]);
        alert(`저장함에 추가됨 (${curSavePick.length + 1}/5)`);
    };

    return (
        <View>
            <div css={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* 타이틀 */}
                <p css={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.white }}>로또 예측</p>

                {/* 설정 */}
                <div
                    css={{
                        background: colors.background2,
                        padding: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 16,
                        alignItems: 'flex-end',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* 회차 입력 */}
                    <div>
                        <p css={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 6 }}>예측 회차</p>
                        <input
                            type='number'
                            defaultValue={1217}
                            css={{
                                width: 100,
                                padding: '8px 12px',
                                background: colors.background,
                                border: `1px solid ${colors.line}`,
                                fontSize: '0.9rem',
                            }}
                        />
                    </div>

                    {/* 생성 개수 */}
                    <div>
                        <p css={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 6 }}>생성 개수</p>
                        <input
                            type='number'
                            value={count}
                            min={1}
                            max={20}
                            onChange={(e) => setCount(Number(e.target.value))}
                            css={{
                                width: 80,
                                padding: '8px 12px',
                                background: colors.background,
                                border: `1px solid ${colors.line}`,
                                fontSize: '0.9rem',
                            }}
                        />
                    </div>

                    {/* 밴 패턴 토글 */}
                    <button
                        onClick={() => setUseBan((v) => !v)}
                        css={{
                            padding: '8px 16px',
                            background: useBan ? colors.primary.main : colors.background,
                            border: `1px solid ${useBan ? colors.primary.main : colors.line}`,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                        }}
                    >
                        밴 패턴 {useBan ? 'ON' : 'OFF'}
                    </button>

                    {/* 예측 버튼 */}
                    <button
                        onClick={handleGenerate}
                        css={{
                            padding: '8px 24px',
                            background: colors.primary.main,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            '&:hover': { background: colors.primary.dark },
                        }}
                    >
                        번호 생성
                    </button>
                </div>

                {/* 번호 풀 */}
                <PoolSection pool={DUMMY_PICK_POOL} />

                {/* 생성된 조합 */}
                {combos.length > 0 && (
                    <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p css={{ fontSize: '0.85rem', opacity: 0.6 }}>{combos.length}개 조합 생성됨</p>
                        {combos.map((combo, i) => (
                            <ComboRow key={i} combo={combo} onAdd={() => handleAdd(combo.nums)} />
                        ))}
                    </div>
                )}
            </div>
        </View>
    );
};

export default PredictPage;
