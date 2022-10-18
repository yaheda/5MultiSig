
import './App.css';

import React, {useEffect,useState} from 'react';
import { getWeb3, getWallet } from './utils.js';
import Header from './header.js';
import NewTransfer from './NewTransfer.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);

  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);

  // componentdidmoutn
  useEffect(() => {
    const init = async() => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);

      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();

      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);

      setApprovers(approvers);
      setQuorum(quorum);
    };

    init();
  }, []);

  const createTransfer = async (transfer) => {
    await wallet.methods.createTransfers(
      transfer.to,
      transfer.amount
    ).send({ from: accounts[0]});
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
    </div>
  );
}

export default App;
