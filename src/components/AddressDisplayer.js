import './AddressDisplayer.css';
function AddressDisplayer({address, handleSearchButtonClick}) {
  const isContract = address.contractDeployer !== null;
  
  return (
    <div className="AddressDisplayer">
      <h2>{isContract ? 'Contract' : 'Wallet'}</h2>
      <table>
        <tbody>
          <tr>
            <th>Address:</th>
            <td>{address.address}</td>
          </tr>
          <tr>
            <th>Balance:</th>
            <td>{address.balance} MATIC</td>
          </tr>
          <tr>
            <th> ERC-20 Token Balances:</th>
            <td>
              <table>
                <tbody>
                  {address.erc20TokenBalances.map((token) => (
                    <tr className="erc20Token" onClick={() => handleSearchButtonClick(token.address)}>
                      <th><img className="erc20Logo" src={token.logo || 'https://polygonscan.com/images/main/empty-token.png'} alt={token.name}/> {token.name.slice(0,6)}</th>
                      <td>{token.balance.slice(0,12)} {token.symbol.slice(0,6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          {isContract && 
          <tr>
            <th>Deployer:</th>
            <td>{address.contractDeployer.deployerAddress || 'unknown'} at block {address.contractDeployer.blockNumber}</td>
          </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export default AddressDisplayer;
