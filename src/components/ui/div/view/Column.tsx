import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { FlexTypes } from '../type';

type Types = FlexTypes & HTMLAttributes<HTMLDivElement>;

export const Column = forwardRef((props: Types, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, gap, ...rest } = props;

    return (
        <div
            ref={ref}
            className='column'
            css={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                // '&:active': { opacity: (!!props.onClick && props?.touchOpacity) ?? 0.8 },
            }}
            {...rest}
        >
            {props.children}
        </div>
    );
});

Column.displayName = 'VColumn';
