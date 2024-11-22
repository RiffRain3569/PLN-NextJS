import { ButtonHTMLAttributes } from 'react';

type Types = {
    number: number;
    selected?: boolean;
};

const theme = {
    ltt0x: {
        main: '#F8E71C',
        dark: '#D48E00',
        contrastText: '#fff',
    },
    ltt1x: {
        main: '#5AC8FA',
        dark: '#003366',
        contrastText: '#fff',
    },
    ltt2x: {
        main: '#FF4C4C',
        dark: '#800020',
        contrastText: '#fff',
    },
    ltt3x: {
        main: '#D3D3D3',
        dark: '#2C2C2C',
        contrastText: '#fff',
    },
    ltt4x: {
        main: '#7ED321',
        dark: '#006400',
        contrastText: '#fff',
    },
    hovered: {
        main: '#9B4DCA',
        dark: '#6A1B9A',
        contrastText: '#fff',
    },
    selected: {
        main: '#9B4DCA',
        dark: '#6A1B9A',
        contrastText: '#fff',
    },
};
const NumberButton = ({ number, selected, children, ...props }: Types & ButtonHTMLAttributes<HTMLButtonElement>) => {
    const tens = (Math.ceil(number / 10) - 1) as 1 | 2 | 3 | 4;
    const targetColor = selected ? theme['selected'] : theme[`ltt${tens}x`];
    return (
        <button
            css={{
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                padding: '0',

                lineHeight: '32px',
                fontSize: '14px',
                color: 'white',

                textAlign: 'center',
                background: `radial-gradient(circle at left top, ${targetColor.main}, ${targetColor.dark})`,

                '&:hover': {
                    background: `radial-gradient(circle at left top, ${theme['hovered'].main}, ${theme['hovered'].dark})`,
                },

                '&:disabled': {
                    background: `radial-gradient(circle at left top, ${targetColor.main}, ${targetColor.dark})`,
                },
            }}
            {...props}
        >
            {number}
        </button>
    );
};

export default NumberButton;
