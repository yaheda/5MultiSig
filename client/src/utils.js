import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';
import detectEthereumProvider from '@metamask/detect-provider'

const getWeb3 = () => {
  //return new Web3('http://localhost:7545');
  return new Promise(async (resolve, reject) => {
    //window.addEventListener('load', async() => {
      // if (window.ethereum) {
      //   const web3 = new Web3(window.etherium);
      //   try {
      //     await window.ethereum.enable();
      //     resolve(web3)
      //   } catch (error) {
      //     reject(error)
      //   }
      // } else if (window.web3) {
      //   resolve(window.web3);
      // } else {
      //   reject('Must install Metamask');
      // }
    //});

    let provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });

      try {
        const web3 = new Web3(window.ethereum);
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }

    reject('Must install Metamask');
    
  });
};

const getWallet = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Wallet.networks[networkId];

  return new web3.eth.Contract(
    Wallet.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export { getWeb3, getWallet };