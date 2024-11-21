import { dhlBuyLotto, dhlSignIn } from '@apis/dhl/ssr';
import { BasicBox, V } from '@components/index';
import Button from '@components/ui/button/Button';
import Spinner from '@components/ui/custom/Spinner';
import useDhl from '@hooks/useDhl';
import { Input } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import View from 'components/layout/client/View';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import LttPickPanel from '../components/Panel/LttPickPanel';
import LttPositionPickPanel from '../components/Panel/LttPositionPickPanel';

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
                <BasicBox css={{ width: 400 }}>
                    <div>동행복권 계정 로그인</div>
                    <Input
                        type='text'
                        placeholder='ID'
                        {...register('userId', { required: true })}
                        onKeyUp={handleKeyUp}
                    />
                    <Input
                        type='password'
                        placeholder='Password'
                        {...register('userPw', { required: true })}
                        onKeyUp={handleKeyUp}
                    />
                    <Button onClick={handleSignIn}>로그인</Button>
                    {isLoading && <Spinner />}
                    {message && <div>{message}</div>}
                    {uid && <div>{uid} 로그인 중</div>}
                    {amount && <div>보유 금액: {amount}</div>}
                </BasicBox>

                <BasicBox css={{ width: 200 }}>
                    <Button onClick={() => handleBuyLotto([null])}>1회 자동 구매</Button>
                    <Button onClick={() => handleBuyLotto([null, null, null, null, null])}>5회 자동 구매</Button>
                </BasicBox>

                <BasicBox css={{ width: 'auto' }}>
                    {curBuyResult && (
                        <div>
                            {curBuyResult.split(' ').map((str, key) => (
                                <div key={key}>{str}</div>
                            ))}
                        </div>
                    )}
                    <LttPickPanel buyLotto={handleBuyLotto} />
                </BasicBox>
                <BasicBox css={{ width: 400 }}>
                    <LttPositionPickPanel buyLotto={handleBuyLotto} />
                </BasicBox>
            </V.Row>
        </View>
    );
};

export default Page;
