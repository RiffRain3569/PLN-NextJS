import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import NumberButton from 'components/Button/NumberButton';
import React, { useState, useEffect } from 'react';
import { isEqual, shuffleArray } from 'utils/common';

interface LttPickAreaProps {
    onChange?: (lttNums: number[][]) => void;
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

const LttPickAreaContent: React.FC<LttPickAreaProps> = ({ onChange }) => {
    const [curPicks, setPicks] = useState<number[]>([]);
    const [curLttNums, setLttNums] = useState<number[][]>([]);
    const [curRandomCnt, setRandomCnt] = useState<number>(1);

    useEffect(() => {
        if (curLttNums.length > 0) {
            onChange?.(curLttNums);
        }
    }, [curLttNums]);

    const handlePicks = (num: number) => {
        setPicks((s) => (s.includes(num) ? s.filter((x) => x !== num) : s.concat(num)));
    };

    const handleGenLttNums = () => {
        let result: number[][] = [];

        for (let i = 0; i < curRandomCnt * 10; i++) {
            const selectLtt = shuffleArray(curPicks)
                .slice(0, 6)
                .sort((a, b) => a - b);

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

    return (
        <Container>
            <Content>
                {Array.from(Array(45).keys()).map((num, key) => (
                    <NumberButton
                        key={key}
                        number={num + 1}
                        onClick={() => handlePicks(num + 1)}
                        selected={curPicks.includes(num + 1)}
                    />
                ))}
                <Typography>{curPicks.length} selected</Typography>
            </Content>
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
                    <Button variant='contained' onClick={handleGenLttNums} disabled={curPicks.length < 6}>
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
                        </Content>
                    ))}
                </>
            )}
        </Container>
    );
};

export default LttPickAreaContent;
