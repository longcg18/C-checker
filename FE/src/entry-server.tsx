import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app/App';

const GOOGLE_CLIENT_ID = '988401071814-56kve7lfi1sg4vqckqju6v0p25hk5o8o.apps.googleusercontent.com';

export function render(url: string) {
  return renderToString(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </GoogleOAuthProvider>,
  );
}
