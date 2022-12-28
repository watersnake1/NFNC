const Web3 = require('web3');
const http = require('http');
const addr = require('./getAddrs.js');
const snarkjs = require('snarkjs');
const fs = require('fs');
// for generating the witness
const wc  = require("./check_js/witness_calculator.js");
require('dotenv').config()

var web3 = new Web3(process.env.PROVIDER);

// methods need to be added to module.exports
//
//
function generateProof(address, contract, privateKey) {
  const msg = addr.signMessage(address, contract, privateKey);
  // eventually substitute for metamask sig
  // system call to create a new witness (import from get_addrs)
  const inputJson = createInputJson(msg);
  if (inputJson["in"].length < 1) {
    process.exit(1);
  }
  await generateWitness("check_js/check.wasm", "input_data_1.json");
  // system call to setup the circuit with plonk
  const { proof, publicSignals } = await snarkjs.plonk.fullProve(inputJson, "check_js/check.wasm", "check_0001.zkey");
  const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

  return { proof, vKey, publicSignals };
}

// generate a boolean answer to whether or not a proof is valid
async function verify(proof, vKey, publicSignals) {
  const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);
  console.log(res);
  return res;
}

async function createInputJson(sigMsg) {
  // turn the input message signature into a list of chars
  var sigList = [...sigMsg];
  // turn each char into its ascii code in ints
  for (let i = 0; i < sigList.length; i++) {
    sigList[i] = sig_list[i].charCodeAt();
  }  
  // setup the json struct to be written
  var input_file_json = {"in": sig_list}
  let input_data = JSON.stringify(input_file_json);
  // write the json to file
  const fileName = 'input_data_1.json'
  fs.writeFileSync(fileName, input_data);
  return input_file_json;
}

// generate the witness file from the provided script (adapted)
async function generateWitness(wasmFile, inputFile) {
  const input = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  wc(buffer).then(async witnessCalculator => {
    const buff= await witnessCalculator.calculateWTNSBin(input,0);
    // this needs to be a malleable val
    fs.writeFile("output.wtns", buff, function(err) {
      if (err) throw err;
    });
  });
}
