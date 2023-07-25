import { useState, useEffect } from 'react';
import './BlockDisplayer.css';
function BlockDisplayer({block, handleSearchButtonClick}) {
  const [displayTxns, setDisplayTxns] = useState(false);
  
  useEffect(() => {
    setDisplayTxns(false);
  }, [block]);

  if(!block) 
    return ('');

  return (
    <div className="BlockDisplayer">
      <table>
        <tbody>
          <tr>
            <th>Block Height:</th>
            <td>{block.number}</td>
          </tr>
          <tr>
            <th>Timestamp:</th>
            <td>{block.timestamp}</td>
          </tr>
          <tr>
            <th>Transactions:</th>
            <td>
              <p>{block.transactions.length} transactions found</p>
              {displayTxns && block.transactions.length ? block.transactions.map(txn => {
                return (
                  <div className="tx">
                    <button className="buttonDisplayHash" onClick={() => handleSearchButtonClick(txn.hash)}>{txn.hash}</button>
                  </div>
                );
              }) : ''}
              {block.transactions.length > 0 && <button onClick={() => setDisplayTxns(!displayTxns)}>{displayTxns ? 'Hide' : 'Display'} Transactions</button>}
            </td>
          </tr>
          <tr>
            <th>Block Hash:</th>
            <td>{block.hash}</td>
          </tr>
          <tr>
            <th>Previous block Hash:</th>
            <td>
              <button className="buttonDisplayHash" onClick={() => handleSearchButtonClick(block.parentHash)}>{block.parentHash}</button>
            </td>
          </tr>
          <tr>
            <th>Difficulty:</th>
            <td>{block.difficulty.toString()}</td>
          </tr>
          {block.baseFeePerGas && <tr>
            <th>Base Fee per Gas:</th>
            <td>{block.baseFeePerGas.toString()} Wei</td>
          </tr>}
          <tr>
            <th>Gas Limit:</th>
            <td>{block.gasLimit.toString()} Wei</td>
          </tr>
          <tr>
            <th>Gas Used:</th>
            <td>{block.gasUsed.toString()} Wei</td>
          </tr>
          <tr>
            <th>Extra Data:</th>
            <td>{block.extraData.toString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BlockDisplayer;
