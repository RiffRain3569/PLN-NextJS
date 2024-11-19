import { dhlBuyLotto, dhlSignIn } from '@apis/dhl/ssr';
import { V } from '@components/index';
import useDhl from '@hooks/useDhl';
import { Button, Input } from '@mui/material';
import { styled } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import View from 'components/layout/client/View';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import LttPickPanel from '../components/Panel/LttPickPanel';
import LttPositionPickPanel from '../components/Panel/LttPositionPickPanel';

const Item = styled('div')`
    padding: 20px;

    margin: 10px 0;
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    align-items: stretch;
    gap: 20px;

    overflow: auto;

    background: #4d5156;
    border-radius: 5px;

    @media (max-width: 768px) {
        width: 90%;
        height: 90%;
    }
`;

const Page = () => {
    const { uid, amount, setReset } = useDhl();
    const [curBuyResult, setBuyResult] = useState('');
    const [message, setMessage] = useState('');
    const { register, handleSubmit } = useForm();

    const dhlSignInMutation = useMutation(dhlSignIn, {
        onSuccess: (res) => {
            setReset(true);
            console.log(res);
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
    const handleSignIn = handleSubmit(({ userId, userPw }) => dhlSignInMutation.mutate({ userId, userPw }));

    return (
        <View>
            <V.Row css={{ gap: 8 }}>
                <V.Column css={{ width: 400 }}>
                    <Item css={{ width: 400 }}>
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
                        <Button variant='contained' onClick={handleSignIn}>
                            로그인
                        </Button>
                        {message && <div>{message}</div>}
                        {uid && <div>{uid} 로그인 중</div>}
                        {amount && <div>보유 금액: {amount}</div>}
                    </Item>
                </V.Column>
                <V.Column css={{ width: '100%' }}>
                    <Item>
                        <Button variant='contained' onClick={() => handleBuyLotto([null])}>
                            1회 자동 구매
                        </Button>
                        <Button variant='contained' onClick={() => handleBuyLotto([null, null, null, null, null])}>
                            5회 자동 구매
                        </Button>
                        {curBuyResult && (
                            <div>
                                {curBuyResult.split(' ').map((str, key) => (
                                    <div key={key}>{str}</div>
                                ))}
                            </div>
                        )}
                        <LttPickPanel buyLotto={handleBuyLotto} />
                        {message && <div>{message}</div>}
                        <LttPositionPickPanel buyLotto={handleBuyLotto} />
                        {message && <div>{message}</div>}
                    </Item>
                </V.Column>
            </V.Row>
        </View>
    );
};

export default Page;
