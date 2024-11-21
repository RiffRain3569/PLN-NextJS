import { colors } from '@components/_layout/client/theme/colors';
import { Oval, OvalProps } from 'react-loader-spinner';

type Types = {
    size?: number;
} & OvalProps;

export default function Spinner({ size = 25, ...props }: Types) {
    return (
        <Oval
            height={size}
            width={size}
            strokeWidth={5}
            strokeWidthSecondary={7}
            color={colors.primary.dark}
            secondaryColor={colors.text}
            {...props}
        />
    );
}
