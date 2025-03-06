import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-EP2SNGBVC5';

interface MyDocumentProps {
  lang: string;
}
class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & MyDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const lang = ctx.req
      ? ctx.req.headers['accept-language']?.split(',')[0] || 'en'
      : 'en';

    return { ...initialProps, lang };
  }
  render() {
    return (
      <Html
        lang={this.props.lang}
        dir={this.props.lang === 'ar-XA' ? 'rtl' : 'ltr'}
        className='bg-light-main dark:bg-dark-main'
      >
        <Head>
          <meta name='theme-color' content='#112489' />
          <meta name='theme-color' content='#112489' media='(prefers-color-scheme: light)' />
          <meta name='theme-color' content='#112489' media='(prefers-color-scheme: dark)' />
          <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, maximum-scale=1'
          />

          <link
            rel='preload'
            href='/fonts/Oswald-Regular.ttf'
            as='font'
            type='font/ttf'
            crossOrigin='anonymous'
          />
          <style>{`
            @font-face {
              font-family: 'Oswald';
              src: url('/fonts/Oswald-Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `}</style>

          <script
            async
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8028766040172456'
            crossOrigin='anonymous'
            suppressHydrationWarning
          />
        </Head>
        <body>
          <Main />
          <NextScript />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          ></script>

          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
                document.documentElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                document.documentElement.setAttribute('xml:lang', '${this.props.lang}');
              `,
            }}
          />
          <script
            async
            defer
            dangerouslySetInnerHTML={{
              __html: `
                window.smartlook||(function(d) {
                var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
                var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
                c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
                })(document);
                smartlook('init', 'd82bdaf3f72cd294482fbd2601805673bffa1c6a', { region: 'eu' });
              `,
            }}
          />
          <script
            id='Cookiebot'
            src='https://consent.cookiebot.com/uc.js'
            data-cbid='e5ee4728-096c-4e6d-822c-c16879344410'
            data-blockingmode='auto'
            type='text/javascript'
            defer
            async
            onLoad={() => document.body.classList.add('body-hidden')}
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
