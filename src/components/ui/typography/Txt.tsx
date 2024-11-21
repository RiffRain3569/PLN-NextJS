import { HTMLAttributes } from 'react';

const Txt = (props: HTMLAttributes<HTMLParagraphElement>) => {
    return <p {...props}>{props.children}</p>;
};

export default Txt;
