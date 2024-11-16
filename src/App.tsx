import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from 'react';

import { ConnectButton, RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider, useAccount, http } from "wagmi";
import { rainbowWeb3AuthConnector } from "./RainbowWeb3authConnector";
import { rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sepolia, mainnet, polygon } from "wagmi/chains";

import PixiDragAndDrop from './components/dragAndDrop'
import {TokenBalances} from './components/Balances'
import { getTokenBalances } from './utls/helpers'

export default function App() {
  const { address, isConnected } = useAccount();

  const [tokenBalances, setTokenBalances] = useState([]);
    useEffect(() => {
        const getBalance = async () => {
            const balances = await getTokenBalances(address);
            setTokenBalances(balances)
            console.log('BALANCES', balances)
        }
        getBalance()
    }, [address]);
  
  return (
<div style={{ justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
      {!address ? (<div className="cover-pic">
          <ConnectButton />
        </div>) : <ConnectButton />}

        {address && (
          <>
            <TokenBalances tokenBalances={tokenBalances} />
            <PixiDragAndDrop tokenBalances={tokenBalances} />
          </>
        )}
      </div>
  );
}
