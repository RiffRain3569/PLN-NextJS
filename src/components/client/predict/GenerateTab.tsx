/** @jsxImportSource @emotion/react */
import { colors } from '@components/_layout/client/theme/colors';
import NumberButton from '@components/_ui/button/NumberButton';
import { useEffect, useMemo, useState } from 'react';
import { is_ban_patten } from 'utils/lotto';
import { fetchPredictExclude, fetchPredictWeight } from '@apis/client/lotto';
import Button from '@components/_ui/button/Button';

type Combo = { nums: number[]; sum: number; oddCnt: number; highCnt: number; ac: number };
type FilterRange = [number, number];
type FilterState = {
    odd: Set<number> | null;
    high: Set<number> | null;
    sum: FilterRange | null;
    ac: Set<number> | null;
    fixed: Set<number>;
};


const calcAC = (nums: number[]) => {
    const s = [...nums].sort((a, b) => a - b);
    const diffs = new Set<number>();
    for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) diffs.add(s[j] - s[i]);
    return diffs.size - (s.length - 1);
};

const calcStats = (nums: number[]): Combo => ({
    nums,
    sum: nums.reduce((a, b) => a + b, 0),
    oddCnt: nums.filter((n) => n % 2 === 1).length,
    highCnt: nums.filter((n) => n >= 23).length,
    ac: calcAC(nums),
});

const weightedSample = (pool: { num: number; w: number }[], k: number): number[] => {
    const result: number[] = [];
    let rem = [...pool];
    for (let i = 0; i < k && rem.length > 0; i++) {
        const total = rem.reduce((s, x) => s + x.w, 0);
        let r = Math.random() * total;
        let idx = rem.length - 1;
        for (let j = 0; j < rem.length; j++) {
            r -= rem[j].w;
            if (r <= 0) {
                idx = j;
                break;
            }
        }
        result.push(rem[idx].num);
        rem.splice(idx, 1);
    }
    return result.sort((a, b) => a - b);
};

const genCombos = (excluded: Set<number>, weights: Record<number, number>, count: number): Combo[] => {
    const pool = Array.from({ length: 45 }, (_, i) => i + 1)
        .filter((n) => !excluded.has(n) && weights[n] > 0)
        .map((n) => ({ num: n, w: weights[n] }));
    if (pool.length < 6) return [];
    const result: Combo[] = [];
    for (let attempt = 0; attempt < count * 50 && result.length < count; attempt++) {
        const nums = weightedSample(pool, 6);
        if (nums.length < 6 || is_ban_patten(nums)) continue;
        if (!result.find((r) => r.nums.join() === nums.join())) result.push(calcStats(nums));
    }
    return result;
};

const BALL_COLORS: Record<string, { bg: string; font: string }> = {
    '1-10':  { bg: 'FFFBC400', font: 'FF000000' },
    '11-20': { bg: 'FF0065CC', font: 'FFFFFFFF' },
    '21-30': { bg: 'FFE03535', font: 'FFFFFFFF' },
    '31-40': { bg: 'FF999999', font: 'FFFFFFFF' },
    '41-45': { bg: 'FF00C73C', font: 'FFFFFFFF' },
};

const getBallColor = (num: number) => {
    if (num <= 10) return BALL_COLORS['1-10'];
    if (num <= 20) return BALL_COLORS['11-20'];
    if (num <= 30) return BALL_COLORS['21-30'];
    if (num <= 40) return BALL_COLORS['31-40'];
    return BALL_COLORS['41-45'];
};

const downloadXLSX = async (combos: Combo[]) => {
    const ExcelJS = (await import('exceljs')).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('로또');

    combos.forEach((combo) => {
        const row = ws.addRow(combo.nums);
        combo.nums.forEach((num, i) => {
            const cell = row.getCell(i + 1);
            const { bg, font } = getBallColor(num);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
            cell.font = { color: { argb: font }, bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' }, bottom: { style: 'thin' },
                left: { style: 'thin' }, right: { style: 'thin' },
            };
        });
    });

    ws.columns = Array.from({ length: 6 }, () => ({ width: 6 }));

    const buf = await wb.xlsx.writeBuffer();
    const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })),
        download: 'lotto.xlsx',
    });
    a.click();
};

