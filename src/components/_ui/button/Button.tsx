import { colors } from '@components/_layout/client/theme/colors';
import { ButtonHTMLAttributes } from 'react';
import Spinner from '../custom/Spinner';

type Types = {
    color?: 'primary' | 'secondary';
    loading?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>;

const Button = ({ color = 'primary', loading, disabled, ...props }: Types) => {
    return (
        <button
            css={{
                width: '100%',
                minHeight: '40px',
                padding: '6px 16px',
                backgroundColor: colors[color].main,
                lineHeight: '14px',
                fontSize: '14px',

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                '&:hover': {
                    backgroundColor: colors[color].dark,
                },
                '&:disabled': {
                    backgroundColor: colors[color].light,
                    color: colors[color].disableText,
                    cursor: 'not-allowed',
                },
            }}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? <Spinner /> : props.children}
        </button>
    );
};

export default Button;
