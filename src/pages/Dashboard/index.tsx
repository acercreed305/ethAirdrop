import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { getAirdropContract, AirdropInfo } from '../../contracts/AirdropContract';

const Dashboard: React.FC = () => {
  const { account, connect } = useWallet();
  const [selectedTier, setSelectedTier] = useState<string>('basic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [airdropInfo, setAirdropInfo] = useState<AirdropInfo | null>(null);

  useEffect(() => {
    if (account) {
      fetchAirdropInfo();
    }
  }, [account]);

  const fetchAirdropInfo = async () => {
    if (!account) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getAirdropContract(provider.getSigner());
      const info = await contract.getAirdropInfo(account);
      setAirdropInfo(info);
    } catch (err) {
      console.error('Error fetching airdrop info:', err);
    }
  };

  const handleClaimAirdrop = async () => {
    if (!account) {
      await connect();
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getAirdropContract(signer);

      // Send the claim transaction
      const tx = await contract.claimAirdrop(selectedTier);
      
      // Wait for the transaction to be mined
      await tx.wait();

      // Refresh airdrop info
      await fetchAirdropInfo();
      
      console.log('Airdrop claimed successfully!', tx.hash);
    } catch (err) {
      console.error('Claiming airdrop failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to claim airdrop');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatEth = (wei: ethers.BigNumber) => {
    return parseFloat(ethers.utils.formatEther(wei)).toFixed(4);
  };

  const getTierReward = (tier: string) => {
    switch (tier) {
      case 'basic':
        return '0.01';
      case 'standard':
        return '0.05';
      case 'premium':
        return '0.1';
      default:
        return '0';
    }
  };

  const getTierTasks = (tier: string) => {
    switch (tier) {
      case 'basic':
        return '2 Tasks';
      case 'standard':
        return '4 Tasks';
      case 'premium':
        return '6 Tasks';
      default:
        return '0 Tasks';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-primary">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Airdrop Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Claimed */}
          <div className="bg-white dark:bg-dark-secondary overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Claimed
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {airdropInfo ? `${formatEth(airdropInfo.totalClaimed)} ETH` : '0 ETH'}
              </dd>
            </div>
          </div>

          {/* Available Rewards */}
          <div className="bg-white dark:bg-dark-secondary overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Available Rewards
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {airdropInfo ? `${formatEth(airdropInfo.availableRewards)} ETH` : '0 ETH'}
              </dd>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="bg-white dark:bg-dark-secondary overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Tasks Completed
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {airdropInfo ? `${airdropInfo.tasksCompleted.toNumber()}` : '0'}
              </dd>
            </div>
          </div>
        </div>

        {/* Airdrop Form */}
        <div className="mt-8">
          <div className="bg-white dark:bg-dark-secondary shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Claim Airdrop
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="tier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Tier
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
                  >
                    <option value="basic">Basic (2 Tasks) - 0.01 ETH</option>
                    <option value="standard">Standard (4 Tasks) - 0.05 ETH</option>
                    <option value="premium">Premium (6 Tasks) - 0.1 ETH</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Airdrop Details
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>Tasks Required: {getTierTasks(selectedTier)}</p>
                        <p>ETH Reward: {getTierReward(selectedTier)} ETH</p>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleClaimAirdrop}
                  disabled={isProcessing}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : account ? 'Claim Airdrop' : 'Connect Wallet to Claim'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="mt-8">
          <div className="bg-white dark:bg-dark-secondary shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Recent Claims
              </h3>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    { tier: 'Premium', amount: '0.1 ETH', date: '2 days ago' },
                    { tier: 'Standard', amount: '0.05 ETH', date: '1 day ago' },
                    { tier: 'Basic', amount: '0.01 ETH', date: '3 days ago' },
                  ].map((claim, index) => (
                    <li key={index} className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{claim.tier} Tier</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{claim.date}</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Amount: {claim.amount}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 