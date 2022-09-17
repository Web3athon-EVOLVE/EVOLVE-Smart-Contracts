# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

### Scripts Folder
#### ./testPool.ts
Script for testing our main contract "CommunityPool" or known as "Evolution Pool" to our users. 
#### ./deploy.ts
Script for deploting our main contract "CommunityPool" or known as "Evolution Pool" to our users. 
### Utils Folder
#### ./helpers.ts 
Contains functions helpful for writing scripts such getting the signer and the balance of an address
#### ./addresses.ts
Contains the addresses of deployed contracts from AAVE and ERC20 Standard
#### ./tokenAddresses.ts
Contains the token contract addresses of used tokens deployed on Polygon Mumbai
#### ./contractAddress.ts
Contains the contract address of our main "Evolution Pool" contract, it is updated everytime a new version is deployed to Polygon Mumbai. 
