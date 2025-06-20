// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FakeToken
 * @dev A fake ERC20 token used in malicious airdrop scams
 * WARNING: This is for educational purposes only - DO NOT deploy to mainnet
 */
contract FakeToken is ERC20, Ownable {
    
    // Events to make it look legitimate
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor(string memory name, string memory symbol, address initialOwner) ERC20(name, symbol) Ownable(initialOwner) {}
    
    /**
     * @dev Mint tokens - only owner can call this
     * Used to create fake tokens for the airdrop
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens - only owner can call this
     * Used to remove tokens from circulation
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev Batch mint tokens to multiple addresses
     * Used to simulate airdrop distribution
     */
    function batchMint(address[] memory recipients, uint256[] memory amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Emergency function to recover any ERC20 tokens sent to this contract
     */
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner(), tokenAmount);
    }
    
    /**
     * @dev Emergency function to recover ETH sent to this contract
     */
    function recoverETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
} 