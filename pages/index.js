import { Button, Input } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useDhl from '../hooks/useDhl';

const Home = () => {
    const { jsessionId, uid, setUid } = useDhl();

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
                setUid(response.data.uid);
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
                <Button variant='contained'>구매</Button>
            </div>
        </div>
    );
};

export default Home;
