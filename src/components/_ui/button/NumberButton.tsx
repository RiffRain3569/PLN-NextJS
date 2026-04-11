import { ButtonHTMLAttributes } from 'react';

type Size = 'sm' | 'md' | 'lg';

type Types = {
    number: number;
    selected?: boolean;
    size?: Size;
    mobileSize?: Size;
};

// 동행복권 공식 볼 색상 기준
const theme = {
    ltt0x: { main: '#FBC400', dark: '#c99900', text: '#ffffff' }, // 1–10: 노란색
    ltt1x: { main: '#0065CC', dark: '#003f80', text: '#ffffff' }, // 11–20: 파란색
    ltt2x: { main: '#E03535', dark: '#9e1212', text: '#ffffff' }, // 21–30: 빨간색
    ltt3x: { main: '#999999', dark: '#555555', text: '#ffffff' }, // 31–40: 회색
    ltt4x: { main: '#00C73C', dark: '#007824', text: '#ffffff' }, // 41–45: 초록색
    selected: { main: '#7C3AED', dark: '#4c1d95', text: '#ffffff' },
    hovered: { main: '#7C3AED', dark: '#4c1d95', text: '#ffffff' },
};

const sizes: Record<Size, { ball: number; font: number }> = {
    sm: { ball: 36, font: 13 },
    md: { ball: 40, font: 14 },
    lg: { ball: 44, font: 15 },
};

const getTheme = (number: number, selected?: boolean) => {
    if (selected) return theme.selected;
    if (number <= 10) return theme.ltt0x;
    if (number <= 20) return theme.ltt1x;
    if (number <= 30) return theme.ltt2x;
    if (number <= 40) return theme.ltt3x;
    return theme.ltt4x;
};

const NumberButton = ({ number, selected, size = 'md', mobileSize, ...props }: Types & ButtonHTMLAttributes<HTMLButtonElement>) => {
    const t = getTheme(number, selected);
    const s = sizes[size];
    const ms = sizes[mobileSize ?? size];

    return (
        <button
            css={{
                borderRadius: '50%',
                width: s.ball,
                height: s.ball,
                padding: 0,
                lineHeight: `${s.ball}px`,
                fontSize: s.font,
                fontWeight: 'bold',
                color: t.text,
                textAlign: 'center',
                background: `radial-gradient(circle at 35% 35%, ${t.main}, ${t.dark})`,
                boxShadow: `0 0 6px ${t.main}66`,
                flexShrink: 0,
                '@media (max-width: 768px)': {
                    width: ms.ball,
                    height: ms.ball,
                    lineHeight: `${ms.ball}px`,
                    fontSize: ms.font,
                },
                '&:hover': {
                    background: `radial-gradient(circle at 35% 35%, ${theme.hovered.main}, ${theme.hovered.dark})`,
                    boxShadow: `0 0 8px ${theme.hovered.main}88`,
                },
                '&:disabled': {
                    background: `radial-gradient(circle at 35% 35%, ${t.main}, ${t.dark})`,
                    boxShadow: `0 0 6px ${t.main}66`,
                },
            }}
            {...props}
        >
            {number}
        </button>
    );
};

export default NumberButton;
