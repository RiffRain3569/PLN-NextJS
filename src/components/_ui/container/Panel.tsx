import { colors } from '@components/_layout/client/theme/colors';
import { css } from '@emotion/react';
import { HTMLAttributes, ReactNode } from 'react';
import { V } from '../div/V';
import Txt from '../typography/Txt';

type Types = {
    title?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;
export const Panel = (props: Types) => {
    const { children, title, ...rest } = props;

    return (
        <V.Column
            className='panel'
            css={css`
                padding: 20px 20px;
                gap: 20px;
                background: ${colors.background2};

                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
                @media (max-width: 768px) {
                    width: 100%;
                }
            `}
            {...rest}
        >
            {!!title && <Txt size={18}>{title}</Txt>}
            {children}
        </V.Column>
    );
};

export default Panel;
