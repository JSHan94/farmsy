import { createRoot } from "react-dom/client";
import { PrivyProvider } from '@privy-io/react-auth';
import App from "./App.tsx";
import "./index.css";

const PRIVY_APP_ID = 'cmcio1ujk0067l80mkeatt4wu'; // Replace with your actual Privy App ID

createRoot(document.getElementById("root")!).render(
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={{
      loginMethods: ['wallet', 'email'],
      appearance: {
        theme: 'light',
        accentColor: '#676FFF',
        logo: 'https://your-logo-url.com/logo.png'
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets'
      }
    }}
  >
    <App />
  </PrivyProvider>
);
  