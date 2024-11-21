// import { useUid } from '@/libs/hooks'
import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
// import { FieldContainer } from './container/FieldContainer'

const TextField = forwardRef((props: InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => {
    return <input ref={ref} type='text' {...props} />;
});
TextField.displayName = 'TextField';
export { TextField };
