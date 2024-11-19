import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';

export const Row = forwardRef((props: HTMLAttributes<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, style, ...rest } = props;

    return (
        <div
            ref={ref}
            className='row'
            css={{
                position: 'relative',
                display: 'flex',
                ...style,
                // '&:active': { opacity: (!!props.onClick && props?.touchOpacity) ?? 0.8 },
            }}
            {...rest}
        >
            {children}
        </div>
    );
});

Row.displayName = 'VRow';
