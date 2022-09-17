import { ethers } from "hardhat";
import * as communityPoolJSON from "../artifacts/contracts/CommunityPool.sol/CommunityPool.json";
import { getSigner, checkBalance } from "../utils/helpers";
import * as fs from "fs";

async function main() {
  const signer = getSigner();
  if (!checkBalance(signer)) {
    return;
  }

  console.log("Deploying CommunityPool contract...");
  const contractFactory = new ethers.ContractFactory(
    communityPoolJSON.abi,
    communityPoolJSON.bytecode,
    signer
  );

  const contract = await contractFactory.deploy();
  console.log("Awaiting confirmations...");
  await contract.deployed();

  fs.writeFileSync(
    "./utils/contractAddress.ts",
    `export const mumbaiContractAddress = "${contract.address}"`
  );

  console.log("Completed!");
  console.log(`Contract deployed at ${contract.address}`);
  console.log("Contract address saved at: ./utils/contractAddress.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
