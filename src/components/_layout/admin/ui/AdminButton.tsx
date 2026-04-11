import { adminColors } from '@components/_layout/admin/theme/colors';
import { Oval } from 'react-loader-spinner';
import { ButtonHTMLAttributes } from 'react';

type Types = {
    loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const AdminButton = ({ loading, disabled, ...props }: Types) => {
    return (
        <button
            css={{
                width: '100%',
                minHeight: '40px',
                padding: '6px 16px',
                backgroundColor: adminColors.primary.main,
                color: adminColors.primary.contrastText,
                borderRadius: 6,
                fontWeight: 'bold',
                fontSize: 14,
                '&:hover': {
                    backgroundColor: adminColors.primary.dark,
                },
                '&:disabled': {
                    backgroundColor: adminColors.primary.light,
                    color: adminColors.primary.disableText,
                    cursor: 'not-allowed',
                },
            }}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <Oval
                    height={20}
                    width={20}
                    strokeWidth={5}
                    strokeWidthSecondary={7}
                    color={adminColors.primary.contrastText}
                    secondaryColor={adminColors.primary.light}
                />
            ) : (
                props.children
            )}
        </button>
    );
};

export default AdminButton;
