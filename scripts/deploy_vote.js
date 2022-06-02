const { ethers, upgrades } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const null_addr = "0x0000000000000000000000000000000000000000";
  // We get the contract to deploy
  const Vote = await ethers.getContractFactory("VoteUpgradable");
  const vote = await upgrades.deployProxy(Vote, [null_addr]);
  console.log("vote deploy to: ", vote.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
