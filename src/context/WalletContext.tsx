import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, goerli, sepolia } from 'wagmi/chains';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

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

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure chains
  const chains = [mainnet, goerli, sepolia];
  const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '';

  const { publicClient } = configureChains(chains, [
    w3mProvider({
      projectId,
    }),
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
          showQrModal: true,
          metadata: {
            name: 'ETH Airdrop',
            description: 'ETH Airdrop Platform',
            url: window.location.origin,
            icons: [`${window.location.origin}/logo192.png`],
          },
        },
      }),
    ],
    publicClient,
  });

  const ethereumClient = new EthereumClient(wagmiConfig, chains);

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
      } else {
        // If no injected provider, use WalletConnect
        const connector = wagmiConfig.connectors[0];
        if (connector) {
          try {
            // Connect using WalletConnect
            const result = await connector.connect();
            if (result.account) {
              setAccount(result.account);
            } else {
              throw new Error('No account found after connection');
            }
          } catch (error: any) {
            console.error('WalletConnect connection error:', error);
            throw new Error('Failed to connect using WalletConnect');
          }
        } else {
          throw new Error('No wallet connection method available');
        }
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setError(null);
  };

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletContext.Provider value={{ account, connect, disconnect, isConnecting, error }}>
        {children}
      </WalletContext.Provider>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeVariables={{
          '--w3m-font-family': 'Roboto, sans-serif',
          '--w3m-accent-color': '#3b82f6',
        }}
        defaultChain={mainnet}
        enableNetworkView={true}
        enableExplorer={true}
      />
    </WagmiConfig>
  );
}; 