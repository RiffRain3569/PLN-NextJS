import { colors } from '@components/_layout/client/theme/colors';
import { ButtonHTMLAttributes, ElementType } from 'react';
import Spinner from '../custom/Spinner';

type Types = {
    color?: 'primary' | 'secondary';
    loading?: boolean;
    Icon: ElementType;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'children'>;

const IconButton = ({ color = 'primary', loading, disabled, Icon, ...props }: Types) => {
    return (
        <button
            css={{
                borderRadius: '50%',
                width: '40px !important',
                height: '40px',
                padding: '0',
                backgroundColor: colors[color].main,

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
            {loading ? <Spinner /> : <Icon />}
        </button>
    );
};

export default IconButton;
