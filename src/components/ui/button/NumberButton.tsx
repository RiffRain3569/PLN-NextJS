import { HTMLAttributes } from 'react';

type Types = {
    number: number;
    selected?: boolean;
};

const theme = {
    ltt0x: {
        main: '#fbc400',
        dark: '#7b1fa2',
        contrastText: '#fff',
    },
    ltt1x: {
        main: '#69c8f2',
        dark: '#7b1fa2',
        contrastText: '#fff',
    },
    ltt2x: {
        main: '#ff7272',
        dark: '#7b1fa2',
        contrastText: '#fff',
    },
    ltt3x: {
        main: '#aaa',
        dark: '#7b1fa2',
        contrastText: '#fff',
    },
    ltt4x: {
        main: '#b0d840',
        dark: '#7b1fa2',
        contrastText: '#fff',
    },
};
const NumberButton = ({ number, selected, children, style, ...props }: Types & HTMLAttributes<HTMLButtonElement>) => {
    const tens = (Math.ceil(number / 10) - 1) as 1 | 2 | 3 | 4;
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
                backgroundColor: theme[`ltt${tens}x`]?.[selected ? 'dark' : 'main'],
                '&:hover': {
                    backgroundColor: theme[`ltt${tens}x`].dark,
                },
                ...style,
            }}
            {...props}
        >
            {number}
        </button>
    );
};

export default NumberButton;
