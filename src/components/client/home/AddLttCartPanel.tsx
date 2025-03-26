import { NumberButton, Panel, V } from '@components/_ui';
import IconButton from '@components/_ui/button/IconButton';
import Divider from '@components/_ui/custom/Divider';
import { Input } from '@components/_ui/input/Input';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { savePickState } from '@store/lotto';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

interface Props {}

const AddLttCartPanel = ({}: Props) => {
    const { watch, getValues, setValue } = useForm({
        defaultValues: { inputs: ['', '', '', '', ''] },
    });
    const watchForm = watch();

    const [curSavePick, setSavePick] = useRecoilState<(number[] | null)[]>(savePickState);
    const [curLttNums, setLttNums] = useState<number[][]>([[], [], [], [], []]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            e.ctrlKey || // Ctrl 키 조합 허용 (Ctrl + V, Ctrl + A 등)
            e.metaKey || // Mac ⌘ 키 조합 허용
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Enter'
        ) {
            return;
        }

        // 숫자, 콤마, 공백만 허용
        if (!/[\d,\s]/.test(e.key)) {
            e.preventDefault(); // 허용되지 않은 키 입력 차단
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: number) => {
        const inputValue = e.target.value.replace(/[^0-9,\s]/g, '');

        setValue(`inputs.${key}`, inputValue);

        setLttNums((s) => {
            s[key] = [
                ...new Set(
                    inputValue
                        .replace(/[,]+/g, ' ') // 콤마를 공백으로 변환
                        .trim() // 앞뒤 공백 제거
                        .split(/\s+/)
                        .splice(0, 6)
                        .map(Number)
                        .sort((a, b) => a - b)
                ),
            ];
            return s;
        });
    };

    return (
        <Panel title='리스트 형태로 카트 추가' css={{ width: 600 }}>
            <V.Column css={{ gap: 20 }}>
                <V.Column css={{ gap: 10 }}>
                    {curLttNums.length > 0 && (
                        <>
                            {curLttNums.map((lttNum, rowKey) => (
                                <V.Row key={rowKey} css={{ gap: 8, alignItems: 'center' }}>
                                    <Input label={`리스트 ${rowKey + 1}`} css={{ width: 'auto' }}>
                                        <Input.TextField
                                            onKeyDown={handleKeyDown}
                                            value={getValues(`inputs.${rowKey}`)}
                                            onChange={(e) => handleChange(e, rowKey)}
                                            placeholder='1, 2, 3, 4, 5, 6'
                                        />
                                    </Input>
                                    <Divider css={{ margin: '0 8px', height: '40px' }} />

                                    {lttNum.map(
                                        (num, colKey) =>
                                            num > 0 && num <= 45 && <NumberButton key={colKey} number={num} disabled />
                                    )}
                                    <Divider css={{ margin: '0 8px', height: '40px' }} />
                                    <IconButton
                                        onClick={() => {
                                            const isNumRange = lttNum.every((num) => num >= 1 && num <= 45);
                                            const isNumLength = lttNum.length === 6;
                                            console.log(curLttNums, lttNum, rowKey);
                                            if (curSavePick.length >= 5) {
                                                alert('장바구니에서 제거 후 다시 클릭하세요');
                                            } else if (!isNumRange) {
                                                alert('1 ~ 45 사이의 숫자만 입력하세요');
                                            } else if (!isNumLength) {
                                                alert('6개의 숫자를 입력하세요');
                                            } else {
                                                alert(`담은 개수: ${curSavePick.length + 1} 개`);
                                                setSavePick((s) => s.concat([lttNum]));
                                            }
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

export default AddLttCartPanel;
