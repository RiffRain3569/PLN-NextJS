// import { useUid } from '@/libs/hooks'
import { colors } from '@components/_layout/client/theme/colors';
import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import { V } from '../div/V';
// import { FieldContainer } from './container/FieldContainer'

const TextField = forwardRef((props: InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <V.Column css={[{ height: 40, borderBottom: `1px solid ${colors.text}` }]}>
            <input ref={ref} type='text' css={{ height: '100%' }} {...props} />
        </V.Column>
    );
});
TextField.displayName = 'TextField';
export { TextField };
