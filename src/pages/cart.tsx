import { dhlBuyLotto, dhlSignIn } from '@apis/client/dhl';
import View from '@components/_layout/client/View';
import { Button, NumberButton, Panel, Spinner, V } from '@components/_ui';
import IconButton from '@components/_ui/button/IconButton';
import Divider from '@components/_ui/custom/Divider';
import { Input } from '@components/_ui/input/Input';
import useDhl from '@hooks/useDhl';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { savePickState } from '@store/lotto';
import { useMutation } from '@tanstack/react-query';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

const Page = () => {
    const { uid, amount, setReset } = useDhl();
    const [curBuyResult, setBuyResult] = useState('');
    const [message, setMessage] = useState('');
    const { getValues, register, handleSubmit, watch } = useForm();
    const watchForm = watch();

    const [isLoad, setLoad] = useState(false);
    const [curSavePick, setSavePick] = useRecoilState(savePickState);

    useEffect(() => {
        setLoad(true);
    }, []);

    const dhlBuyLottoMutation = useMutation({
        mutationFn: dhlBuyLotto,
        onSuccess: (res: any) => {
            alert(res?.message);
        },
        onError: (error: any) => {
            alert(JSON.stringify(error));
        },
    });

    const handleBuy = () => {
        dhlBuyLottoMutation.mutate({
            dataList: (curSavePick || []).slice(0, 5),
        });
    };

    const dhlSignInMutation = useMutation({
        mutationFn: dhlSignIn,
        onSuccess: () => {
            setReset(true);
        },

        onError: (error: Error) => {
            setMessage(error.message);
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

    if (!isLoad)
        return (
            <View>
                <Spinner />
            </View>
        );
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

                <Panel title={'장바구니'} css={{ width: 360 }}>
                    {(curSavePick || []).length === 0 && '저장한 번호가 없습니다.'}
                    {(curSavePick || []).map((el, rowKey) => (
                        <V.Row css={{ gap: 8, alignItems: 'center' }} key={rowKey}>
                            {(el || []).map((_el, colKey) => (
                                <NumberButton number={_el} key={colKey} />
                            ))}
                            <Divider css={{ margin: '0 8px', height: 40 }} />
                            <IconButton
                                Icon={RemoveShoppingCartOutlinedIcon}
                                onClick={() => setSavePick((s) => s.filter((_, idx) => idx !== rowKey))}
                            />
                        </V.Row>
                    ))}
                    {(curSavePick || []).length !== 0 && (
                        <Button onClick={handleBuy} loading={dhlBuyLottoMutation.isPending}>
                            모두 구매
                        </Button>
                    )}
                </Panel>
            </V.Row>
        </View>
    );
};

export default Page;
