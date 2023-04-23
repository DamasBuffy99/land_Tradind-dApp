const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { LAND_MINTING_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  const landMintingContractAddress = LAND_MINTING_CONTRACT_ADDRESS;
  const landTradingContract = await ethers.getContractFactory("landTrading");

  const deployedLandTradingContract = await landTradingContract.deploy(
    landMintingContractAddress
  );
  await deployedLandTradingContract.deployed();

  // print the address of the deployed contract
  console.log("landTrading Contract Address:", deployedLandTradingContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });