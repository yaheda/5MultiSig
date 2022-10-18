const Wallet = artifacts.require("Wallet");

module.exports = async function(deployer, _network, accounts) {
  var approvers = [
    // '0xfb6bc19C426705b7eEc86f27774633300C48C87a',
    // '0x4552d6F570554481eCcfD034C759fF8693aB1445',
    // '0xd5cC7a5bb303c8C09f6CFbd42E6Be273035D3eb4',
    accounts[0],
    accounts[1],
    accounts[2]
  ]
  await deployer.deploy(Wallet, approvers, 2);
  var wallet = await Wallet.deployed();
  web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 10000 });
};
