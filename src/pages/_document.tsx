import createEmotionCache from '@lib/emotionCache';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const cache = createEmotionCache();
        const { extractCriticalToChunks } = createEmotionServer(cache);

        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App: any) =>
                    function EnhancedApp(props) {
                        return <App emotionCache={cache} {...props} />;
                    },
            });

        const initialProps = await Document.getInitialProps(ctx);
        const emotionStyles = extractCriticalToChunks(initialProps.html);
        const emotionStyleTags = emotionStyles.styles.map((style) => (
            <style
                data-emotion={`${style.key} ${style.ids.join(' ')}`}
                key={style.key}
                dangerouslySetInnerHTML={{ __html: style.css }}
            />
        ));

        return { ...initialProps, emotionStyleTags };
    }

    render() {
        return (
            <Html lang='ko'>
                <Head>
                    <link rel='manifest' href='/manifest.json' />
                    <meta name='theme-color' content='#590016' />
                    {(this.props as any).emotionStyleTags}
                </Head>
                <body style={{ backgroundColor: '#24171D', margin: 0 }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
