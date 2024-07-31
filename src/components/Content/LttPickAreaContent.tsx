import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import NumberButton from 'components/Button/NumberButton';
import React, { useState, useEffect } from 'react';
import { isEqual } from 'utils/common';

interface LttPickAreaProps {
    setValue?: number[];
    onChange?: (lttNums: number[]) => void;
}

const Container = styled(Box)(() => ({
    border: '1px solid black',
    display: 'flex',
    gap: '5px',
    width: '332px',
    padding: '10px',
    flexWrap: 'wrap',
}));

const LttPickAreaContent: React.FC<LttPickAreaProps> = ({ setValue, onChange }) => {
    const [curPicks, setPicks] = useState<number[]>([]);

    useEffect(() => {
        if (!!setValue) {
            if (!isEqual(curPicks, setValue ?? [])) {
                setPicks(setValue ?? []);
            }
        }
    }, [setValue]);

    useEffect(() => {
        if (curPicks.length >= 0) {
            onChange?.(curPicks);
        }
    }, [curPicks]);

    const handlePicks = (num: number) => {
        setPicks((s) => (s.includes(num) ? s.filter((x) => x !== num) : s.concat(num)));
    };

    return (
        <Container>
            {[...Array(45).keys()].map((num, key) => (
                <NumberButton
                    key={key}
                    number={num + 1}
                    onClick={() => handlePicks(num + 1)}
                    selected={curPicks.includes(num + 1)}
                />
            ))}
            <Typography>{curPicks.length} selected</Typography>
        </Container>
    );
};

export default LttPickAreaContent;
