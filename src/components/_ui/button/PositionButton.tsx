import { ButtonHTMLAttributes } from 'react';
import Button from './Button';

type Types = {
    number: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PositionButton = ({ number, ...props }: Types) => {
    return (
        <Button color={'primary'} {...props}>
            {number}
        </Button>
    );
};

export default PositionButton;
