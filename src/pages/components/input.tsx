import View from '@components/_layout/client/View';
import { Card, NumberButton, Select, V } from '@components/_ui';
import { Input } from '@components/_ui/input/Input';

const Page = () => {
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Card title='Input' css={{ width: '400px' }}>
                    <Input label='텍스트'>
                        <Input.TextField type='text' />
                    </Input>
                    <Input label='비밀번호'>
                        <Input.TextField type='password' />
                    </Input>
                    <Input label='텍스트 영역'>
                        <Input.TextField type='textarea' />
                    </Input>
                    <Input label='이메일'>
                        <Input.TextField type='email' />
                    </Input>
                    <Input label='숫자'>
                        <Input.TextField type='number' />
                    </Input>
                    <Input label='날짜'>
                        <Input.TextField type='date' />
                    </Input>
                    <Input label='파일'>
                        <Input.TextField type='file' />
                    </Input>
                    <Input label='체크박스'>
                        <V.Row>
                            <Input.TextField type='checkbox' />
                            <Input.TextField type='checkbox' />
                            <Input.TextField type='checkbox' />
                        </V.Row>
                    </Input>
                    <Input label='라디오'>
                        <V.Row>
                            <Input.TextField type='radio' name='a' />
                            <Input.TextField type='radio' name='a' />
                            <Input.TextField type='radio' name='a' />
                        </V.Row>
                    </Input>
                </Card>
                <Card title='Select' css={{ width: '400px' }}>
                    <Input>
                        <Select>
                            <NumberButton number={1} />
                            <NumberButton number={2} />
                            <NumberButton number={3} />
                        </Select>
                    </Input>
                </Card>
            </V.Row>
        </View>
    );
};

export default Page;
