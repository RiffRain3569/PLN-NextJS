import { colors } from '@components/_layout/client/theme/colors';
import { css } from '@emotion/react';
import { Children, cloneElement, LabelHTMLAttributes, useId } from 'react';
import { TextField } from './TextField';

export function Input(props: LabelHTMLAttributes<HTMLLabelElement>) {
    const child = Children.only(props.children) as any;

    const id = child.props.id ?? useId();

    return (
        <label
            htmlFor={id}
            css={css`
                input {
                    background: none;
                    color: ${colors.text};
                    border: none;
                    border-bottom: 1px solid ${colors.text};
                }
            `}
            {...props}
        >
            {cloneElement(child, { id, ...child.props })}
        </label>
    );
}

Input.TextField = TextField;
