import { V } from '@components/_ui/div/V';
import { useEffect, useState } from 'react';
import NumberButton from '../button/NumberButton';
import Txt from '../typography/Txt';

interface Props {
    widthNums?: number;
    values?: number[];
    onChange?: (values: number[]) => void;
    gap?: number;
}

const LttPick = ({ widthNums = 7, values = [], onChange, gap = 8 }: Props) => {
    const [curPicks, setPicks] = useState<number[]>(values);

    const handlePicks = (num: number) => {
        const newPicks = curPicks.includes(num) ? curPicks.filter((x) => x !== num) : curPicks.concat(num);
        onChange?.(newPicks);
        setPicks(newPicks);
    };

    useEffect(() => {
        if ((values || []).length > 0) {
            onChange?.(values);
            setPicks(values);
        }
    }, [values]);
    return (
        <V.Row css={{ width: `calc((32px + ${gap}px) * ${widthNums} - ${gap}px)`, flexWrap: 'wrap', gap }}>
            {[...Array(45).keys()].map((num, key) => (
                <NumberButton
                    key={key}
                    number={num + 1}
                    onClick={() => handlePicks(num + 1)}
                    selected={curPicks.includes(num + 1)}
                />
            ))}
            <V.Row css={{ alignItems: 'center' }}>
                <Txt>{curPicks.length} selected</Txt>
            </V.Row>
        </V.Row>
    );
};

export default LttPick;
