import { Oval } from 'react-loader-spinner'

export default function Spinner({ size = 25, dark, ...props }: any) {
    return (
        <Oval
            height={size}
            width={size}
            {...props}
            color={dark ? '#ddd' : '#353535'}
            secondaryColor={dark ? '#fff' : '#5d5d5d'}
        />
    )
}
