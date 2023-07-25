import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import BlockDisplayer from './components/BlockDisplayer';
import TxnDisplayer from './components/TxnDisplayer';
import AddressDisplayer from './components/AddressDisplayer';
import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState({
    "id": 0,
    "result": null,
  });

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });
  
  async function handleSearchButtonClick(searchedValue) {
    try{
      let result;
      let id;
      if(!searchedValue)
        throw new Error("Incorrect input");
      if(searchedValue.startsWith("0x")) {
        if(searchedValue.length === 42) {
          // search by address
          const address = searchedValue;
          window.text = alchemy.core;
          let contractDeployer;
          try{
            contractDeployer = await alchemy.core.findContractDeployer(address);
          } catch(error) {
            contractDeployer = null;
          }
          const balanceWei = await alchemy.core.getBalance(address);
          const balance = Utils.formatEther(balanceWei);
          const erc20TokenBalancesRaw = await alchemy.core.getTokenBalances(address);
          const erc20TokenBalances = [];
          const tokenBalancesRaw = erc20TokenBalancesRaw.tokenBalances;
          for(let i = 0; i < tokenBalancesRaw.length; i++) {
            if(tokenBalancesRaw[i].tokenBalance !== 0) {
              const tokenMetadata = await alchemy.core.getTokenMetadata(tokenBalancesRaw[i].contractAddress);
              erc20TokenBalances.push({
                "address": tokenBalancesRaw[i].contractAddress,
                "name": tokenMetadata.name,
                "symbol": tokenMetadata.symbol,
                "logo": tokenMetadata.logo,
                "balance": Utils.formatUnits(tokenBalancesRaw[i].tokenBalance, tokenMetadata.decimals),
              });
            }
          }

          result = {address, balance, erc20TokenBalances, contractDeployer};
          id = 1;
        } else if(searchedValue.length === 66) {
          // search by block hash
          result = await alchemy.core.getBlockWithTransactions(searchedValue);
          //if not found, search by txn hash
          if(!result){
            result = await alchemy.core.getTransactionReceipt(searchedValue);
            id = 3;
          } else {
            id = 2;
          }
        } 
      } else if(Number.isInteger(Number(searchedValue))) {
        // search by block number
        result = await alchemy.core.getBlockWithTransactions(Number(searchedValue));
        id = 2;
      } else {
        throw new Error("Incorrect input");
      }
      if(!result)
        throw new Error("Incorrect input");
      setSearchResult({
        id,
        result
      });
    } catch(error) {
      // console.log(error);
      setSearchResult({
        id: -1,
        result: "Incorrect input"
      });
    }
  }

  function displaySearchResult(){
    if(searchResult.id === 1) {
      return (<AddressDisplayer address={searchResult.result} handleSearchButtonClick={handleSearchButtonClick}/>);
    } else if(searchResult.id === 2) {
      return (<BlockDisplayer block={searchResult.result} handleSearchButtonClick={handleSearchButtonClick}/>);
    } else if(searchResult.id === 3) {
      return (<TxnDisplayer txn={searchResult.result} handleSearchButtonClick={handleSearchButtonClick}/>);
    } else if(searchResult.id === -1) {
      return (
        <div>
          <p>{searchResult.result}</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>Search result will be displayed here</p>
        </div>
      );
    }
  }
  return (
    <div className="App">
      <h2>Current Block Number: {blockNumber}</h2>
      <input type="text" placeholder="Search by Address / Txn Hash / Block" value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={() => handleSearchButtonClick(search)}>Search</button>
      <div className="searchResult">
        {displaySearchResult()}
      </div>
    </div>
  );
}

export default App;
