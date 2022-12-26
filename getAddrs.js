const request = require('request');
const { Network, Alchemy } = require('alchemy-sdk');
const checkAddr = process.argv[2];
const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();
console.log(checkAddr);

var web3 = new Web3(process.env.PROVIDER);

const config = {
    apiKey: process.env.APIKEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

async function getHoldersAddrs(contract) {
  return await alchemy.nft.getOwnersForContract(contract);
}

async function isAddressNFTHolder(address, contract) {
  owners = await getHoldersAddrs(contract);
  if (owners['owners'].includes(address)) {
    return true;
  }
  return false;
}

async function signMessage(address, contract, privateKey) {
  const msg = "Address " + address + " owns >1 " + contract;
  sigObj= web3.eth.accounts.sign(msg, privateKey);
  console.log(sigObj.signature);
  return sigObj.signature;
}

const main = async () => {
  const milady = process.env.CONTRACT_ADDR;
  const addr = process.env.USER_ADDR.toLowerCase();
  const privateKey = process.env.PK;

  owner = await isAddressNFTHolder(addr, milady)
  if (owner) {
    sig = await signMessage(addr, milady, privateKey);
    var sig_list = [...sig];
    for (let i = 0; i < sig_list.length; i++) {
      sig_list[i] = sig_list[i].charCodeAt(); //toString()
    }  
    console.log("generated a hash input " + sig_list.length + " characters long / " + sig_list.length/4 + " in bit length")
    var input_file_json = {"in": sig_list}
    let input_data = JSON.stringify(input_file_json);

    fs.writeFileSync('input_data_0.json', input_data);
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
