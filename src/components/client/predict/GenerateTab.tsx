/** @jsxImportSource @emotion/react */
import NumberButton from '@components/_ui/button/NumberButton';
import { colors } from '@components/_layout/client/theme/colors';
import { useMemo, useState } from 'react';
import { is_ban_patten } from 'utils/lotto';

type Combo = { nums: number[]; sum: number; oddCnt: number; highCnt: number; ac: number };
type FilterRange = [number, number];
type FilterState = {
    odd: Set<number> | null;
    high: Set<number> | null;
    sum: FilterRange | null;
    ac: Set<number> | null;
    fixed: Set<number>;
};

const DUMMY_EXCLUDE = [8, 11, 17, 22, 31, 36, 42];
const makeWeights = (seed: number) =>
    Array.from({ length: 45 }, (_, i) => ({
        num: i + 1,
        w: (((i + 1) * ((seed % 10) + 7) + seed) % 91) + 10,
    })).sort((a, b) => b.w - a.w);
const DUMMY_WEIGHTS = makeWeights(1216);

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
        for (let j = 0; j < rem.length; j++) { r -= rem[j].w; if (r <= 0) { idx = j; break; } }
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

const downloadCSV = (combos: Combo[]) => {
    const csv = combos.map((c) => c.nums.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
        download: 'lotto.csv',
    });
    a.click();
};

const saveToLibrary = (nums: number[]) => {
    const saved: number[][] = JSON.parse(localStorage.getItem('lotto-saved') || '[]');
    if (saved.length >= 1000) { alert('서재가 가득 찼습니다 (최대 1000개)'); return; }
    localStorage.setItem('lotto-saved', JSON.stringify([...saved, nums]));
};

const defaultWeights = () => Object.fromEntries(Array.from({ length: 45 }, (_, i) => [i + 1, 50]));

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
const CheckboxFilter = ({ label, values, selected, onChange }: {
    label: string;
    values: number[];
    selected: Set<number> | null;
    onChange: (v: Set<number> | null) => void;
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
                    <button key={v} onClick={() => toggle(v)} css={{
                        minWidth: 28, height: 24, padding: '0 6px', borderRadius: 4,
                        fontSize: '0.78rem', fontWeight: checked ? 'bold' : 'normal',
                        border: `1px solid ${checked ? '#7C3AED' : colors.line}`,
                        background: checked ? 'rgba(124,58,237,0.25)' : 'none',
                        color: checked ? '#c4b5fd' : `${colors.text}88`,
                        transition: 'all 0.15s',
                    }}>{v}</button>
                );
            })}
            {isOn && (
                <button onClick={() => onChange(null)} css={{ fontSize: '0.72rem', color: '#f87171', background: 'none', padding: 0 }}>
                    해제
                </button>
            )}
        </div>
    );
};

// ─── RangeInput ───────────────────────────────────────────────────────
const RangeInput = ({ label, value, onChange, min, max }: {
    label: string; value: FilterRange | null;
    onChange: (v: FilterRange | null) => void; min: number; max: number;
}) => {
    const isOn = value !== null;
    const v = value ?? [min, max];
    const inputCss = {
        width: 52, padding: '4px 6px', textAlign: 'center' as const,
        background: colors.background, border: `1px solid ${colors.line}`,
        borderRadius: 4, fontSize: '0.82rem', opacity: isOn ? 1 : 0.35,
    };
    return (
        <div css={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => onChange(isOn ? null : [min, max])} css={{
                width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                border: `1px solid ${isOn ? '#7C3AED' : colors.line}`,
                background: isOn ? '#7C3AED' : 'none', fontSize: 10, color: 'white',
            }}>{isOn ? '✓' : ''}</button>
            <span css={{ fontSize: '0.82rem', width: 80, flexShrink: 0, opacity: 0.8 }}>{label}</span>
            <input type="number" value={v[0]} min={min} max={v[1]} disabled={!isOn}
                onChange={(e) => onChange([Math.max(min, Math.min(Number(e.target.value), v[1])), v[1]])}
                css={inputCss} />
            <span css={{ opacity: 0.4, fontSize: '0.8rem' }}>~</span>
            <input type="number" value={v[1]} min={v[0]} max={max} disabled={!isOn}
                onChange={(e) => onChange([v[0], Math.max(Number(e.target.value), v[0])])}
                css={inputCss} />
        </div>
    );
};

