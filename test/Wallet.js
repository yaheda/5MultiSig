// const { assert } = require("console");

const Wallet = artifacts.require("Wallet.sol");

contract('Wallet', async (accounts) => {

  let wallet;

  beforeEach(async () => {
    wallet = await Wallet.new([accounts[0],accounts[1],accounts[2]], 2);
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: wallet.address,
      value: 1000
    });
  });

  it('should have correct approvers and quorum', async () => {
    const approvers = await wallet.getApprovers();
    const quorum = (await wallet.quorum()).toNumber();

    assert(approvers.length == 3);
    assert(approvers[0] == accounts[0]);
    assert(approvers[1] == accounts[1]);
    assert(approvers[2] == accounts[2]);
    assert(quorum == 2);

  });

  it('test create transfer', async () => {
    await wallet.createTransfers(accounts[4], 100, { from: accounts[0]});
    const transfers = await wallet.getTransfers();
    assert(transfers.length, 1, 'has a transfer');
    var theTransfer = transfers[0];
    assert(theTransfer.amount, 100, 'should be 100');
    assert(theTransfer.to, accounts[4], 'should be accounts 4');
    assert(theTransfer.approvals == 0, 'should be 0');
    assert.equal(theTransfer.sent, false, 'should be sent');

  });
});