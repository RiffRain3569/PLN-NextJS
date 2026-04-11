/** @jsxImportSource @emotion/react */
import NumberButton from '@components/_ui/button/NumberButton';
import { colors } from '@components/_layout/client/theme/colors';

const makeWeights = (seed: number) =>
    Array.from({ length: 45 }, (_, i) => ({
        num: i + 1,
        w: (((i + 1) * ((seed % 10) + 7) + seed) % 91) + 10,
    })).sort((a, b) => b.w - a.w);

const DUMMY_WEIGHT_HISTORY = [
    { id: 1216, winNums: [3, 14, 22, 31, 38, 45], weights: makeWeights(1216) },
    { id: 1215, winNums: [7, 11, 21, 30, 37, 43], weights: makeWeights(1215) },
    { id: 1214, winNums: [4, 12, 19, 28, 35, 41], weights: makeWeights(1214) },
    { id: 1213, winNums: [6, 13, 24, 29, 36, 40], weights: makeWeights(1213) },
    { id: 1212, winNums: [2, 9, 18, 27, 34, 42], weights: makeWeights(1212) },
];

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
        <div css={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 'bold', color: '#4b5563', flexShrink: 0, border: '1px solid #2a2a2a',
        }}>
            {num}
        </div>
    );

const WeightTab = () => (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DUMMY_WEIGHT_HISTORY.map((item) => (
            <div key={item.id} css={{ ...panelCss, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p css={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.white }}>{item.id}회</p>
                <div css={{ overflowX: 'auto' }}>
                    <div css={{ display: 'flex', gap: 8, minWidth: 'max-content', paddingBottom: 4 }}>
                        {item.weights.map(({ num, w }) => (
                            <div key={num} css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                <HistoryBall num={num} isWin={item.winNums.includes(num)} />
                                <span css={{ fontSize: '0.65rem', opacity: 0.55 }}>{w}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
        <p css={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.35, padding: '16px 0' }}>
            API 연동 후 전체 이력이 표시됩니다
        </p>
    </div>
);

export default WeightTab;
