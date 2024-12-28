import { selectLottoPredict } from '@apis/client/lotto';
import { LttPick, NumberButton, Panel, Txt, V } from '@components/_ui';
import Button from '@components/_ui/button/Button';
import IconButton from '@components/_ui/button/IconButton';
import Divider from '@components/_ui/custom/Divider';
import { Input } from '@components/_ui/input/Input';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { picksState, savePickState } from '@store/lotto';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isEqual, shuffleArray } from 'utils/common';
import { is_ban_patten } from 'utils/lotto';

interface Props {}

const LttPickPanel = ({}: Props) => {
    const [curSavePick, setSavePick] = useRecoilState<(number[] | null)[]>(savePickState);
    const [curPicks, setPicks] = useRecoilState<number[]>(picksState);
    const [curLttNums, setLttNums] = useState<number[][]>([]);
    const [curRandomCnt, setRandomCnt] = useState<number>(1);
    const [curIsBan, setIsBan] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [curLottoId, setLottoId] = useState<number | undefined>();

    const handleGenLttNums = () => {
        let result: number[][] = [];

        for (let i = 0; i < curRandomCnt * 10; i++) {
            // 랜덤 번호 추출
            const selectLtt = shuffleArray(curPicks)
                .slice(0, 6)
                .sort((a, b) => a - b);

            // 밴 패턴이면 추가 X
            if (curIsBan && is_ban_patten(selectLtt)) {
                continue;
            }

            // 중복 제거
            let isDuplicate = false;
            for (const lotto of result) {
                if (isEqual(lotto, selectLtt)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                result.push(selectLtt);
            }

            // 탈출 조건
            if (result.length >= curRandomCnt) {
                break;
            }
        }
        setLttNums(result);
    };

    const queryData = useQuery({
        queryKey: ['lotto', curLottoId],
        queryFn: async () => {
            try {
                const data = await selectLottoPredict({ lottoId: curLottoId as number });
                setPicks(data?.pickNums);
                return data;
            } catch (error: any) {
                alert(JSON.stringify(error, null, 2));
                return {};
            }
        },
        enabled: !!curLottoId,
    });

    useEffect(() => {
        if (!!curLottoId) {
            queryData.refetch();
        }
    }, [curLottoId]);
    return (
        <Panel title='선택한 번호 범위의 랜덤 번호 생성' css={{ width: 600 }}>
            <V.Column css={{ gap: 20 }}>
                <V.Row css={{ gap: 10 }}>
                    <LttPick onChange={(picks) => setPicks(picks)} values={curPicks || []} />
                    <V.Column css={{ gap: 10 }}>
                        <Button onClick={() => setIsBan((s) => !s)} css={{ width: 'auto' }}>
                            {curIsBan ? '밴 패턴 적용 중' : '밴 패턴 미적용'}
                        </Button>

                        <V.Row css={{ gap: 10 }}>
                            <Input label='예측 회차' css={{ width: 100 }}>
                                <Input.TextField type='number' defaultValue={50} min={50} ref={inputRef} />
                            </Input>
                            <Button
                                onClick={() => setLottoId(Number(inputRef?.current?.value))}
                                css={{ width: 'auto' }}
                            >
                                번호 예측
                            </Button>
                        </V.Row>
                        <Txt>
                            매칭 번호: {JSON.stringify(queryData?.data?.matchNums || [])}{' '}
                            {(queryData?.data?.matchNums || []).length} / {(curPicks || []).length}
                        </Txt>
                    </V.Column>
                </V.Row>

                <V.Row css={{ justifyContent: 'space-between' }}>
                    <Input label='생성 개수' css={{ width: 100 }}>
                        <Input.TextField
                            type='number'
                            onChange={(e) => setRandomCnt(Number(e.target.value))}
                            defaultValue={1}
                            min={0}
                            max={100}
                        />
                    </Input>
                    <Button onClick={handleGenLttNums} disabled={curPicks.length < 6} css={{ width: 'auto' }}>
                        무작위 생성
                    </Button>
                </V.Row>
                <V.Column css={{ gap: 10 }}>
                    {curLttNums.length > 0 && (
                        <>
                            {curLttNums.map((lttNum, rowKey) => (
                                <V.Row key={rowKey} css={{ gap: 8, alignItems: 'center' }}>
                                    {lttNum.map((num, colKey) => (
                                        <NumberButton key={colKey} number={num} disabled />
                                    ))}
                                    <Divider css={{ margin: '0 8px', height: '40px' }} />
                                    <IconButton
                                        onClick={() => {
                                            if (curSavePick.length >= 5) {
                                                alert('장바구니에서 제거 후 다시 클릭하세요');
                                            } else {
                                                alert(`담은 개수: ${curSavePick.length + 1} 개`);
                                                setSavePick((s) => s.concat([lttNum]));
                                            }
                                            // buyLotto?.([lttNum]);
                                        }}
                                        css={{ width: 'auto' }}
                                        Icon={AddShoppingCartOutlinedIcon}
                                    />
                                </V.Row>
                            ))}
                        </>
                    )}
                </V.Column>
            </V.Column>
        </Panel>
    );
};

export default LttPickPanel;
