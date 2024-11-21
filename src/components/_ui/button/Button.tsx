import { colors } from '@components/_layout/client/theme/colors';
import { ButtonHTMLAttributes } from 'react';

type Types = {
    color?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Types) => {
    const { color = 'primary' } = props;
    return (
        <button
            css={{
                width: '100%',
                minHeight: '40px',
                padding: '6px 16px',
                backgroundColor: colors[color].main,
                lineHeight: '14px',
                fontSize: '14px',
                '&:hover': {
                    backgroundColor: colors[color].dark,
                },
                '&:disabled': {
                    backgroundColor: colors[color].light,
                    color: colors[color].disableText,
                },
            }}
            {...props}
        >
            {props.children}
        </button>
    );
};

export default Button;
