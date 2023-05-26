import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets, midnightTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { sepolia, goerli, hardhat } from '@wagmi/chains';
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const alchemyId = process.env.REACT_APP_ALCHEMY_SEPOLIA_API_KEY_URL;

//Get the App supported chains
const { chains, provider } = configureChains(
  [sepolia],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_SEPOLIA_API_KEY_URL }),
    jsonRpcProvider({
      rpc: () => ({
        http: alchemyId,
      }),
    }),
  ]
);

//Get default wallets supported by RainbowKit (MM, Coinbase and co)
const {connectors} = getDefaultWallets({
  appName: "Hereditas",
  chains,
});

//Wagmi client
const wagmiClient = createClient({
  connectors,
  provider,
});

const appInfo = {
  appName: "Hereditas Wills App"
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
      appInfo={appInfo}
        chains={chains}
        theme={midnightTheme({
          accentColor: "#2769f4",
          fontWeight: "bold",
          fontStack: "system",
          overlayBlur: "small"
        })}
      >
      <ToastContainer />
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </>
);

