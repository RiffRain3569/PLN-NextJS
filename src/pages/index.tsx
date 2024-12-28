import { dhlBuyLotto, dhlSignIn } from '@apis/client/dhl';
import LttPickPanel from '@components/client/home/LttPickPanel';
import View from '@components/_layout/client/View';
import Button from '@components/_ui/button/Button';
import { Panel, V } from '@components/_ui/index';
import { Input } from '@components/_ui/input/Input';
import useDhl from '@hooks/useDhl';
import { useMutation } from '@tanstack/react-query';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import LttPosPickPanel from '../components/client/home/LttPosPickPanel';

const Page = () => {
    const { uid, amount, setReset } = useDhl();
    const [curBuyResult, setBuyResult] = useState('');
    const [message, setMessage] = useState('');
    const { getValues, register, handleSubmit, watch } = useForm();

    const watchForm = watch();
    const dhlSignInMutation = useMutation({
        mutationFn: dhlSignIn,
        onSuccess: () => {
            setReset(true);
        },

        onError: (error: Error) => {
            setMessage(error.message);
        },
    });

    const dhlBuyLottoMutation = useMutation({
        mutationFn: dhlBuyLotto,
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
    const handleSignIn = handleSubmit(() => dhlSignInMutation.mutate(getValues() as any));

    const isLoading = dhlSignInMutation.isPending || dhlBuyLottoMutation.isPending;
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Panel title='동행복권 계정 로그인' css={{ width: 400 }}>
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
                    <Button onClick={handleSignIn} loading={dhlSignInMutation.isPending}>
                        로그인
                    </Button>
                    {message && <div>{message}</div>}
                    {uid && <div>{uid} 로그인 중</div>}
                    {amount && <div>보유 금액: {amount}</div>}
                </Panel>

                <Panel css={{ width: 200 }}>
                    <Button onClick={() => handleBuyLotto([null])}>1회 자동 구매</Button>
                    <Button onClick={() => handleBuyLotto([null, null, null, null, null])}>5회 자동 구매</Button>
                </Panel>

                <LttPickPanel />
                <LttPosPickPanel buyLotto={handleBuyLotto} />
            </V.Row>
        </View>
    );
};

export default Page;
