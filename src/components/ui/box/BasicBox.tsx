import { css } from '@emotion/react';
import { HTMLAttributes, ReactNode } from 'react';
import { V } from '../div/V';
import Txt from '../typography/Txt';

type Types = {
    title?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;
export const BasicBox = (props: Types) => {
    const { children, title, ...rest } = props;

    return (
        <V.Column
            className='basic_box'
            css={css`
                padding: 15px 20px;

                display: flex;
                flex-direction: column;
                gap: 20px;

                background: #4d5156;

                @media (max-width: 768px) {
                    width: 100%;
                }
            `}
            {...rest}
        >
            {!!title && <Txt>{title}</Txt>}
            {children}
        </V.Column>
    );
};

export default BasicBox;
