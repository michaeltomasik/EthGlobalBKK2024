import { WagmiProvider, useAccount, useReadContracts } from 'wagmi';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem'
import { JsonRpcProvider } from 'ethers';
import axios from 'axios'
import { formatUnits } from 'viem'
import { BigNumberish, formatEther } from 'ethers'


// Infura Project ID and Network Configuration
const INFURA_PROJECT_ID = 'f4f4952ecdee46bfbcec346bc7663b73';
const INFURA_PROVIDER_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const ALCHEMY_API_KEY = 'H4b4WWXvKsoqPB2cz-Tn_2dVq7qyuPC-'
// const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const url = 'https://eth-mainnet.g.alchemy.com/v2/H4b4WWXvKsoqPB2cz-Tn_2dVq7qyuPC-';

export async function fetchTokenMetadata(tokenAddr, tokenBalanceHex) {
    try {
      // Set up parameters and config for the request
      const metadataParams = {
        jsonrpc: "2.0",
        method: "alchemy_getTokenMetadata",
        params: [tokenAddr],
        id: 42
      };
  
      // Make the POST request to Alchemy's API
      const response = await axios.post(url, metadataParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Extract metadata from response
      const metadata = response.data.result;
      
      // Form the token name using the name and symbol from metadata
      const tokenName = `${metadata.name} (${metadata.symbol})`;
  
      // Convert hex token balance to a BigNumber, then to decimal
      const tokenBalanceBigInt = BigInt(tokenBalanceHex); // tokenBalanceHex should be in hex format
      const tokenBalance = tokenBalanceBigInt / BigInt(Math.pow(10, metadata.decimals));
      
      console.log(`Token balance for ${tokenName} is ${tokenBalance}`);
      return metadata
    } catch (error) {
      console.error("Error fetching token metadata:", error);
    }
  }

export async function getTokenBalances(walletAddress) {
  
    const body = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [
            walletAddress,
            "erc20"
        ]
    });

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [walletAddress],
            id: 1
            }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Token Balances:', response.data.result);
        const tokenBalances = response.data.result.tokenBalances;

        const formattedBalances = await Promise.all(
            tokenBalances.map(async (token) => {
              // Extract contract address and balance in hex
              const tokenContractAddress = token.contractAddress;
              const tokenBalanceHex = token.tokenBalance;
          
              // Fetch metadata for the current token
              const metadata = await fetchTokenMetadata(tokenContractAddress, tokenBalanceHex);
            console.log('metadata',metadata)
              // Calculate the token balance in decimals
              const tokenBalanceBigInt = BigInt(tokenBalanceHex); // Convert hex balance to BigInt
              const decimals = metadata.decimals || 18; // Default to 18 if decimals not available
              const tokenBalance = parseFloat(formatUnits(tokenBalanceBigInt, decimals)).toFixed(4);
          
              // Formulate the token name and balance output
              const tokenName = `${metadata.name} (${metadata.symbol})`;
              console.log(`Token balance for ${tokenName} is ${tokenBalance}`);
          
              return {
                tokenName,
                tokenBalance,
                tokenContractAddress,
              };
            })
          );

        console.log("Formatted Token Balances:", formattedBalances);
        return formattedBalances
    } catch (error) {
        console.error('Error fetching token balances:', error);
    }
}
