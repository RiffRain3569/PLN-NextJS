import NumberButton from '@components/_ui/button/NumberButton';
import LttPickAreaContent from '@components/client/home/LttPickAreaContent';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { picksState } from '@store/lotto';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isEqual, shuffleArray } from 'utils/common';
import { is_ban_patten } from 'utils/lotto';

interface LttPickPanelProps {
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

const LttPickPanel: React.FC<LttPickPanelProps> = ({ buyLotto }) => {
    const [curPicks, setPicks] = useRecoilState<number[]>(picksState);
    const [curLttNums, setLttNums] = useState<number[][]>([]);
    const [curRandomCnt, setRandomCnt] = useState<number>(1);
    const [curIsBan, setIsBan] = useState<boolean>(true);

    const handleGenLttNums = () => {
        let result: number[][] = [];

        for (let i = 0; i < curRandomCnt * 10; i++) {
            // 랜덤 번호 추출
            const selectLtt = shuffleArray(curPicks)
                .slice(0, 6)
                .sort((a, b) => a - b);

            // 밴 패턴이면 추가 X
            if (curIsBan && is_ban_patten(selectLtt)) {
                continue;
            }

            // 중복 제거
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

            // 탈출 조건
            if (result.length >= curRandomCnt) {
                break;
            }
        }
        setLttNums(result);
    };

    return (
        <Container>
            <Box>선택한 번호 범위의 랜덤 번호 생성</Box>
            <Box style={{ display: 'flex' }}>
                <Box>
                    <LttPickAreaContent onChange={(picks) => setPicks(picks)} />
                </Box>
                <Box
                    style={{
                        flex: '1 1 auto',
                        padding: '10px',
                        gap: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box>
                        <Button variant='contained' onClick={() => setIsBan((s) => !s)}>
                            {curIsBan ? '밴 패턴 적용 중' : '밴 패턴 미적용'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>생성 개수: </Typography>
                    <TextField
                        style={{ width: '50px' }}
                        onChange={(e) => setRandomCnt(Number(e.target.value))}
                        defaultValue={1}
                    />
                </Box>
                <Button variant='contained' onClick={handleGenLttNums} disabled={curPicks.length < 6}>
                    고른 번호 중 랜덤 선택
                </Button>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            </Box>
        </Container>
    );
};

export default LttPickPanel;
