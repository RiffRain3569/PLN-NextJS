import { adminColors } from '@components/_layout/admin/theme/colors';
import { css } from '@emotion/react';
import { HTMLAttributes, ReactNode } from 'react';
import { V } from '@components/_ui/div/V';
import Txt from '@components/_ui/typography/Txt';

type Types = {
    title?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const AdminPanel = ({ children, title, ...rest }: Types) => {
    return (
        <V.Column
            css={css`
                padding: 20px;
                gap: 20px;
                background: #ffffff;
                border: 1px solid ${adminColors.line};
                box-shadow: 0 2px 8px rgba(22, 101, 52, 0.08);
                border-radius: 8px;
                @media (max-width: 768px) {
                    width: 100%;
                }
            `}
            {...rest}
        >
            {!!title && (
                <Txt size={18} css={{ color: adminColors.primary.dark, fontWeight: 'bold' }}>
                    {title}
                </Txt>
            )}
            {children}
        </V.Column>
    );
};

export default AdminPanel;
