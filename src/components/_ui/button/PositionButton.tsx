import { colors } from '@components/_layout/client/theme/colors';
import { ButtonHTMLAttributes } from 'react';
import Button from './Button';

type Types = {
    number: number;
    selected: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>;

const PositionButton = ({ number, selected, ...props }: Types) => {
    return (
        <Button
            color={'primary'}
            css={{
                backgroundColor: selected ? colors.primary.dark : colors.primary.main,
            }}
            {...props}
        >
            {number}
        </Button>
    );
};

export default PositionButton;
