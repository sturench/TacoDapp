import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html>
        <Head />
        <body className="bg-gradient-to-b from-taco_1 to-taco_2">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
