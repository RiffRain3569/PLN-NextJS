import NumberButton from '@components/_ui/button/NumberButton';
import { V } from '@components/_ui/div/V';
import Txt from '@components/_ui/typography/Txt';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { isEqual } from 'utils/common';

interface LttPickAreaProps {
    setValue?: number[];
    onChange?: (lttNums: number[]) => void;
}

const Container = styled(Box)(() => ({
    display: 'flex',
    gap: '5px',
    width: '332px',
    flexWrap: 'wrap',
}));

const LttPickAreaContent = ({ setValue, onChange }: LttPickAreaProps) => {
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
        <V.Row css={{ width: `calc(37px * 7)`, flexWrap: 'wrap', gap: 5 }}>
            {[...Array(45).keys()].map((num, key) => (
                <NumberButton
                    key={key}
                    number={num + 1}
                    onClick={() => handlePicks(num + 1)}
                    selected={curPicks.includes(num + 1)}
                />
            ))}
            <Txt>{curPicks.length} selected</Txt>
        </V.Row>
    );
};

export default LttPickAreaContent;
