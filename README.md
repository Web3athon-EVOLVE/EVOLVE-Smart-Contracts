# Hardhat Project

## Install Dependencies
```shell
# use yarn package manager
yarn install
```
## Run Scripts
```shell
# deploy main smart contract
yarn deploy-mumbai
# run test script
yarn script
```

## Scripts Folder
#### ./testPool.ts
Script for testing our main contract "CommunityPool" or known as "Evolution Pool" to our users. 
#### ./deploy.ts
Script for deploting our main contract "CommunityPool" or known as "Evolution Pool" to our users. 
## Utils Folder
#### ./helpers.ts 
Contains functions helpful for writing scripts such getting the signer and the balance of an address
#### ./addresses.ts
Contains the addresses of deployed contracts from AAVE and ERC20 Standard
#### ./tokenAddresses.ts
Contains the token contract addresses of used tokens deployed on Polygon Mumbai
#### ./contractAddress.ts
Contains the contract address of our main "Evolution Pool" contract, it is updated everytime a new version is deployed to Polygon Mumbai. 
