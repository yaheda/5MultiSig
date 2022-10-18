import React, { useState } from 'react';

function NewTransfer({createTransfer}) {
  const [transfer, setTransfer] = useState();

  const updateTransfer = (e, field) => {
    var value = e.target.value;
    setTransfer({...transfer, [field]: value});
  };

  const submit = (e) => {
    e.preventDefault();

    createTransfer(transfer);
  };

  return (
    <div>
      <h2>Create Transfer</h2>
      <form onSubmit={(e) => submit(e)}>
        <label>Amount</label>
        <input id="amout" type="text"
          onChange={e => updateTransfer(e, 'amount')}
         />
        <label>To</label>
        <input id="to" type="text"
          onChange={e => updateTransfer(e, 'to')}
         />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default NewTransfer;