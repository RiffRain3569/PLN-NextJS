import NumberButton from '@components/_ui/button/NumberButton';
import PositionButton from '@components/_ui/button/PositionButton';
import LttPickAreaContent from '@components/client/home/LttPickAreaContent';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { posPicksState } from '@store/lotto';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isEqual, shuffleArray } from 'utils/common';
import { is_ban_patten } from 'utils/lotto';

interface LttPositionPickPanelProps {
    buyLotto?: (lttNums: number[][]) => void;
}

const Container = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px solid #000',
}));

const Content = styled(Box)(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '3px',
}));

const LttPositionPickPanel: React.FC<LttPositionPickPanelProps> = ({ buyLotto }) => {
    const [curPos, setPos] = useState<number>(-1);
    const [curPosPicks, setPosPicks] = useRecoilState<number[][]>(posPicksState);
    const [curLttNums, setLttNums] = useState<number[][]>([]);
    const [curRandomCnt, setRandomCnt] = useState<number>(1);
    const [curIsBan, setIsBan] = useState<boolean>(true);

    const handleGenLttNums = () => {
        let result: number[][] = [];

        for (let i = 0; i < curRandomCnt * 10; i++) {
            const selectLtt: number[] = [...Array(6).keys()]
                .reduce((a: number[], v: number): number[] => {
                    for (const num of shuffleArray(curPosPicks[v])) {
                        if (!a.includes(num)) {
                            a = [...a, num];
                            break;
                        }
                    }
                    return a;
                }, [])
                .sort((a, b) => a - b);

            // 밴 패턴이면 추가 X
            if (curIsBan && is_ban_patten(selectLtt)) {
                continue;
            }

            let isDuplicate = false;
            for (const lotto of result) {
                if (isEqual(lotto, selectLtt)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                result.push(selectLtt);
            }
            if (result.length >= curRandomCnt) {
                break;
            }
        }
        setLttNums(result);
    };

    const allPicks = curPosPicks.filter((x) => x.length > 0).length === 6;
    return (
        <Container>
            <Box>위치별 선택한 번호 범위의 랜덤 번호 생성</Box>
            {curPos >= 0 && curPos <= 6 && (
                <LttPickAreaContent
                    setValue={curPosPicks[curPos]}
                    onChange={(picks) => {
                        setPosPicks((s) => [...s.slice(0, curPos), picks, ...s.slice(curPos + 1)]);
                    }}
                />
            )}
            <Box style={{ display: 'flex', gap: '3px', padding: '10px' }}>
                {Array.from(Array(6).keys()).map((num, key) => (
                    <PositionButton key={key} number={num + 1} onClick={() => setPos(num)} selected={num === curPos} />
                ))}
            </Box>
            <Box style={{ display: 'flex', gap: '3px', padding: '0 10px' }}>
                <Button variant='contained' onClick={() => setPosPicks([[], [], [], [], [], []])}>
                    초기화
                </Button>
            </Box>
            <Box>
                <Button variant='contained' onClick={() => setIsBan((s) => !s)}>
                    {curIsBan ? '밴 패턴 적용 중' : '밴 패턴 미적용'}
                </Button>
            </Box>
            <Box>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>생성 개수: </Typography>
                        <TextField
                            style={{ width: '50px' }}
                            onChange={(e) => setRandomCnt(Number(e.target.value))}
                            defaultValue={1}
                        />
                    </Box>
                    <Button variant='contained' onClick={handleGenLttNums}>
                        고른 번호 중 랜덤 선택
                    </Button>
                </Box>
            </Box>
            {curLttNums.length > 0 && (
                <>
                    {curLttNums.map((lttNum, rowKey) => (
                        <Content key={rowKey}>
                            {lttNum.map((num, colKey) => (
                                <NumberButton key={colKey} number={num} />
                            ))}
                            <Button variant='contained' onClick={() => buyLotto?.([lttNum])}>
                                구매
                            </Button>
                        </Content>
                    ))}
                </>
            )}
        </Container>
    );
};

export default LttPositionPickPanel;
