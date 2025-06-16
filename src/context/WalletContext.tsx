import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

interface WalletContextType {
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    try {
      setIsConnecting(true);
      
      // Configure WalletConnect provider
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID, // You'll need to add your WalletConnect Project ID
            metadata: {
              name: 'ETH Airdrop',
              description: 'ETH Airdrop Platform',
              url: window.location.origin,
              icons: [`${window.location.origin}/logo192.png`]
            },
            rpc: {
              1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
              5: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
              11155111: `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
            },
            chainId: 1, // Mainnet by default
          },
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
        disableInjectedProvider: false, // Allow injected providers (like MetaMask Mobile)
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);

      connection.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      connection.on('chainChanged', () => {
        window.location.reload();
      });

      connection.on('disconnect', () => {
        setAccount(null);
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      if (web3Modal.cachedProvider) {
        await connect();
      }
    };

    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ account, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}; 