import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

const Document = () => {
    return (
        <Html lang='en'>
            <Head>
                <link rel='manifest' href='/manifest.json' />
                <meta name='theme-color' content='#9aa7f9' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
