import React from 'react';
import { getWeb3, getWallet } from './utils.js';

function TransferList({transfers, approveTransfer}) {

  

  return(
    <div>
      <h2>Transfers</h2>
      <table>
        <thead>
          <th>Id</th>
          <th>Amount</th>
          <th>To</th>
          <th>Approvals</th>
          <th>Send</th>
        </thead>
        <tbody>
          {transfers.map((transfer, index) => {
            return (<tr  key={index}>
              <td>{index}</td>
              <td>{transfer.amount}</td>
              <td>{transfer.to}</td>
              <td>{transfer.approvals}</td>
              <td>{transfer.sent}</td>
              <td>
                {!transfer.isApproved && 
                  <button onClick={() => approveTransfer(index)}>Approve</button>
                }
                {transfer.isApproved && 
                  <button disabled="disabled">Approve</button>
                }
                
              </td>
            </tr>);
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransferList;