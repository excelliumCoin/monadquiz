
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MONAD_TESTNET = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
};

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          setProvider(provider);
          setSigner(signer);
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== MONAD_TESTNET.chainId) {
        try {
          // Try to switch to Monad testnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MONAD_TESTNET.chainId }],
          });
        } catch (switchError) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [MONAD_TESTNET],
            });
          } else {
            throw switchError;
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      setProvider(provider);
      setSigner(signer);
      setAddress(accounts[0]);
      setIsConnected(true);

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setIsConnected(false);
  };

  return {
    isConnected,
    address,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
  };
}
