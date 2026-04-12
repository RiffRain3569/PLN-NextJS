/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { colors } from '@components/_layout/client/theme/colors';
import NumberButton from '@components/_ui/button/NumberButton';
import { fetchPredictWeight } from '@apis/client/lotto';

type WeightItem = { lottoId: number; weightList: number[]; winNums: number[] | null; createdAt: string };

const panelCss = {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: '16px 20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
};

const HistoryBall = ({ num, isWin }: { num: number; isWin: boolean }) =>
    isWin ? (
        <NumberButton number={num} size="md" mobileSize="sm" disabled />
    ) : (
        <NumberButton
            number={num}
            size="md"
            mobileSize="sm"
            disabled
            css={{
                background: '#1a1a1a',
                boxShadow: 'none',
                color: '#4b5563',
                border: '1px solid #2a2a2a',
                '&:disabled': { background: '#1a1a1a', boxShadow: 'none' },
            }}
        />
    );

const WeightTab = () => {
    const [items, setItems] = useState<WeightItem[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const load = async (cursor?: number) => {
        setLoading(true);
        try {
            const res = await fetchPredictWeight({ cursor, limit: 20 });
            setItems((prev) => (cursor ? [...prev, ...res.items] : res.items));
            setNextCursor(res.nextCursor ?? null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item) => {
                const sorted = item.weightList
                    .map((w, i) => ({ num: i + 1, raw: w, w: Math.round(w * 100) }))
                    .sort((a, b) => b.raw - a.raw);
                return (
                    <div key={item.lottoId} css={{ ...panelCss, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <p css={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.white }}>{item.lottoId}회</p>
                        <div css={{ overflowX: 'auto' }}>
                            <div css={{ display: 'flex', gap: 8, minWidth: 'max-content', paddingBottom: 4 }}>
                                {sorted.map(({ num, w }) => (
                                    <div
                                        key={num}
                                        css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                                    >
                                        <HistoryBall num={num} isWin={item.winNums?.includes(num) ?? false} />
                                        <span css={{ fontSize: '0.65rem', opacity: 0.55 }}>{w}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
            {nextCursor && (
                <button
                    onClick={() => load(nextCursor)}
                    disabled={loading}
                    css={{
                        padding: '10px',
                        border: `1px solid ${colors.line}`,
                        borderRadius: 6,
                        background: 'none',
                        fontSize: '0.85rem',
                        opacity: loading ? 0.4 : 0.7,
                        '&:hover:not(:disabled)': { opacity: 1 },
                    }}
                >
                    {loading ? '로딩 중...' : '더 보기'}
                </button>
            )}
            {!loading && items.length === 0 && (
                <p css={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.35, padding: '16px 0' }}>
                    데이터가 없습니다
                </p>
            )}
        </div>
    );
};

export default WeightTab;
