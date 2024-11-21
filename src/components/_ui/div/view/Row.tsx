import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { FlexTypes } from '../type';

type Types = FlexTypes & HTMLAttributes<HTMLDivElement>;

export const Row = forwardRef((props: Types, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, ...rest } = props;

    return (
        <div
            ref={ref}
            className='row'
            css={{
                position: 'relative',
                display: 'flex',
                // '&:active': { opacity: (!!props.onClick && props?.touchOpacity) ?? 0.8 },
            }}
            {...rest}
        >
            {children}
        </div>
    );
});

Row.displayName = 'VRow';
