import { ethers } from "hardhat";

import * as communityPoolJSON from "../artifacts/contracts/CommunityPool.sol/CommunityPool.json";
import * as ILendingPoolJSON from "../artifacts/contracts/interfaces/ILendingPool.sol/ILendingPool.json";

import { mumbaiContractAddress } from "../utils/contractAddress";
import { getSigner, checkBalance } from "../utils/helpers";
import { addresses } from "../utils/addresses";
import { tokenAddresses } from "../utils/tokenAddresses";


// Deployed-addresses on Polygon Mumbai - USED
const LENDING_POOL_ADDRESSES_PROVIDER = addresses["Polygon Mumbai"]["AAVE"]["LendingPoolAddressesProvider"]
const LENDING_POOL = addresses["Polygon Mumbai"]["AAVE"]["LendingPool"]
const WMATIC_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["wMATIC"]
const AMWMATIC_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["amWMATIC"]

// UNUSED TOKENS
const DAI_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["DAI"]
const USDC_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["USDC"]
const AM_DAI_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["amDAI"]
const VARIABLE_DEBT_MDAI_TOKEN = tokenAddresses["Polygon Mumbai"]["AAVE"]["variableDebtmDAI"]
const EVOLVE_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["EvolveToken"]

async function main() {
    const signer = getSigner();
    if (!checkBalance(signer)) {
      return;
    }

    const communityPoolFactory = new ethers.ContractFactory(
      communityPoolJSON.abi,
      communityPoolJSON.bytecode,
      signer
    );

    // Setting Pool Provider and Pool Tokens
    const communityPoolContract = communityPoolFactory.attach(mumbaiContractAddress);
    console.log("CommunityPool Contract Deployed to: ", mumbaiContractAddress);
    console.log("Lending Pool Addresses Provider Deployed to: ", LENDING_POOL_ADDRESSES_PROVIDER);
    let txn = await communityPoolContract.setPoolProvider(LENDING_POOL_ADDRESSES_PROVIDER);
    let wait = await txn.wait();

    txn = await communityPoolContract.setPoolTokens(WMATIC_TOKEN);
    wait = await txn.wait();
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");

    // Get wMATIC
    console.log("Getting wMATIC for by depositing 0.01 MATIC: ", signer.address);

    const IWMatic_Contract = await ethers.getContractAt("IWMatic", WMATIC_TOKEN);
    const IERC_Contract = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", WMATIC_TOKEN);

    let WMATIC_Balance = await IERC_Contract.balanceOf(signer.address);
    console.log("BEFORE - Account's wMATIC Balance: ", ethers.utils.formatEther(WMATIC_Balance));

    txn = await IWMatic_Contract.deposit({"value": ethers.utils.parseUnits("0.01")});
    wait = await txn.wait();

    WMATIC_Balance = await IERC_Contract.balanceOf(signer.address);
    console.log("AFTER - Account's wMATIC Balance: ", ethers.utils.formatEther(WMATIC_Balance));
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");

    // Approve CommunityPool Contract to spend Caller's Tokens
    console.log("Admin Deposits to Pool: ", signer.address);
    let amount = ethers.utils.parseUnits("0.01");
    txn = await IERC_Contract.approve(mumbaiContractAddress, amount);
    wait = await txn.wait();
    console.log("approve(address spender, uint256 amount) → bool", mumbaiContractAddress, ethers.utils.formatEther(amount));
    console.log("CALLER: ", signer.address);
    console.log("SPENDER: ", mumbaiContractAddress); 
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");

    // Get spender's allowance
    let WMATIC_Allowance = await IERC_Contract.allowance(signer.address, mumbaiContractAddress);
    wait = await txn.wait();
    console.log("allowance(address owner, address spender) → uint256: ", ethers.utils.formatEther(WMATIC_Allowance));
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");

    // Deposit Into Pool
    console.log("Admin Deposits wMATIC Into Pool: ", signer.address);
    WMATIC_Balance = await IERC_Contract.balanceOf(signer.address);
    console.log("BEFORE - Balance of Admin (wMATIC): ", ethers.utils.formatEther(WMATIC_Balance));
    txn = await communityPoolContract.poolDeposit(WMATIC_TOKEN, amount, { gasLimit: 2074040 });
    wait = await txn.wait();
    WMATIC_Balance = await IERC_Contract.balanceOf(signer.address);
    console.log("AFTER - Balance of Admin (wMATIC): ", ethers.utils.formatEther(WMATIC_Balance));
    console.log("SUCCESS: wMATIC Deposited Into Contract! Now earning amwMATIC.");
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");

    //aToken of contract
    const amWMATIContract = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", AMWMATIC_TOKEN);
    let amWMATIC_Balance = await amWMATIContract.balanceOf(mumbaiContractAddress);
    console.log("Balance of CommunityPool Contract (amWMATIC):", ethers.utils.formatEther(amWMATIC_Balance));
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");

    // define instance of aave pool & get user data
    const aavePool = await ethers.getContractAt(
        ILendingPoolJSON.abi,
        LENDING_POOL
    )
    const userData = await aavePool.getUserAccountData(mumbaiContractAddress);
    let total_collateral_eth = userData.totalCollateralETH;
    let total_debt_eth = userData.totalDebtETH;
    let available_borrow_eth = userData.availableBorrowsETH;
    let current_liquidation_threshold = userData.currentLiquidationThreshold;
    let ltv = userData.ltv;
    let health_factor = userData.healthFactor;
    console.log("TOTAL COLLATERAL: ", ethers.utils.formatEther(total_collateral_eth));
    console.log("TOTAL DEBT: ", ethers.utils.formatEther(total_debt_eth));
    console.log("AVAILABLE BORROW: ", ethers.utils.formatEther(available_borrow_eth));
    console.log("CURRENT LIQUIDATION THRESHOLD: ", ethers.utils.formatEther(current_liquidation_threshold));
    console.log("LTV: ", ethers.utils.formatEther(ltv));
    console.log("HEALTH FACTOR: ", ethers.utils.formatEther(health_factor));
    console.log("\n^^^^^^^^^---------------^^^^^^^^^\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
