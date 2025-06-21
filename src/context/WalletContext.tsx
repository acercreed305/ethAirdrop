import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const walletConnectProviderRef = useRef<WalletConnectProvider | null>(null);

  useEffect(() => {
    if (!walletConnectProviderRef.current) {
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
          walletConnectProviderRef.current = provider;
        } catch (error) {
          console.error('Failed to initialize WalletConnect:', error);
        }
      };

      initWalletConnect();
    }

    // Cleanup function
    return () => {
      if (walletConnectProviderRef.current) {
        walletConnectProviderRef.current.removeListener('accountsChanged', () => {});
        walletConnectProviderRef.current.removeListener('chainChanged', () => {});
        walletConnectProviderRef.current.removeListener('disconnect', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
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
      } else if (walletConnectProviderRef.current) {
        await walletConnectProviderRef.current.enable();
        const provider = new ethers.BrowserProvider(walletConnectProviderRef.current);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        setAccount(address);

        walletConnectProviderRef.current.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
        });

        walletConnectProviderRef.current.on('chainChanged', () => {
          window.location.reload();
        });

        walletConnectProviderRef.current.on('disconnect', () => {
          setAccount(null);
        });
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
    if (walletConnectProviderRef.current) {
      walletConnectProviderRef.current.disconnect();
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
    <WalletContext.Provider value={{ account, connect: connectWallet, disconnect, isConnecting, error }}>
      {children}
    </WalletContext.Provider>
  );
}; 