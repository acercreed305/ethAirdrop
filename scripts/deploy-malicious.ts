import { ethers } from "hardhat";

async function main() {
  console.log("🚨 WARNING: Deploying malicious contracts for educational purposes only!");
  console.log("These contracts demonstrate scam techniques - DO NOT use on mainnet!\n");

  const [deployer] = await ethers.getSigners();

  // Deploy the malicious airdrop contract
  console.log("\n1. Deploying MaliciousAirdrop contract...");
  const MaliciousAirdrop = await ethers.getContractFactory("MaliciousAirdrop");
  const maliciousAirdrop = await MaliciousAirdrop.deploy();
  await maliciousAirdrop.deployed();
  console.log("MaliciousAirdrop deployed to:", maliciousAirdrop.address);

  // Deploy a legitimate-looking implementation contract for the proxy
  console.log("\n2. Deploying legitimate-looking implementation contract...");
  const LegitimateImplementation = await ethers.getContractFactory("MaliciousAirdrop");
  const legitimateImpl = await LegitimateImplementation.deploy();
  await legitimateImpl.deployed();
  console.log("Legitimate implementation deployed to:", legitimateImpl.address);

  // Deploy the malicious proxy contract
  console.log("\n3. Deploying MaliciousProxy contract...");
  const MaliciousProxy = await ethers.getContractFactory("MaliciousProxy");
  const maliciousProxy = await MaliciousProxy.deploy(legitimateImpl.address, deployer.address);
  await maliciousProxy.deployed();
  console.log("MaliciousProxy deployed to:", maliciousProxy.address);

  // Verify contract ownership
  console.log("\n4. Verifying contract ownership...");
  const airdropOwner = await maliciousAirdrop.owner();
  const proxyAdmin = await maliciousProxy.admin();
  const proxyImpl = await maliciousProxy.implementation();

  console.log("MaliciousAirdrop owner:", airdropOwner);
  console.log("MaliciousProxy admin:", proxyAdmin);
  console.log("MaliciousProxy implementation:", proxyImpl);

  // Deploy a fake token to make the scam more convincing
  console.log("\n5. Deploying fake token for scam...");
  const FakeToken = await ethers.getContractFactory("FakeToken");
  const fakeToken = await FakeToken.deploy("Fake Airdrop Token", "FAKE");
  await fakeToken.deployed();
  console.log("Fake token deployed to:", fakeToken.address);

  console.log("\n" + "=".repeat(60));
  console.log("🎯 MALICIOUS CONTRACTS DEPLOYED SUCCESSFULLY");
  console.log("=".repeat(60));
  console.log("Contract Addresses:");
  console.log("- MaliciousAirdrop:", maliciousAirdrop.address);
  console.log("- MaliciousProxy:", maliciousProxy.address);
  console.log("- Legitimate Implementation:", legitimateImpl.address);
  console.log("- Fake Token:", fakeToken.address);
  console.log("\n⚠️  REMEMBER: These are for educational purposes only!");
  console.log("⚠️  DO NOT deploy to mainnet or use with real funds!");
  console.log("=".repeat(60));

  // Save contract addresses to a file for easy access
  const contractAddresses = {
    maliciousAirdrop: maliciousAirdrop.address,
    maliciousProxy: maliciousProxy.address,
    legitimateImplementation: legitimateImpl.address,
    fakeToken: fakeToken.address,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name
  };

  const fs = require('fs');
  fs.writeFileSync(
    'malicious-contracts.json',
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("\nContract addresses saved to: malicious-contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 