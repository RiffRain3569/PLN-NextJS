import { colors } from '@components/_layout/client/theme/colors';
import { HTMLAttributes } from 'react';

const Divider = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div css={{ borderBottom: `1px solid ${colors.text}`, borderLeft: `1px solid ${colors.text}` }} {...props} />
    );
};

export default Divider;
