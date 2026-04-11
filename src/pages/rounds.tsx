/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { colors } from '@components/_layout/client/theme/colors';
import View from '@components/_layout/client/View';
import NumberButton from '@components/_ui/button/NumberButton';
import { fetchRounds } from '@apis/client/lotto';

type LottoItem = {
    id: number;
    date: string;
    nums: number[];
    bonus: number;
};

type RoundsPage = {
    items: LottoItem[];
    nextCursor: number | null;
};

const SkeletonRow = () => (
    <div
        css={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            flexWrap: 'wrap',
        }}
    >
        <div css={{ minWidth: 100 }}>
            <div css={{ height: 14, width: 48, background: colors.background2, borderRadius: 4, marginBottom: 6 }} />
            <div css={{ height: 12, width: 72, background: colors.background2, borderRadius: 4 }} />
        </div>
        <div css={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} css={{ width: 32, height: 32, borderRadius: '50%', background: colors.background2 }} />
            ))}
        </div>
    </div>
);

const RoundRow = ({
    round,
    isFirst,
}: {
    round: LottoItem;
    isFirst: boolean;
}) => {
    const sorted = [...round.nums].sort((a, b) => a - b);
    return (
        <div
            css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                gap: 12,
                flexWrap: 'wrap',
                ...(isFirst && {
                    borderLeft: '3px solid #7C3AED',
                }),
            }}
        >
            <div css={{ minWidth: 100 }}>
                <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white }}>
                    {round.id}회
                </p>
                <p css={{ fontSize: '0.75rem', color: colors.text, opacity: 0.5, marginTop: 2 }}>
                    {round.date}
                </p>
            </div>

            <div css={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {sorted.map((num, i) => (
                    <NumberButton key={i} number={num} disabled />
                ))}
                <span css={{ color: colors.text, opacity: 0.4, margin: '0 2px', fontSize: '0.9rem' }}>+</span>
                <div css={{ position: 'relative' }}>
                    <NumberButton number={round.bonus} disabled />
                    <div
                        css={{
                            position: 'absolute',
                            inset: -2,
                            borderRadius: '50%',
                            border: '2px solid #D97706',
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const RoundsPage = () => {
    const bottomRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<RoundsPage>({
        queryKey: ['rounds'],
        queryFn: ({ pageParam }) => fetchRounds({ cursor: pageParam as number | undefined }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialPageParam: undefined,
    });

    useEffect(() => {
        const el = bottomRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allItems = data?.pages.flatMap((p) => p.items) ?? [];

    return (
        <View>
            <div css={{ padding: '24px 0' }}>
                <p css={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.white, paddingBottom: 20 }}>
                    회차별 당첨번호
                </p>

                <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, i) => (
                              <div
                                  key={i}
                                  css={{
                                      background: 'rgba(255,255,255,0.04)',
                                      borderRadius: 8,
                                      boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
                                  }}
                              >
                                  <SkeletonRow />
                              </div>
                          ))
                        : allItems.map((round, idx) => (
                              <div
                                  key={round.id}
                                  css={{
                                      background:
                                          idx === 0
                                              ? 'rgba(124,58,237,0.12)'
                                              : 'rgba(255,255,255,0.04)',
                                      borderRadius: 8,
                                      boxShadow:
                                          idx === 0
                                              ? '0 4px 12px rgba(124,58,237,0.25)'
                                              : '0 4px 6px rgba(0,0,0,0.4)',
                                  }}
                              >
                                  <RoundRow round={round} isFirst={idx === 0} />
                              </div>
                          ))}
                </div>

                {/* 무한 스크롤 트리거 */}
                <div ref={bottomRef} css={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                    {isFetchingNextPage && (
                        <div
                            css={{
                                width: 24,
                                height: 24,
                                border: '3px solid rgba(255,255,255,0.15)',
                                borderTop: '3px solid #7C3AED',
                                borderRadius: '50%',
                                animation: 'spin 0.7s linear infinite',
                                '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
                            }}
                        />
                    )}
                </div>
            </div>
        </View>
    );
};

export default RoundsPage;
