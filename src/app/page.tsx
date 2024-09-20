'use client';

import { dhlBuyLotto, dhlSignIn } from '@apis/dhl/ssr';
import useDhl from '@hooks/useDhl';
import { Button, Input } from '@mui/material';
import { styled } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import LttPickPanel from 'components/Panel/LttPickPanel';
import LttPositionPickPanel from 'components/Panel/LttPositionPickPanel';
import { KeyboardEvent, ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';

const Container = styled('div')`
    width: 100vw;
    height: 100vh;

    overflow-x: hidden;

    background: #707070;
`;
const Content = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: #707070;
    overflow: auto;
`;

const Item = styled('div')`
    width: 768px;
    height: auto;
    padding: 40px;

    margin: 20px 0;
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    align-items: stretch;
    gap: 20px;

    overflow: auto;

    background: #a0a0a0;
    border: 1px solid black;
    border-radius: 10px;

    @media (max-width: 768px) {
        width: 90%;
        height: 90%;
    }
`;

const Home = (): ReactNode => {
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
        <Container>
            <Content>
                <Item>
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
            </Content>
        </Container>
    );
};

export default Home;
