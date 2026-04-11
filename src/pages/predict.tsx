/** @jsxImportSource @emotion/react */
import View from '@components/_layout/client/View';
import { colors } from '@components/_layout/client/theme/colors';
import GenerateTab from '@components/client/predict/GenerateTab';
import ExcludeTab from '@components/client/predict/ExcludeTab';
import WeightTab from '@components/client/predict/WeightTab';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Tab = 'generate' | 'exclude' | 'weight';

const TABS: { id: Tab; label: string }[] = [
    { id: 'generate', label: '번호 생성' },
    { id: 'exclude', label: '제외수 이력' },
    { id: 'weight', label: '가중치 이력' },
];

const TabBar = ({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) => (
    <div css={{ display: 'flex', borderBottom: `1px solid ${colors.line}`, marginBottom: 20 }}>
        {TABS.map((t) => (
            <button
                key={t.id}
                onClick={() => onChange(t.id)}
                css={{
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: active === t.id ? 'bold' : 'normal',
                    color: active === t.id ? colors.white : `${colors.text}99`,
                    borderBottom: active === t.id ? `2px solid ${colors.white}` : '2px solid transparent',
                    marginBottom: -1,
                    background: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { color: colors.white },
                }}
            >
                {t.label}
            </button>
        ))}
    </div>
);

const PredictPage = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const tab: Tab = mounted ? ((router.query.tab as Tab) || 'generate') : 'generate';
    const setTab = (t: Tab) => router.push({ query: { tab: t } }, undefined, { shallow: true });

    return (
        <View>
            <div css={{ padding: '24px 0' }}>
                <p css={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.white, marginBottom: 20 }}>
                    로또 예측
                </p>
                <TabBar active={tab} onChange={setTab} />
                {tab === 'generate' && <GenerateTab />}
                {tab === 'exclude' && <ExcludeTab />}
                {tab === 'weight' && <WeightTab />}
            </div>
        </View>
    );
};

export default PredictPage;
