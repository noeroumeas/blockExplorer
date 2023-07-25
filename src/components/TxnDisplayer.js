import './TxnDisplayer.css';
function TxnDisplayer({txn, handleSearchButtonClick}) {
  if(!txn) 
    return ('');
  return (
    <div className="TxnDisplayer">
      <table>
        <tbody>
          <tr>
            <th>Transaction Hash:</th>
            <td>{txn.transactionHash}</td>
          </tr>
          {txn.byzantium && <tr>
            <th>Status:</th>
            <td>{txn.status ? 'Success' : 'Failed'}</td>
          </tr>}
          <tr>
            <th>Block Number:</th>
            <td>{txn.blockNumber} ({txn.confirmations} confirmations since)</td>
          </tr>
          <tr>
            <th>From:</th>
            <td>
                <button className="buttonDisplayHash" onClick={() => handleSearchButtonClick(txn.from)}>{txn.from}</button>
            </td>
          </tr>
          <tr>
            <th>To:</th>
            <td>
                <button className="buttonDisplayHash" onClick={() => handleSearchButtonClick(txn.to)}>{txn.to}</button>
            </td>
          </tr>
          <tr>
            <th>Cumulative Gas Used:</th>
            <td>{txn.cumulativeGasUsed.toString()} Wei</td>
          </tr>
          <tr>
            <th>Effective Gas Price:</th>
            <td>{txn.effectiveGasPrice.toString()} Wei</td>
          </tr>
          <tr>
            <th>Gas Used:</th>
            <td>{txn.gasUsed.toString()} Wei</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TxnDisplayer;
