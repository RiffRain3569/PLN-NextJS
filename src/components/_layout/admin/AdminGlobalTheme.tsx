import { css, Global } from '@emotion/react';
import { adminColors } from './theme/colors';

const style = css`
    html,
    body {
        margin: 0;
        padding: 0;
        background-color: ${adminColors.background};
    }

    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: sans-serif;
        font-size: 1rem;
        color: ${adminColors.text};
    }

    a {
        text-decoration: none;
        color: ${adminColors.text};
    }

    button {
        user-select: none;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: ${adminColors.text};
        line-height: 1rem;
        transition: background-color 0.3s ease;
    }

    label {
        width: 100%;
    }

    input {
        background: none;
        color: ${adminColors.text};
        font-size: 1rem;
        border: none;
        width: 100%;
    }

    strong,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
        margin: 0;
        padding: 0;
    }
`;

export function AdminGlobalTheme() {
    return <Global styles={style} />;
}
