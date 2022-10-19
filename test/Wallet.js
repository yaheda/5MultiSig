// const { assert } = require("console");
const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
//const { web3 } = require('@openzeppelin/test-helpers/src/setup');

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
    var receipt = await wallet.createTransfers(accounts[4], 100, { from: accounts[0]});
    expectEvent(receipt, 'TransferCreated', {
      _from: accounts[0],
      _to: accounts[4],
      _amount: new BN(100)
    });
    const transfers = await wallet.getTransfers();
    assert(transfers.length, 1, 'has a transfer');
    var theTransfer = transfers[0];
    assert(theTransfer.amount, 100, 'should be 100');
    assert(theTransfer.to, accounts[4], 'should be accounts 4');
    assert(theTransfer.approvals == 0, 'should be 0');
    assert.equal(theTransfer.sent, false, 'should be sent');

  });

  it('should not create transfers', async () => {
    await expectRevert (
      wallet.createTransfers(accounts[4], 100, { from: accounts[5]}),
      'only approvers'
    );
  });

  it.only('should increment approval', async () => {
    await wallet.createTransfers(accounts[5], 100, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[0]});

    const isApproved = await wallet.getApprovals(0, { from: accounts[0]});
    assert(isApproved == true, "should be approved");

    const transfers = await wallet.getTransfers();
    var theTransfer = transfers[0];
    assert(theTransfer.approvals == 1, 'should be 1');
    assert.equal(theTransfer.sent, false, 'should be sent');

    const balance = await web3.eth.getBalance(wallet.address);
    assert(balance == '1000');
  });

  it('should send transfer if uorum reached', async () => {
    var balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
    await wallet.createTransfers(accounts[6], 100, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[1]});

    var balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));

    assert(balanceAfter.sub(balanceBefore).toNumber() == 100);

  });

  it('unhappy approve - only approvers', async () => {
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[6]}),
      'only approvers'
    );

  });

  it('unhappy approve - cannot approve twice', async () => {
    await wallet.createTransfers(accounts[6], 100, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[1]});
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[1]}),
      'transfer has already been sent'
    );
  });

  it('unhappy approve - transfer has already been sent', async () => {
    await wallet.createTransfers(accounts[6], 100, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[0]});
    await wallet.approveTransfer(0, { from: accounts[1]});
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[2]}),
      'transfer has already been sent'
    );
  });


});