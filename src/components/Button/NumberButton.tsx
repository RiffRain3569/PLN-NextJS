import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

interface NumberButtonProps extends ButtonProps {
    number: number;
    selected?: boolean;
}

const CircleButton = styled(Button)<{ selected?: boolean; tens: number }>(({ theme, selected, tens }) => ({
    borderRadius: '50%',
    minWidth: '40px',
    minHeight: '40px',
    padding: '0',
    lineHeight: '40px',
    fontSize: '1rem',
    backgroundColor: theme.palette[selected ? 'secondary' : `ltt${tens}x`]?.main,
    '&:hover': {
        backgroundColor: theme.palette[selected ? 'secondary' : `ltt${tens}x`]?.dark,
    },
}));

const NumberButton: React.FC<NumberButtonProps> = ({ number, sx, ...props }) => {
    return (
        <CircleButton variant='contained' tens={Math.ceil(number / 10) - 1} {...props}>
            {number}
        </CircleButton>
    );
};

export default NumberButton;
