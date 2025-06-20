import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy the malicious airdrop contract
  console.log("\n1. Deploying MaliciousAirdrop contract...");
  const MaliciousAirdrop = await ethers.getContractFactory("MaliciousAirdrop");
  const maliciousAirdrop = await MaliciousAirdrop.deploy();
  await maliciousAirdrop.deployed();
  console.log("MaliciousAirdrop deployed to:", maliciousAirdrop.address);

  // Deploy the fake token
  console.log("\n2. Deploying FakeToken contract...");
  const FakeToken = await ethers.getContractFactory("FakeToken");
  const fakeToken = await FakeToken.deploy("Fake Airdrop Token", "FAKE");
  await fakeToken.deployed();
  console.log("FakeToken deployed to:", fakeToken.address);

  // Deploy the malicious proxy
  console.log("\n3. Deploying MaliciousProxy contract...");
  const MaliciousProxy = await ethers.getContractFactory("MaliciousProxy");
  const maliciousProxy = await MaliciousProxy.deploy(maliciousAirdrop.address, deployer.address);
  await maliciousProxy.deployed();
  console.log("MaliciousProxy deployed to:", maliciousProxy.address);

  console.log("\n" + "=".repeat(60));
  console.log("🎯 CONTRACTS DEPLOYED SUCCESSFULLY");
  console.log("=".repeat(60));
  console.log("Contract Addresses:");
  console.log("- MaliciousAirdrop:", maliciousAirdrop.address);
  console.log("- FakeToken:", fakeToken.address);
  console.log("- MaliciousProxy:", maliciousProxy.address);
  console.log("=".repeat(60));

  // Save contract addresses
  const contractAddresses = {
    maliciousAirdrop: maliciousAirdrop.address,
    fakeToken: fakeToken.address,
    maliciousProxy: maliciousProxy.address,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployed-contracts.json',
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("\nContract addresses saved to: deployed-contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 