// ─── Panel1And2 ───────────────────────────────────────────────────────
const Panel1And2 = ({ excluded, onToggle, onClearExclude, onLoadExclude, weights, onWeight, onResetWeights, onLoadWeights }: {
    excluded: Set<number>; onToggle: (n: number) => void;
    onClearExclude: () => void; onLoadExclude: () => void;
    weights: Record<number, number>; onWeight: (num: number, value: number) => void;
    onResetWeights: () => void; onLoadWeights: () => void;
}) => (
    <div css={panelCss}>
        <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div css={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white }}>번호 설정</p>
                <button onClick={onClearExclude} css={{ fontSize: '0.78rem', opacity: 0.5, background: 'none', padding: 0, '&:hover': { opacity: 1 } }}>제외수 초기화</button>
                <button onClick={onResetWeights} css={{ fontSize: '0.78rem', opacity: 0.5, background: 'none', padding: 0, '&:hover': { opacity: 1 } }}>가중치 초기화</button>
            </div>
            <div css={{ display: 'flex', gap: 8 }}>
                <button onClick={onLoadExclude} css={btnOutline}>추천 제외수</button>
                <button onClick={onLoadWeights} css={btnOutline}>추천 가중치</button>
            </div>
        </div>
        <div css={{
            display: 'grid', gridTemplateColumns: 'repeat(7, auto)', gap: 10,
            '@media (max-width: 768px)': { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' },
        }}>
            {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                const isExcluded = excluded.has(num);
                return (
                    <div key={num} css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div onClick={() => onToggle(num)} css={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                            <div css={{ opacity: isExcluded ? 0.25 : 1, transition: 'opacity 0.15s' }}>
                                <NumberButton number={num} size="md" mobileSize="sm" disabled />
                            </div>
                            {isExcluded && (
                                <div css={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.85)', pointerEvents: 'none' }}>
                                    ✕
                                </div>
                            )}
                        </div>
                        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: isExcluded ? 0.3 : 1 }}>
                            <input type="number" value={weights[num]} min={0} max={100} disabled={isExcluded}
                                onChange={(e) => onWeight(num, Math.max(0, Math.min(100, Number(e.target.value))))}
                                css={{
                                    width: 36, padding: '2px 4px', textAlign: 'center',
                                    background: colors.background, border: `1px solid ${colors.line}`,
                                    borderRadius: 4, fontSize: '0.75rem',
                                    MozAppearance: 'textfield',
                                    '&::-webkit-inner-spin-button': { display: 'none' },
                                    '&::-webkit-outer-spin-button': { display: 'none' },
                                }} />
                            <div css={{ display: 'flex', gap: 2 }}>
                                {(['−', '+'] as const).map((op) => (
                                    <button key={op}
                                        onClick={() => onWeight(num, Math.max(0, Math.min(100, weights[num] + (op === '+' ? 1 : -1))))}
                                        disabled={isExcluded || (op === '−' ? weights[num] <= 0 : weights[num] >= 100)}
                                        css={{
                                            width: 16, height: 14, borderRadius: 2, flexShrink: 0,
                                            border: `1px solid ${colors.line}`, background: 'none',
                                            fontSize: '0.7rem', lineHeight: '12px',
                                            '&:disabled': { opacity: 0.25 },
                                            '&:hover:not(:disabled)': { background: 'rgba(255,255,255,0.1)' },
                                        }}
                                    >{op}</button>
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

    const filteredCombos = useMemo(() => {
        let list = combos;
        if (filter.odd) list = list.filter((c) => filter.odd!.has(c.oddCnt));
        if (filter.high) list = list.filter((c) => filter.high!.has(c.highCnt));
        if (filter.sum) list = list.filter((c) => c.sum >= filter.sum![0] && c.sum <= filter.sum![1]);
        if (filter.ac) list = list.filter((c) => filter.ac!.has(c.ac));
        if (filter.fixed.size > 0) list = list.filter((c) => [...filter.fixed].every((n) => c.nums.includes(n)));
        return list;
    }, [combos, filter]);

    const setF = <K extends keyof FilterState>(key: K, val: FilterState[K]) => setFilter((f) => ({ ...f, [key]: val }));

    return (
        <div css={panelCss}>
            <p css={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.white, marginBottom: 16 }}>번호 생성</p>
            <div css={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span css={{ fontSize: '0.85rem', opacity: 0.7 }}>수량</span>
                    <input type="number" value={count} min={1} max={200}
                        onChange={(e) => setCount(Math.max(1, Math.min(200, Number(e.target.value))))}
                        css={{ width: 70, padding: '6px 10px', textAlign: 'center', background: colors.background, border: `1px solid ${colors.line}`, borderRadius: 4, fontSize: '0.9rem' }} />
                </div>
                <button onClick={() => setCombos(genCombos(excluded, weights, count))}
                    css={{ padding: '7px 20px', background: '#7C3AED', borderRadius: 4, fontSize: '0.9rem', fontWeight: 'bold', '&:hover': { background: '#6d28d9' } }}>
                    생성하기
                </button>
                {combos.length > 0 && (
                    <button onClick={() => downloadCSV(filteredCombos)} css={btnOutline}>엑셀 다운로드</button>
                )}
            </div>

            {combos.length > 0 && (
                <>
                    <div css={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '14px 16px', marginBottom: 16 }}>
                        <p css={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: 12 }}>결과 필터 (실시간 적용)</p>
                        <div css={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <CheckboxFilter label="홀/짝 (홀 기준)" values={[0,1,2,3,4,5,6]} selected={filter.odd} onChange={(v) => setF('odd', v)} />
                            <CheckboxFilter label="고/저 (고 기준)" values={[0,1,2,3,4,5,6]} selected={filter.high} onChange={(v) => setF('high', v)} />
                            <CheckboxFilter label="AC값" values={[0,1,2,3,4,5,6,7,8,9]} selected={filter.ac} onChange={(v) => setF('ac', v)} />
                            <RangeInput label="번호합" value={filter.sum} onChange={(v) => setF('sum', v)} min={21} max={270} />
                            <div>
                                <div css={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span css={{ fontSize: '0.82rem', opacity: 0.8 }}>고정수 {filter.fixed.size > 0 && `(${filter.fixed.size}개)`}</span>
                                    {filter.fixed.size > 0 && (
                                        <button onClick={() => setF('fixed', new Set())} css={{ fontSize: '0.75rem', color: '#f87171', background: 'none', padding: 0 }}>전체 해제</button>
                                    )}
                                </div>
                                <div css={{ overflowX: 'auto' }}>
                                    <div css={{ display: 'flex', gap: 6, flexWrap: 'nowrap', minWidth: 'max-content', paddingBottom: 4 }}>
                                        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                                            const isFixed = filter.fixed.has(num);
                                            return (
                                                <NumberButton key={num} number={num} size="md" mobileSize="sm"
                                                    selected={isFixed}
                                                    onClick={() => {
                                                        const next = new Set(filter.fixed);
                                                        isFixed ? next.delete(num) : next.add(num);
                                                        setF('fixed', next);
                                                    }} />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p css={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: 10 }}>
                        {filteredCombos.length}개 표시 중 (전체 {combos.length}개)
                    </p>
                    <div css={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {filteredCombos.map((combo, i) => (
                            <div key={i} css={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.line}`, borderRadius: 8, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div css={{ display: 'flex', gap: 5 }}>
                                    {combo.nums.map((num) => <NumberButton key={num} number={num} size="sm" disabled />)}
                                </div>
                                <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
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
                                    <button onClick={() => saveToLibrary(combo.nums)} css={{ padding: '4px 10px', flexShrink: 0, border: `1px solid ${colors.line}`, borderRadius: 4, fontSize: '0.75rem', background: 'none', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>
                                        서재에 담기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
        setExcluded((prev) => { const next = new Set(prev); next.has(n) ? next.delete(n) : next.add(n); return next; });

    const updateWeight = (num: number, value: number) =>
        setWeights((prev) => ({ ...prev, [num]: value }));

    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Panel1And2
                excluded={excluded} onToggle={toggleExclude}
                onClearExclude={() => setExcluded(new Set())}
                onLoadExclude={() => setExcluded(new Set(DUMMY_EXCLUDE))}
                weights={weights} onWeight={updateWeight}
                onResetWeights={() => setWeights(defaultWeights())}
                onLoadWeights={() => {
                    const wMap: Record<number, number> = {};
                    DUMMY_WEIGHTS.forEach(({ num, w }) => { wMap[num] = w; });
                    setWeights(wMap);
                }}
            />
            <Panel3Generate excluded={excluded} weights={weights} />
        </div>
    );
};

export default GenerateTab;
