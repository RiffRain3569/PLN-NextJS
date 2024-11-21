import View from '@components/_layout/client/View';
import { Card, V } from '@components/_ui';
import { Input } from '@components/_ui/input/Input';

const Page = () => {
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Card css={{ width: '400px' }}>
                    <Input>
                        <Input.TextField />
                    </Input>
                </Card>
            </V.Row>
        </View>
    );
};

export default Page;
