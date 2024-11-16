import { WagmiProvider, useAccount, useReadContracts } from 'wagmi';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem'
import { JsonRpcProvider } from 'ethers';
import axios from 'axios'
import { formatUnits } from 'viem'
import { BigNumberish, formatEther } from 'ethers'


export const TokenBalances = ({
    tokenBalances = []
}) => {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState([]);
  // Connect to the Ethereum network
    const provider = new JsonRpcProvider("https://shape-mainnet.g.alchemy.com/v2/H4b4WWXvKsoqPB2cz-Tn_2dVq7qyuPC-");

//   const [tokenBalances, setTokenBalances] = useState([]);
//     useEffect(() => {
//         const getBalance = async () => {
//             const balances = await getTokenBalances(address);
//             setTokenBalances(balances)
//             console.log('BALANCES', balances)
//         }
//         getBalance()
//     }, [address]);

    return (
    <div>
      {isConnected && (
        <div>
          <h2>Token Balances:</h2>
          <ul>
            {tokenBalances.filter(t => t.tokenBalance > 0).map((token, index) => (
              <li key={index}>
                {token.tokenName}: {token.tokenBalance}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
