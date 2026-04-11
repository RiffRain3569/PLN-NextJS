/** @jsxImportSource @emotion/react */
import { dhlBuyLotto, dhlSignIn } from '@apis/client/dhl';
import AdminView from '@components/_layout/admin/AdminView';
import AdminButton from '@components/_layout/admin/ui/AdminButton';
import AdminPanel from '@components/_layout/admin/ui/AdminPanel';
import { adminColors } from '@components/_layout/admin/theme/colors';
import { NumberButton, Spinner, V } from '@components/_ui';
import IconButton from '@components/_ui/button/IconButton';
import Divider from '@components/_ui/custom/Divider';
import { Input } from '@components/_ui/input/Input';
import useDhl from '@hooks/useDhl';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { savePickState } from '@store/lotto';
import { withAdminAuth } from 'utils/adminAuth';
import { useMutation } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

const AdminMainPage = () => {
    const { uid, amount, setReset } = useDhl();
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

    const dhlSignInMutation = useMutation({
        mutationFn: dhlSignIn,
        onSuccess: () => {
            setReset(true);
        },
        onError: (error: Error) => {
            setMessage(error.message);
        },
    });

    const handleBuyLotto = (dataList: null[] | number[][]) => {
        dhlBuyLottoMutation.mutate({ dataList });
    };

    const handleBuy = () => {
        dhlBuyLottoMutation.mutate({ dataList: (curSavePick || []).slice(0, 5) });
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        setMessage('');
        if (e.key === 'Enter') handleSignIn();
    };

    const handleSignIn = handleSubmit(() => dhlSignInMutation.mutate(getValues() as any));

    if (!isLoad)
        return (
            <AdminView>
                <Spinner />
            </AdminView>
        );

    return (
        <AdminView>
            <V.Row css={{ gap: 16, margin: '20px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <AdminPanel title='동행복권 계정 로그인' css={{ width: 400 }}>
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
                    <AdminButton onClick={handleSignIn} loading={dhlSignInMutation.isPending}>
                        로그인
                    </AdminButton>
                    {message && <div css={{ color: adminColors.danger, fontSize: 13 }}>{message}</div>}
                    {uid && <div css={{ color: adminColors.textMuted, fontSize: 13 }}>{uid} 로그인 중</div>}
                    {amount && <div css={{ color: adminColors.textMuted, fontSize: 13 }}>보유 금액: {amount}</div>}
                </AdminPanel>

                <AdminPanel title='자동 구매' css={{ width: 200 }}>
                    <AdminButton onClick={() => handleBuyLotto([null])} loading={dhlBuyLottoMutation.isPending}>
                        1회 자동 구매
                    </AdminButton>
                    <AdminButton
                        onClick={() => handleBuyLotto([null, null, null, null, null])}
                        loading={dhlBuyLottoMutation.isPending}
                    >
                        5회 자동 구매
                    </AdminButton>
                </AdminPanel>

                <AdminPanel title='장바구니' css={{ width: 360 }}>
                    {(curSavePick || []).length === 0 && (
                        <div css={{ color: adminColors.textMuted, fontSize: 13 }}>저장한 번호가 없습니다.</div>
                    )}
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
                        <AdminButton onClick={handleBuy} loading={dhlBuyLottoMutation.isPending}>
                            모두 구매
                        </AdminButton>
                    )}
                </AdminPanel>
            </V.Row>
        </AdminView>
    );
};

export const getServerSideProps: GetServerSideProps = withAdminAuth();

export default AdminMainPage;
