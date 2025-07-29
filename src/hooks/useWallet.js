import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);
  const { toast } = useToast();

  const MONAD_TESTNET = {
    chainId: '0x29A', // 666 in hex
    chainName: 'Monad Testnet',
    nativeCurrency: {
      name: 'MON',
      symbol: 'MON',
      decimals: 18
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet-explorer.monad.xyz']
  };

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          await getBalance(accounts[0]);
          await checkNetwork();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Not Found",
        description: "Please install the MetaMask wallet extension.",
        variant: "destructive"
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        await switchToMonadTestnet();
        await getBalance(accounts[0]);
        
        toast({
          title: "Wallet Connected!",
          description: `Successfully connected to Monad Testnet.`,
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your wallet.",
        variant: "destructive"
      });
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
    setNetwork(null);
  };

  const switchToMonadTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          console.error('Error adding Monad Testnet:', addError);
          toast({
            title: "Failed to Add Network",
            description: "There was an error adding the Monad Testnet.",
            variant: "destructive"
          });
        }
      } else {
        console.error('Error switching to Monad Testnet:', switchError);
      }
    }
  };

  const getBalance = async (walletAddress) => {
    try {
      const mockBalance = (Math.random() * 1000).toFixed(2);
      setBalance(mockBalance);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === MONAD_TESTNET.chainId) {
        setNetwork('Monad Testnet');
      } else {
        setNetwork('Wrong Network');
        toast({
          title: "Wrong Network",
          description: "Please switch to the Monad Testnet.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== address) {
          setAddress(accounts[0]);
          getBalance(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      checkConnection();

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [address]);

  return {
    isConnected,
    address,
    balance,
    network,
    connect,
    disconnect,
  };
};