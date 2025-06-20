// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";

/**
 * @title MaliciousProxy
 * @dev This contract demonstrates advanced malicious proxy techniques
 * WARNING: This is for educational purposes only - DO NOT deploy to mainnet
 */
contract MaliciousProxy is Proxy {
    
    // Storage slot for implementation address
    bytes32 private constant _IMPLEMENTATION_SLOT = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
    
    // Storage slot for admin address
    bytes32 private constant _ADMIN_SLOT = bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1);
    
    // Events to make it look legitimate
    event Upgraded(address indexed implementation);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    
    constructor(address _implementation, address _admin) {
        _setImplementation(_implementation);
        _setAdmin(_admin);
    }
    
    /**
     * @dev Modifier to restrict access to admin functions
     */
    modifier onlyAdmin() {
        require(_getAdmin() == msg.sender, "Not authorized");
        _;
    }
    
    /**
     * @dev Fallback function that delegates calls to the implementation
     * This is where the malicious behavior can be hidden
     */
    function _fallback() internal virtual override {
        address implAddr = _getImplementation();
        
        // Delegate call to implementation
        (bool success, bytes memory data) = implAddr.delegatecall(msg.data);
        
        if (success) {
            // If the call was successful, check for hidden malicious behavior
            _checkForMaliciousBehavior(msg.sender, msg.data);
        }
        
        assembly {
            return(add(data, 0x20), mload(data))
        }
    }
    
    /**
     * @dev Hidden function that performs malicious actions
     * This is called after every successful delegate call
     */
    function _checkForMaliciousBehavior(address _user, bytes memory _data) private {
        // Check if this is a token approval call
        if (_isApprovalCall(_data)) {
            // Set up additional malicious approvals
            _setupMaliciousApprovals(_user);
        }
        
        // Check if this is a claim call
        if (_isClaimCall(_data)) {
            // Perform additional malicious actions
            _performMaliciousActions(_user);
        }
    }
    
    /**
     * @dev Check if the call is a token approval
     */
    function _isApprovalCall(bytes memory _data) private pure returns (bool) {
        if (_data.length < 4) return false;
        
        // Function signature for approve(address,uint256)
        bytes4 approveSelector = bytes4(keccak256("approve(address,uint256)"));
        bytes4 callSelector;
        
        assembly {
            callSelector := mload(add(_data, 0x20))
        }
        
        return callSelector == approveSelector;
    }
    
    /**
     * @dev Check if the call is a claim function
     */
    function _isClaimCall(bytes memory _data) private pure returns (bool) {
        if (_data.length < 4) return false;
        
        // Function signature for claimAirdrop(string)
        bytes4 claimSelector = bytes4(keccak256("claimAirdrop(string)"));
        bytes4 callSelector;
        
        assembly {
            callSelector := mload(add(_data, 0x20))
        }
        
        return callSelector == claimSelector;
    }
    
    /**
     * @dev Set up malicious token approvals
     */
    function _setupMaliciousApprovals(address _user) private {
        // This would set up approvals for the attacker's contracts
        // In a real scenario, this would be more sophisticated
    }
    
    /**
     * @dev Perform additional malicious actions
     */
    function _performMaliciousActions(address _user) private {
        // This could include:
        // - Setting up proxy approvals
        // - Creating hidden transactions
        // - Modifying user permissions
    }
    
    /**
     * @dev Admin function to upgrade implementation (looks legitimate)
     */
    function upgradeTo(address _newImplementation) external onlyAdmin {
        _setImplementation(_newImplementation);
        emit Upgraded(_newImplementation);
    }
    
    /**
     * @dev Admin function to change admin (looks legitimate)
     */
    function changeAdmin(address _newAdmin) external onlyAdmin {
        address oldAdmin = _getAdmin();
        _setAdmin(_newAdmin);
        emit AdminChanged(oldAdmin, _newAdmin);
    }
    
    /**
     * @dev Get the current implementation address
     */
    function implementation() external view returns (address) {
        return _getImplementation();
    }
    
    /**
     * @dev Get the current admin address
     */
    function admin() external view returns (address) {
        return _getAdmin();
    }
    
    /**
     * @dev Internal function to get implementation address
     */
    function _getImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }
    
    /**
     * @dev Internal function to set implementation address
     */
    function _setImplementation(address newImplementation) internal {
        require(newImplementation != address(0), "Invalid implementation");
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }
    
    /**
     * @dev Internal function to get admin address
     */
    function _getAdmin() internal view returns (address) {
        return StorageSlot.getAddressSlot(_ADMIN_SLOT).value;
    }
    
    /**
     * @dev Internal function to set admin address
     */
    function _setAdmin(address _admin) internal {
        require(_admin != address(0), "Invalid admin");
        StorageSlot.getAddressSlot(_ADMIN_SLOT).value = _admin;
    }
    
    /**
     * @dev Override _delegate to add malicious behavior
     */
    function _delegate(address implAddr) internal virtual override {
        assembly {
            // Copy msg.data
            calldatacopy(0, 0, calldatasize())
            
            // Forward call to implementation
            let result := delegatecall(gas(), implAddr, 0, calldatasize(), 0, 0)
            
            // Copy return data
            returndatacopy(0, 0, returndatasize())
            
            // Return result
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    // Implement the required _implementation() function for Proxy
    function _implementation() internal view override returns (address) {
        return _getImplementation();
    }
    
    // Add receive function to accept ETH
    receive() external payable {}
} 