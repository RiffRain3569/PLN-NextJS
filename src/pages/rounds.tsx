/** @jsxImportSource @emotion/react */
import { colors } from '@components/_layout/client/theme/colors';
import View from '@components/_layout/client/View';
import NumberButton from '@components/_ui/button/NumberButton';

// 임시 더미 데이터 (API 연동 전)
const DUMMY_ROUNDS = Array.from({ length: 20 }, (_, i) => ({
    lottoId: 1216 - i,
    date: '2026-03-21',
    nums: [3, 15, 24, 10, 23, 14],
    bonus: 25,
}));

const RoundRow = ({ lottoId, date, nums, bonus }: { lottoId: number; date: string; nums: number[]; bonus: number }) => (
    <div
        css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            gap: 12,
            flexWrap: 'wrap',
        }}
    >
        {/* 회차 + 날짜 */}
        <div css={{ minWidth: 100 }}>
            <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white }}>{lottoId}회</p>
            <p css={{ fontSize: '0.75rem', color: colors.text, opacity: 0.6, marginTop: 2 }}>{date}</p>
        </div>

        {/* 당첨번호 */}
        <div css={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {nums.map((num, i) => (
                <NumberButton key={i} number={num} disabled />
            ))}
            <span css={{ color: colors.text, opacity: 0.5, margin: '0 4px', fontSize: '1rem' }}>+</span>
            <NumberButton number={bonus} disabled css={{ opacity: 0.7 }} />
        </div>
    </div>
);

const RoundsPage = () => {
    return (
        <View>
            <div css={{ padding: '24px 0' }}>
                {/* 페이지 타이틀 */}
                <p css={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.white, paddingBottom: 20 }}>
                    회차별 당첨번호
                </p>

                {/* 리스트 */}
                <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {DUMMY_ROUNDS.map((round) => (
                        <div
                            key={round.lottoId}
                            css={{
                                background: colors.background2,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
                            }}
                        >
                            <RoundRow {...round} />
                        </div>
                    ))}
                </div>
            </div>
        </View>
    );
};

export default RoundsPage;
