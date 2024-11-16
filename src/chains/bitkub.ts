import { defineChain } from 'viem';

export const bitkubChain = defineChain({
  id: 96,
  name: 'Bitkub Chain',
  network: 'bitkub',
  nativeCurrency: {
    name: 'Bitkub Coin',
    symbol: 'KUB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bitkubchain.io'],
    },
    public: {
      http: ['https://rpc.bitkubchain.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Bitkub Explorer', url: 'https://bkcscan.com' },
  },
})