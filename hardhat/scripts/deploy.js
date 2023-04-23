const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { metadataURL } = require("../constants");

async function main() {
  const METADATA_URL = metadataURL
  const landMintingContract = await ethers.getContractFactory("landMinting");

  const deployedLandMintingContract = await landMintingContract.deploy(
    METADATA_URL
  );
  await deployedLandMintingContract.deployed();

  // print the address of the deployed contract
  console.log("landMinting Contract Address:", deployedLandMintingContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });