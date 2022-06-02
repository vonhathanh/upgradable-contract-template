1. Install hardhat: https://hardhat.org/getting-started#installation

2. Run npx hardhat init, choose create a basic sample project

3. Install other dependencies of hardhat: npm install --save-dev "hardhat@^2.9.7" "@nomiclabs/hardhat-waffle@^2.0.0" "ethereum-waffle@^3.0.0" "chai@^4.2.0" "@nomiclabs/hardhat-ethers@^2.0.0" "ethers@^5.0.0"

4. Delete sample contract and js file in contracts, scripts, test folder

5. install upgradable packages: https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades#install

6. install openzeppelin upgradable contracts package: npm install --save-dev @openzeppelin/contracts-upgradeable@4.3.2

7. add binance smart chain testnet (bsctest) network and account to hardhat.config.js, account is your private key in binance smartchain testnet, better to save it in environment variable.

```
networks: {
    hardhat: {},
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
```

8. run `npx hardhat run scripts/deploy_vote.js --network bsctest` to deploy first instance of VoteUpgradaeble contract
   Note: save contract address for later upgrade

9. edit VoteUpgradable.sol (add state variable, function) and then upgrade it by run `npx hardhat run script/upgrade_vote.js --network bsctest`
