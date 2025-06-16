import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/ethereum-provider';

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  error: null,
});

export const useWallet = () => useContext(WalletContext);

const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletConnectProvider, setWalletConnectProvider] = useState<WalletConnectProvider | null>(null);

  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        const provider = await WalletConnectProvider.init({
          projectId,
          chains: [1], // Mainnet
          showQrModal: true,
          metadata: {
            name: 'ETH Airdrop',
            description: 'ETH Airdrop Platform',
            url: window.location.origin,
            icons: [`${window.location.origin}/logo192.png`],
          },
        });
        setWalletConnectProvider(provider);
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
      }
    };

    initWalletConnect();
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Try to connect using window.ethereum first (MetaMask)
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            setAccount(accounts[0] || null);
          });

          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });

          window.ethereum.on('disconnect', () => {
            setAccount(null);
          });
        } catch (error: any) {
          console.error('MetaMask connection error:', error);
          throw new Error('Failed to connect to MetaMask');
        }
      } else if (walletConnectProvider) {
        // If no injected provider, use WalletConnect
        try {
          await walletConnectProvider.connect();
          const provider = new ethers.providers.Web3Provider(walletConnectProvider);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
            setAccount(accounts[0] || null);
          });

          walletConnectProvider.on('chainChanged', () => {
            window.location.reload();
          });

          walletConnectProvider.on('disconnect', () => {
            setAccount(null);
          });
        } catch (error: any) {
          console.error('WalletConnect connection error:', error);
          throw new Error('Failed to connect using WalletConnect');
        }
      } else {
        throw new Error('No wallet connection method available');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (walletConnectProvider) {
      walletConnectProvider.disconnect();
    }
    setAccount(null);
    setError(null);
  };

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connect, disconnect, isConnecting, error }}>
      {children}
    </WalletContext.Provider>
  );
}; 