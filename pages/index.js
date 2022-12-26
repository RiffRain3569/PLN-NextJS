import { Button, Input } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { dhlBuyLotto, dhlSignIn } from '../apis/dhl/ssr';
import useDhl from '../hooks/useDhl';

const Container = styled.div`
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background: #707070;
`;

const Item = styled.div`
    width: 400px;
    height: 450px;
    padding: 40px;

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

const Home = () => {
    const { jsessionId, uid, amount, setReset } = useDhl();
    const [buyResult, setBuyResult] = useState('');

    const { register, handleSubmit } = useForm();

    const dhlSignInMutation = useMutation(dhlSignIn, {
        onSuccess: (res) => {
            console.log(res);
        },
    });

    const dhlBuyLottoMutation = useMutation(dhlBuyLotto, {
        onSuccess: (res) => {
            setBuyResult(res.message);
        },
        onError: (error) => {
            setBuyResult(error.message);
        },
    });

    const handleBuyLotto = async (dataList) => {
        setBuyResult('로딩중...');
        dhlBuyLottoMutation.mutate({ dataList, jsessionId });
    };

    return (
        <Container>
            <Item>
                <Input type='text' placeholder='ID' {...register('userId', { required: true })} />
                <Input type='password' placeholder='Password' {...register('userPw', { required: true })} />
                <Button
                    variant='contained'
                    onClick={handleSubmit(({ userId, userPw }) =>
                        dhlSignInMutation.mutate({ userId, userPw, jsessionId })
                    )}>
                    로그인
                </Button>
                {uid && <div>{uid} 로그인 중</div>}
                {amount && <div>보유 금액: {amount}</div>}
                <Button variant='contained' onClick={() => handleBuyLotto([null])}>
                    1회 자동 구매
                </Button>
                <Button variant='contained' onClick={() => handleBuyLotto([null, null, null, null, null])}>
                    5회 자동 구매
                </Button>
                {buyResult && (
                    <div>
                        {buyResult.split(' ').map((str, key) => (
                            <div key={key}>{str}</div>
                        ))}
                    </div>
                )}
            </Item>
        </Container>
    );
};

export default Home;
