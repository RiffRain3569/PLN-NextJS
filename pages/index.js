import { Button, Input } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
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
    padding: 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;

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

    const handleSignIn = async (param) => {
        await axios({
            method: 'POST',
            url: '/api/dhl/sign-in',
            headers: { 'Content-type': 'application/json' },
            data: { ...param, jsessionId },
        })
            .then((response) => {
                console.log('로그인 성공');
                setReset(true);
            })
            .catch((error) => console.log(error.response.data));
    };

    const handleBuyLotto = async (dataList) => {
        setBuyResult('로딩중...');
        await axios({
            method: 'POST',
            url: '/api/dhl/buy-lotto',
            headers: { 'Content-type': 'application/json' },
            data: { jsessionId, dataList: dataList },
        })
            .then((response) => {
                console.log(response.data);
                setBuyResult(response.data.message);
            })
            .catch((error) => console.log(error.response.data));
    };
    return (
        <Container>
            <Item>
                <Input type='text' placeholder='ID' {...register('userId', { required: true })} />
                <Input type='password' placeholder='Password' {...register('userPw', { required: true })} />
                <Button variant='contained' onClick={handleSubmit((param) => handleSignIn(param))}>
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
                {buyResult && <div>{buyResult}</div>}
            </Item>
        </Container>
    );
};

export default Home;
