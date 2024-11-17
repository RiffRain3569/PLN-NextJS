import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

interface PositionButtonProps extends ButtonProps {
    number: number;
    selected?: boolean;
}

const Item = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
    borderRadius: '4px',
    minWidth: '40px',
    minHeight: '40px',
    padding: '0',
    lineHeight: '40px',
    fontSize: '1rem',
    backgroundColor: theme.palette[selected ? 'secondary' : 'primary']?.main,
    '&:hover': {
        backgroundColor: theme.palette[selected ? 'secondary' : 'primary']?.dark,
    },
}));

const PositionButton: React.FC<PositionButtonProps> = ({ sx, number, ...props }) => {
    return (
        <Item variant='contained' {...props}>
            {number}
        </Item>
    );
};

export default PositionButton;
