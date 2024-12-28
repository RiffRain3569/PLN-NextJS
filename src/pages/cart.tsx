import { dhlBuyLotto } from '@apis/client/dhl';
import View from '@components/_layout/client/View';
import { Button, NumberButton, Panel, V } from '@components/_ui';
import IconButton from '@components/_ui/button/IconButton';
import Divider from '@components/_ui/custom/Divider';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { savePickState } from '@store/lotto';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const Page = () => {
    const [isLoad, setLoad] = useState(false);
    const [curSavePick, setSavePick] = useRecoilState(savePickState);
    const savePicks = isLoad ? curSavePick : [];

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
            dataList: (savePicks || []).slice(0, 5),
        });
    };
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Panel title={'장바구니'} css={{ width: 690 }}>
                    {(savePicks || []).length === 0 && '저장한 번호가 없습니다.'}
                    {(savePicks || []).map((el, rowKey) => (
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
                    {(savePicks || []).length !== 0 && (
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
