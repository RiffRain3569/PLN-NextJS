import { Button, NumberButton, Panel, PositionButton, V } from '@components/_ui';
import LttPickAreaContent from '@components/_ui/custom/LttPick';
import { Input } from '@components/_ui/input/Input';
import { posPicksState, savePickState } from '@store/lotto';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isEqual, shuffleArray } from 'utils/common';
import { is_ban_patten } from 'utils/lotto';

interface Props {}

const LttPosPickPanel: React.FC<Props> = ({}) => {
    const [curPos, setPos] = useState<number>(-1);
    const [curSavePick, setSavePick] = useRecoilState<(number[] | null)[]>(savePickState);
    const [curPosPicks, setPosPicks] = useRecoilState<number[][]>(posPicksState);
    const [curLttNums, setLttNums] = useState<number[][]>([]);
    const [curRandomCnt, setRandomCnt] = useState<number>(1);
    const [curIsBan, setIsBan] = useState<boolean>(true);

    const handleGenLttNums = () => {
        let result: number[][] = [];

        for (let i = 0; i < curRandomCnt * 10; i++) {
            const selectLtt: number[] = [...Array(6).keys()]
                .reduce((a: number[], v: number): number[] => {
                    for (const num of shuffleArray(curPosPicks[v])) {
                        if (!a.includes(num)) {
                            a = [...a, num];
                            break;
                        }
                    }
                    return a;
                }, [])
                .sort((a, b) => a - b);

            // 밴 패턴이면 추가 X
            if (curIsBan && is_ban_patten(selectLtt)) {
                continue;
            }

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
            if (result.length >= curRandomCnt) {
                break;
            }
        }
        setLttNums(result);
    };

    const allPicks = curPosPicks.filter((x) => x.length > 0).length === 6;
    return (
        <Panel title='위치별 선택한 번호 범위의 랜덤 번호 생성' css={{ width: 400 }}>
            {curPos >= 0 && curPos <= 6 && (
                <LttPickAreaContent
                    values={curPosPicks[curPos]}
                    onChange={(picks) => {
                        setPosPicks((s) => [...s.slice(0, curPos), picks, ...s.slice(curPos + 1)]);
                    }}
                />
            )}
            <V.Row style={{ display: 'flex', gap: '3px', padding: '10px' }}>
                {Array.from(Array(6).keys()).map((num, key) => (
                    <PositionButton key={key} number={num + 1} onClick={() => setPos(num)} selected={num === curPos} />
                ))}
            </V.Row>
            <V.Row style={{ display: 'flex', gap: '3px', padding: '0 10px' }}>
                <Button onClick={() => setPosPicks([[], [], [], [], [], []])}>초기화</Button>
            </V.Row>
            <V.Row>
                <Button onClick={() => setIsBan((s) => !s)}>{curIsBan ? '밴 패턴 적용 중' : '밴 패턴 미적용'}</Button>
            </V.Row>
            <V.Row>
                <V.Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Input label='생성 개수' css={{ width: 100 }}>
                        <Input.TextField
                            type='number'
                            onChange={(e) => setRandomCnt(Number(e.target.value))}
                            defaultValue={1}
                            min={0}
                            max={100}
                        />
                    </Input>
                    <Button onClick={handleGenLttNums}>고른 번호 중 랜덤 선택</Button>
                </V.Row>
            </V.Row>
            {curLttNums.length > 0 && (
                <>
                    {curLttNums.map((lttNum, rowKey) => (
                        <V.Row key={rowKey} css={{ gap: 8 }}>
                            {lttNum.map((num, colKey) => (
                                <NumberButton key={colKey} number={num} />
                            ))}
                            <Button onClick={() => setSavePick((s) => s.concat([lttNum]))}>추가</Button>
                        </V.Row>
                    ))}
                </>
            )}
        </Panel>
    );
};

export default LttPosPickPanel;
