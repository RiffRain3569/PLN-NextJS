import { HTMLAttributes } from 'react';

type Types = {
    size?: number;
    weight?: string | number;
} & HTMLAttributes<HTMLParagraphElement>;

const Txt = ({ size, weight, ...props }: Types) => {
    return (
        <p
            css={{
                fontSize: size ?? 14,
                fontWeight: weight ?? 'normal',
            }}
            {...props}
        >
            {props.children}
        </p>
    );
};

export default Txt;
