import { Button, Input } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useDhl from '../hooks/useDhl';

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
        <div
            style={{
                background: '#33ff77',
                position: 'fixed',
                top: '0',
                bottom: '0',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <div
                style={{
                    background: '#00b33c',
                    width: '400px',
                    height: '450px',
                    padding: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                }}>
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
            </div>
        </div>
    );
};

export default Home;
