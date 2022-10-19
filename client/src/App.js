
//import './App.css';

import React, {useEffect,useState} from 'react';
import { getWeb3, getWallet } from './utils.js';
import Header from './header.js';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);

  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  // componentdidmoutn
  useEffect(() => {
    const init = async() => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);

      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();

      var modifiedTransfers = await Promise.all(
        transfers.map(async (transfer, index) => {
          var isApproved = await wallet.methods
            .getApprovals(index)
            .call({ from: accounts[0]} );
  
          return {
            ...transfer,
            isApproved
          }
        })
      );

      // var modifiedTransfers = transfers.map(async (transfer, index) => {
      //   var isApproved = await wallet.methods
      //     .getApprovals(index)
      //     .call({ from: accounts[0]} );

      //   return {
      //     ...transfer,
      //     isApproved
      //   }
      // });
      
      debugger;

      

      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);

      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(modifiedTransfers);

      await listenForEvents();
    };

    init();
    
  }, []);

  const listenForEvents = async () => {
    const web3 = await getWeb3();
    const wallet = await getWallet(web3);

    let options = {
      filter: {
          value: [],
      },
      fromBlock: 0
  };

    console.log('BEGIN listenForEvents');
    wallet.events.TransferCreated(options)
    .on('data', event => { console.log("on('data'");console.log(event)})
    .on('changed', changed => { console.log("on('changed'"); console.log(changed);})
    .on('error', err => { console.log("on('error'");console.log(err)})
    .on('connected', str => { console.log("on('connected'");console.log(str)})
  }

  const createTransfer = async (transfer) => {
    await wallet.methods.createTransfers(
      transfer.to,
      transfer.amount
    ).send({ from: accounts[0]});
  }

  const approveTransfer = async (id) => {
    await wallet.methods.approveTransfer(id)
    .send({ from: accounts[0]});
  }

  if (
    typeof web3 === 'undefined' ||
    typeof accounts === 'undefined' ||
    typeof wallet === 'undefined' ||
    typeof quorum  === 'undefined' ||
    approvers.length == 0) {
      return <div>Loading...</div>;
  }

  return (
    <div className="App">
      MultiSig Dapp
      <Header approvers={approvers} quorum={quorum} />
      <NewTransfer createTransfer={createTransfer} />
      <TransferList transfers={transfers} approveTransfer={approveTransfer} />
    </div>
  );
}

export default App;
