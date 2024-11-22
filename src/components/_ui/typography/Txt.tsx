import { HTMLAttributes } from 'react';

type Types = {
    size?: number;
    weight?: string | number;
} & HTMLAttributes<HTMLParagraphElement>;

const Txt = ({ size = 14, weight, ...props }: Types) => {
    return (
        <p
            css={{
                fontSize: `${(size ?? 14) / 16}rem`,
                fontWeight: weight ?? 'normal',
            }}
            {...props}
        >
            {props.children}
        </p>
    );
};

export default Txt;
