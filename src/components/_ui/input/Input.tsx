import { Children, cloneElement, LabelHTMLAttributes, useId } from 'react';
import Txt from '../typography/Txt';
import { TextField } from './TextField';

type Types = {
    label?: string;
} & LabelHTMLAttributes<HTMLLabelElement>;
export function Input({ label, ...props }: Types) {
    const child = Children.only(props.children) as any;

    const id = child.props.id ?? useId();

    return (
        <label htmlFor={id} {...props}>
            {!!label && <Txt css={{ marginBottom: 4 }}>{label}</Txt>}
            {cloneElement(child, { id, ...child.props })}
        </label>
    );
}

Input.TextField = TextField;
