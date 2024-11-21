import { colors } from '@components/layout/client/theme/colors';
import { HTMLAttributes } from 'react';

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            css={{
                width: '100%',
                minHeight: '40px',
                padding: '6px 16px',
                backgroundColor: colors.red,
                color: colors.white,
                lineHeight: '14px',
                fontSize: '14px',
                '&:hover': {
                    opacity: 0.8,
                },
            }}
            {...props}
        >
            {props.children}
        </button>
    );
};

export default Button;