const saveToLibrary = (nums: number[]) => {
    const saved: number[][] = JSON.parse(localStorage.getItem('lotto-saved') || '[]');
    if (saved.length >= 1000) {
        alert('서재가 가득 찼습니다 (최대 1000개)');
        return;
    }
    localStorage.setItem('lotto-saved', JSON.stringify([...saved, nums]));
};

const defaultWeights = () => Object.fromEntries(Array.from({ length: 45 }, (_, i) => [i + 1, 100]));

const panelCss = {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: '16px 20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
};

const btnOutline = {
    padding: '6px 14px',
    border: `1px solid ${colors.line}`,
    borderRadius: 4,
    fontSize: '0.8rem',
    background: 'none',
    '&:hover': { background: 'rgba(255,255,255,0.06)' },
} as const;

// ─── CheckboxFilter ───────────────────────────────────────────────────
const CheckboxFilter = ({
    label,
    values,
    selected,
    onChange,
    labelFn,
}: {
    label: string;
    values: number[];
    selected: Set<number> | null;
    onChange: (v: Set<number> | null) => void;
    labelFn?: (v: number) => string;
}) => {
    const isOn = selected !== null;
    const toggle = (v: number) => {
        const next = new Set(selected ?? []);
        next.has(v) ? next.delete(v) : next.add(v);
        onChange(next.size === 0 ? null : next);
    };
    return (
        <div css={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span css={{ fontSize: '0.82rem', opacity: 0.7, flexShrink: 0, width: 80 }}>{label}</span>
            {values.map((v) => {
                const checked = isOn && selected!.has(v);
                return (
                    <button
                        key={v}
                        onClick={() => toggle(v)}
                        css={{
                            minWidth: 28,
                            height: 24,
                            padding: '0 6px',
                            borderRadius: 4,
                            fontSize: '0.78rem',
                            fontWeight: checked ? 'bold' : 'normal',
                            border: `1px solid ${checked ? '#7C3AED' : colors.line}`,
                            background: checked ? 'rgba(124,58,237,0.25)' : 'none',
                            color: checked ? '#c4b5fd' : `${colors.text}88`,
                            transition: 'all 0.15s',
                        }}
                    >
                        {labelFn ? labelFn(v) : v}
                    </button>
                );
            })}
            {isOn && (
                <button
                    onClick={() => onChange(null)}
                    css={{ fontSize: '0.72rem', color: '#f87171', background: 'none', padding: 0 }}
                >
                    해제
                </button>
            )}
        </div>
    );
};

// ─── RangeInput ───────────────────────────────────────────────────────
const RangeInput = ({
    label,
    value,
    onChange,
    min,
    max,
}: {
    label: string;
    value: FilterRange | null;
    onChange: (v: FilterRange | null) => void;
    min: number;
    max: number;
}) => {
    const isOn = value !== null;
    const v = value ?? [min, max];
    const [localMin, setLocalMin] = useState(String(v[0]));
    const [localMax, setLocalMax] = useState(String(v[1]));

    useEffect(() => { setLocalMin(String(v[0])); }, [v[0]]);
    useEffect(() => { setLocalMax(String(v[1])); }, [v[1]]);

    const inputCss = {
        width: 52,
        padding: '4px 6px',
        textAlign: 'center' as const,
        background: colors.background,
        border: `1px solid ${colors.line}`,
        borderRadius: 4,
        fontSize: '0.82rem',
        opacity: isOn ? 1 : 0.35,
    };
    return (
        <div css={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
                onClick={() => onChange(isOn ? null : [min, max])}
                css={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    flexShrink: 0,
                    border: `1px solid ${isOn ? '#7C3AED' : colors.line}`,
                    background: isOn ? '#7C3AED' : 'none',
                    fontSize: 10,
                    color: 'white',
                }}
            >
                {isOn ? '✓' : ''}
            </button>
            <span css={{ fontSize: '0.82rem', width: 80, flexShrink: 0, opacity: 0.8 }}>{label}</span>
            <input
                type='number'
                value={localMin}
                disabled={!isOn}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={() => {
                    const n = Math.max(min, Math.min(Number(localMin), v[1]));
                    onChange([n, v[1]]);
                }}
                css={inputCss}
            />
            <span css={{ opacity: 0.4, fontSize: '0.8rem' }}>~</span>
            <input
                type='number'
                value={localMax}
                disabled={!isOn}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={() => {
                    const n = Math.max(Number(localMax), v[0]);
                    onChange([v[0], Math.min(n, max)]);
                }}
                css={inputCss}
            />
        </div>
    );
};

// ─── Panel1And2 ───────────────────────────────────────────────────────
const Panel1And2 = ({
    excluded,
    onToggle,
    onClearExclude,
    onLoadExclude,
    weights,
    onWeight,
    onResetWeights,
    onLoadWeights,
}: {
    excluded: Set<number>;
    onToggle: (n: number) => void;
    onClearExclude: () => void;
    onLoadExclude: () => void;
    weights: Record<number, number>;
    onWeight: (num: number, value: number) => void;
    onResetWeights: () => void;
    onLoadWeights: () => void;
}) => (
    <div css={panelCss}>
        <div
            css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 8,
            }}
        >
            <div css={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white }}>번호 설정</p>
                <button
                    onClick={onClearExclude}
                    css={{
                        fontSize: '0.78rem',
                        opacity: 0.5,
                        background: 'none',
                        padding: 0,
                        '&:hover': { opacity: 1 },
                    }}
                >
                    제외수 초기화
                </button>
                <button
                    onClick={onResetWeights}
                    css={{
                        fontSize: '0.78rem',
                        opacity: 0.5,
                        background: 'none',
                        padding: 0,
                        '&:hover': { opacity: 1 },
                    }}
                >
                    가중치 초기화
                </button>
            </div>
            <div css={{ display: 'flex', gap: 8 }}>
                <button onClick={onLoadExclude} css={btnOutline}>
                    추천 제외수
                </button>
                <button onClick={onLoadWeights} css={btnOutline}>
                    추천 가중치
                </button>
            </div>
        </div>
        <div
            css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, auto)',
                gap: 10,
                '@media (max-width: 768px)': { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' },
            }}
        >
            {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                const isExcluded = excluded.has(num);
                return (
                    <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div
                            onClick={() => onToggle(num)}
                            css={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                        >
                            <div
                                css={{
                                    opacity: isExcluded ? 0.25 : 1,
                                    transition: 'opacity 0.15s',
                                    pointerEvents: 'none',
                                }}
                            >
                                <NumberButton number={num} size='md' mobileSize='sm' disabled />
                            </div>
                            {isExcluded && (
                                <div
                                    css={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 900,
                                        color: 'rgba(255,255,255,0.85)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    ✕
                                </div>
                            )}
                        </div>
                        <div
                            css={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                opacity: isExcluded ? 0.3 : 1,
                            }}
                        >
                            <input
                                type='number'
                                value={weights[num]}
                                min={0}
                                max={9999}
                                disabled={isExcluded}
                                onChange={(e) => onWeight(num, Math.max(0, Math.min(9999, Number(e.target.value))))}
                                css={{
                                    width: 52,
                                    padding: '2px 4px',
                                    textAlign: 'center',
                                    background: colors.background,
                                    border: `1px solid ${colors.line}`,
                                    borderRadius: 4,
                                    fontSize: '0.75rem',
                                    MozAppearance: 'textfield',
                                    '&::-webkit-inner-spin-button': { display: 'none' },
                                    '&::-webkit-outer-spin-button': { display: 'none' },
                                }}
                            />
                            <div css={{ display: 'flex', gap: 2 }}>
                                {(['−', '+'] as const).map((op) => (
                                    <button
                                        key={op}
                                        onClick={() =>
                                            onWeight(
                                                num,
                                                Math.max(0, Math.min(9999, weights[num] + (op === '+' ? 1 : -1))),
                                            )
                                        }
                                        disabled={isExcluded || (op === '−' ? weights[num] <= 0 : weights[num] >= 9999)}
                                        css={{
                                            width: 16,
                                            height: 14,
                                            borderRadius: 2,
                                            flexShrink: 0,
                                            border: `1px solid ${colors.line}`,
                                            background: 'none',
                                            fontSize: '0.7rem',
                                            lineHeight: '12px',
                                            '&:disabled': { opacity: 0.25 },
                                            '&:hover:not(:disabled)': { background: 'rgba(255,255,255,0.1)' },
                                        }}
                                    >
                                        {op}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// ─── Panel3Generate ───────────────────────────────────────────────────
const Panel3Generate = ({ excluded, weights }: { excluded: Set<number>; weights: Record<number, number> }) => {
    const [count, setCount] = useState(10);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [filter, setFilter] = useState<FilterState>({ odd: null, high: null, sum: null, ac: null, fixed: new Set() });
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 50;

    const filteredCombos = useMemo(() => {
        const fixedArr = [...filter.fixed];
        let list = combos;
        if (filter.odd) list = list.filter((c) => filter.odd!.has(c.oddCnt));
        if (filter.high) list = list.filter((c) => filter.high!.has(c.highCnt));
        if (filter.sum) list = list.filter((c) => c.sum >= filter.sum![0] && c.sum <= filter.sum![1]);
        if (filter.ac) list = list.filter((c) => filter.ac!.has(c.ac));
        if (fixedArr.length > 0) list = list.filter((c) => fixedArr.every((n) => c.nums.includes(n)));
        return list;
    }, [combos, filter]);

    const setF = <K extends keyof FilterState>(key: K, val: FilterState[K]) => { setFilter((f) => ({ ...f, [key]: val })); setPage(1); };
    const pagedCombos = filteredCombos.slice(0, page * PAGE_SIZE);

    return (
        <div css={panelCss}>
            <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white, marginBottom: 16 }}>번호 생성</p>
            <div css={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span css={{ fontSize: '0.85rem', opacity: 0.7 }}>수량</span>
                    <input
                        type='number'
                        value={count}
                        min={1}
                        max={1000}
                        onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))}
                        css={{
                            width: 70,
                            padding: '6px 10px',
                            textAlign: 'center',
                            background: colors.background,
                            border: `1px solid ${colors.line}`,
                            borderRadius: 4,
                            fontSize: '0.9rem',
                        }}
                    />
                </div>
                <Button
                    onClick={() => { setCombos(genCombos(excluded, weights, count)); setPage(1); }}
                    css={{ width: 'auto', padding: '6px 20px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: 4, minHeight: 'unset' }}
                >
                    생성하기
                </Button>
                {combos.length > 0 && (
                    <button onClick={() => downloadXLSX(filteredCombos)} css={{ ...btnOutline, padding: '6px 14px' }}>
                        엑셀 다운로드
                    </button>
                )}
            </div>

            {combos.length > 0 && (
                <>
                    <div
                        css={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '14px 16px', marginBottom: 16 }}
                    >
                        <p css={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: 12 }}>결과 필터 (실시간 적용)</p>
                        <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <CheckboxFilter
                                label='홀/짝'
                                values={[0, 1, 2, 3, 4, 5, 6]}
                                selected={filter.odd}
                                onChange={(v) => setF('odd', v)}
                                labelFn={(v) => `${v}:${6 - v}`}
                            />
                            <CheckboxFilter
                                label='고/저'
                                values={[0, 1, 2, 3, 4, 5, 6]}
                                selected={filter.high}
                                onChange={(v) => setF('high', v)}
                                labelFn={(v) => `${v}:${6 - v}`}
                            />
                            <CheckboxFilter
                                label='AC값'
                                values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                                selected={filter.ac}
                                onChange={(v) => setF('ac', v)}
                            />
                            <RangeInput
                                label='번호합'
                                value={filter.sum}
                                onChange={(v) => setF('sum', v)}
                                min={21}
                                max={270}
                            />
                            <div>
                                <div css={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span css={{ fontSize: '0.82rem', opacity: 0.8 }}>
                                        고정수 {filter.fixed.size > 0 && `(${filter.fixed.size}개)`}
                                    </span>
                                    {filter.fixed.size > 0 && (
                                        <button
                                            onClick={() => setF('fixed', new Set())}
                                            css={{
                                                fontSize: '0.75rem',
                                                color: '#f87171',
                                                background: 'none',
                                                padding: 0,
                                            }}
                                        >
                                            전체 해제
                                        </button>
                                    )}
                                </div>
                                <div css={{ overflowX: 'auto' }}>
                                    <div
                                        css={{
                                            display: 'flex',
                                            gap: 6,
                                            flexWrap: 'nowrap',
                                            minWidth: 'max-content',
                                            paddingBottom: 4,
                                        }}
                                    >
                                        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                                            const isFixed = filter.fixed.has(num);
                                            return (
                                                <NumberButton
                                                    key={num}
                                                    number={num}
                                                    size='md'
                                                    mobileSize='sm'
                                                    selected={isFixed}
                                                    onClick={() => {
                                                        const next = new Set(filter.fixed);
                                                        isFixed ? next.delete(num) : next.add(num);
                                                        setF('fixed', next);
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p css={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: 10 }}>
                        {filteredCombos.length}개 (전체 {combos.length}개)
                    </p>
                    <div css={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {pagedCombos.map((combo, i) => (
                            <div
                                key={i}
                                css={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${colors.line}`,
                                    borderRadius: 8,
                                    padding: '10px 14px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                }}
                            >
                                <div css={{ display: 'flex', gap: 5 }}>
                                    {combo.nums.map((num) => (
                                        <NumberButton key={num} number={num} size='md' mobileSize='sm' disabled />
                                    ))}
                                </div>
                                <div
                                    css={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 12,
                                    }}
                                >
                                    <div css={{ display: 'flex', gap: 10 }}>
                                        {[
                                            { label: '합', value: combo.sum },
                                            { label: '홀', value: `${combo.oddCnt}:${6 - combo.oddCnt}` },
                                            { label: '고', value: `${combo.highCnt}:${6 - combo.highCnt}` },
                                            { label: 'AC', value: combo.ac },
                                        ].map(({ label, value }) => (
                                            <div key={label} css={{ textAlign: 'center' }}>
                                                <p css={{ fontSize: '0.6rem', opacity: 0.45 }}>{label}</p>
                                                <p css={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => saveToLibrary(combo.nums)}
                                        css={{
                                            padding: '4px 10px',
                                            flexShrink: 0,
                                            border: `1px solid ${colors.line}`,
                                            borderRadius: 4,
                                            fontSize: '0.75rem',
                                            background: 'none',
                                            '&:hover': { background: 'rgba(255,255,255,0.08)' },
                                        }}
                                    >
                                        서재에 담기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagedCombos.length < filteredCombos.length && (
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            css={{ ...btnOutline, width: '100%', padding: '10px', marginTop: 8 }}
                        >
                            더 보기 ({filteredCombos.length - pagedCombos.length}개 남음)
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

// ─── GenerateTab ──────────────────────────────────────────────────────
const GenerateTab = () => {
    const [excluded, setExcluded] = useState<Set<number>>(new Set());
    const [weights, setWeights] = useState<Record<number, number>>(defaultWeights);

    const toggleExclude = (n: number) =>
        setExcluded((prev) => {
            const next = new Set(prev);
            next.has(n) ? next.delete(n) : next.add(n);
            return next;
        });

    const updateWeight = (num: number, value: number) => setWeights((prev) => ({ ...prev, [num]: value }));

    const loadExclude = async () => {
        const data = await fetchPredictExclude({ limit: 1 });
        if (data?.items?.[0]) setExcluded(new Set(data.items[0].excludeNumList));
    };

    const loadWeights = async () => {
        const data = await fetchPredictWeight({ limit: 1 });
        if (data?.items?.[0]) {
            const wList: number[] = data.items[0].weightList;
            const wMap: Record<number, number> = {};
            wList.forEach((w: number, i: number) => {
                wMap[i + 1] = Math.round(w * 100);
            });
            setWeights(wMap);
        }
    };

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Panel1And2
                excluded={excluded}
                onToggle={toggleExclude}
                onClearExclude={() => setExcluded(new Set())}
                onLoadExclude={loadExclude}
                weights={weights}
                onWeight={updateWeight}
                onResetWeights={() => setWeights(defaultWeights())}
                onLoadWeights={loadWeights}
            />
            <Panel3Generate excluded={excluded} weights={weights} />
        </div>
    );
};

export default GenerateTab;
