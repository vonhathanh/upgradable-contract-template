//https://ethereum-waffle.readthedocs.io/en/latest/getting-started.html
const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const { time } = require("@openzeppelin/test-helpers");

const provider = waffle.provider;

async function increaseTime(duration) {
  await provider.send("evm_increaseTime", [duration]);
  await provider.send("evm_mine");
}

describe("EtherStore", function () {
  const [minter, alice, bob, dev] = provider.getWallets();

  let store;

  beforeEach(async () => {
    const EtherStore = await ethers.getContractFactory("EtherStore");

    store = await EtherStore.deploy();

    await store.deployed();
  });

  it("Should increase balance after deposit", async function () {
    await store.depositFunds({ value: 5000 });

    let balanceUser = await store.balances(minter.address);

    expect(balanceUser).to.eq(5000);

    let storeBalance = await provider.getBalance(store.address);

    expect(storeBalance).to.eq(5000);
  });

  it("Should decrease balance after withdraw", async function () {
    await store.depositFunds({ value: 5000 });

    await store.withdrawFunds(1000);

    await increaseTime(24 * 7 * 86400);

    await store.withdrawFunds(1000);

    let balanceUser = await store.balances(minter.address);

    expect(balanceUser).to.eq(3000);

    let storeBalance = await provider.getBalance(store.address);

    expect(storeBalance).to.eq(3000);
  });

  it("Should revert if withdraw too soon", async function () {
    await store.depositFunds({ value: 5000 });
    await store.withdrawFunds(1000);
    await expect(store.withdrawFunds(1000)).to.be.revertedWith("withdraw too early");
  });

  it("Test withdraw edge cases", async function () {
    await store.depositFunds({ value: 5000 });
    await store.withdrawFunds(0);
    await increaseTime(24 * 7 * 86400);
    await store.withdrawFunds(5000);
    let balanceUser = await store.balances(minter.address);
    expect(balanceUser).to.eq(0);
  });

  it("Test deposit by two users", async function () {
    await store.depositFunds({ value: 5000 });
    await store.connect(alice).depositFunds({ value: 10000 });

    let balanceUser = await store.balances(minter.address);
    expect(balanceUser).to.eq(5000);

    balanceUser = await store.balances(alice.address);
    expect(balanceUser).to.eq(10000);
  });

  it("Test reentrancy attack", async function () {
    const EtherStoreAttack = await ethers.getContractFactory("EtherStoreAttack");

    etherStoreAttack = await EtherStoreAttack.deploy(store.address);

    await etherStoreAttack.deployed();

    await store.depositFunds({ value: "3000000000000000000" });

    await etherStoreAttack.attack({ value: "1000000000000000000" });

    let balanceAttacker = await await provider.getBalance(etherStoreAttack.address);
    expect(balanceAttacker).to.eq("4000000000000000000");
    console.log(balanceAttacker.toString());
  });
});
