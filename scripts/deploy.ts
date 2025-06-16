import { ethers } from "hardhat";

async function main() {
  console.log("Deploying StakingContract...");

  const StakingContract = await ethers.getContractFactory("StakingContract");
  const stakingContract = await StakingContract.deploy();

  await stakingContract.deployed();

  console.log("StakingContract deployed to:", stakingContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 