import { Children, cloneElement, LabelHTMLAttributes, useId } from 'react';
import { TextField } from './TextField';

export function Input(props: LabelHTMLAttributes<HTMLLabelElement>) {
    const child = Children.only(props.children) as any;

    const id = child.props.id ?? useId();

    return (
        <label id={id} {...props}>
            {cloneElement(child, { id, ...child.props })}
        </label>
    );
}

Input.TextField = TextField;
