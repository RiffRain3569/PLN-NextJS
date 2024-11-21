import { dhlBuyLotto, dhlSignIn } from '@apis/dhl/ssr';
import View from '@components/_layout/client/View';
import Button from '@components/_ui/button/Button';
import Spinner from '@components/_ui/custom/Spinner';
import { Input } from '@components/_ui/input/Input';
import { Card, Txt, V } from '@components/index';
import useDhl from '@hooks/useDhl';
import { useMutation } from '@tanstack/react-query';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import LttPickPanel from '../components/client/home/LttPickPanel';
import LttPositionPickPanel from '../components/client/home/LttPositionPickPanel';

const Page = () => {
    const { uid, amount, setReset } = useDhl();
    const [curBuyResult, setBuyResult] = useState('');
    const [message, setMessage] = useState('');
    const { getValues, register, handleSubmit, watch } = useForm();

    const watchForm = watch();
    const dhlSignInMutation = useMutation(dhlSignIn, {
        onSuccess: (res) => {
            setReset(true);
        },

        onError: (error: Error) => {
            setMessage(error.message);
        },
    });

    const dhlBuyLottoMutation = useMutation(dhlBuyLotto, {
        onSuccess: (res: any) => {
            setBuyResult(res.message);
        },
        onError: (error: any) => {
            setBuyResult(error.message);
        },
    });

    const handleBuyLotto = async (dataList: null[] | number[][]) => {
        setBuyResult('로딩중...');
        dhlBuyLottoMutation.mutate({ dataList });
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        setMessage('');
        if (e.key === 'Enter') {
            handleSignIn();
        }
    };
    const handleSignIn = handleSubmit(({ userId, userPw }) => dhlSignInMutation.mutate(getValues()));

    const isLoading = dhlSignInMutation.isLoading || dhlBuyLottoMutation.isLoading;
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Card css={{ width: 400 }}>
                    <div>
                        <Txt>동행복권 계정 로그인</Txt>
                    </div>
                    <Input>
                        <Input.TextField
                            placeholder='ID'
                            {...register('userId', { required: true })}
                            onKeyUp={handleKeyUp}
                        />
                    </Input>
                    <Input>
                        <Input.TextField
                            type='password'
                            placeholder='Password'
                            {...register('userPw', { required: true })}
                            onKeyUp={handleKeyUp}
                        />
                    </Input>
                    <Button onClick={handleSignIn}>로그인</Button>
                    {isLoading && <Spinner />}
                    {message && <div>{message}</div>}
                    {uid && <div>{uid} 로그인 중</div>}
                    {amount && <div>보유 금액: {amount}</div>}
                </Card>

                <Card css={{ width: 200 }}>
                    <Button onClick={() => handleBuyLotto([null])}>1회 자동 구매</Button>
                    <Button onClick={() => handleBuyLotto([null, null, null, null, null])}>5회 자동 구매</Button>
                </Card>

                <Card css={{ width: 'auto' }}>
                    {curBuyResult && (
                        <div>
                            {curBuyResult.split(' ').map((str, key) => (
                                <div key={key}>{str}</div>
                            ))}
                        </div>
                    )}
                    <LttPickPanel buyLotto={handleBuyLotto} />
                </Card>
                <Card css={{ width: 400 }}>
                    <LttPositionPickPanel buyLotto={handleBuyLotto} />
                </Card>
            </V.Row>
        </View>
    );
};

export default Page;
