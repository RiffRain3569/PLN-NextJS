import { Button, Input } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
    const [curInputs, setInputs] = useState({ userId: '', userPw: '' });

    const handleSignIn = async () => {
        const res = await axios({
            method: 'POST',
            url: '/api/dhl/sign-in',
            headers: { 'Content-type': 'application/json' },
            data: curInputs,
        });
        console.log(res);
    };
    return (
        <div
            style={{
                background: 'darkgreen',
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
                    background: 'gray',
                    width: '400px',
                    height: '450px',
                    padding: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                }}>
                <Input
                    type='text'
                    placeholder='ID'
                    onKeyUp={(e) => setInputs((s) => ({ ...s, userId: e.target.value }))}
                />
                <Input
                    type='password'
                    placeholder='Password'
                    onKeyUp={(e) => setInputs((s) => ({ ...s, userPw: e.target.value }))}
                />
                <Button variant='contained' onClick={handleSignIn}>
                    로그인
                </Button>
                <Button variant='contained'>구매</Button>
            </div>
        </div>
    );
}
