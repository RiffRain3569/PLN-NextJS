import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';

export const Column = forwardRef((props: HTMLAttributes<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, style, ...rest } = props;

    return (
        <div
            ref={ref}
            className='column'
            css={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                ...style,
                // '&:active': { opacity: (!!props.onClick && props?.touchOpacity) ?? 0.8 },
            }}
            {...rest}
        >
            {props.children}
        </div>
    );
});
