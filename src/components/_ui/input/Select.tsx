// import { useUid } from '@/libs/hooks'
import { Children, ForwardedRef, forwardRef, SelectHTMLAttributes } from 'react';
import { V } from '../div/V';

const Select = forwardRef((props: SelectHTMLAttributes<HTMLSelectElement>, ref: ForwardedRef<HTMLSelectElement>) => {
    const items = Children.toArray(props.children);
    return (
        <V.Column>
            <select ref={ref} css={{ color: 'black' }} {...props}>
                {items.map((el) => (
                    <option>{el}</option>
                ))}
            </select>
        </V.Column>
    );
});
Select.displayName = 'TextField';
export { Select };
