# NO FACE NO CASE

## Purpose
NFNC is a zero knowledge based approach to proving ownership of a particular NFT in one's wallet. The idea is to enable a user to prove they own an NFT without disclosing which wallet of all wallets that posess the NFT is theirs. In the future, this can be generalized both to ERC-20 tokens and also to multiple collections of NFTs at once, so as to create a greater degree of privacy. 

## Design
The system is dependent on two primary components; the signer and the prover. The signer is a node js script that uses the alchemy SDK to check a user wallet against all wallets that contain the specified NFT. If the wallet who's private key you have provided does contain the NFT in question, then the script will generate a signed message from that wallet attesting to this and write this to a file format that is acceptable to the SNARK proving system.\

The prover is a standard circom library for SHA-256. I make use of the Circom abstraction language/layer and Snark-js in order to create a provable SNARK inside of the user's local environment. The signed message is hashed and a SNARK proof generated, which allows the prover to demonstrate to others that they know the preimage (the signed message, which is unique to their wallet) that is represented by the hash digest which is made public. This proof can either be verified locally using the trusted ceremony conducted by the compiler script, or it can be verified onchain if one deploys the output solidity contract and invokes 'snarkjs generatecall' and sends this transaction onchain. 

## Use
To use, you will first need to install nodejs, npm, circom, snarkjs, web3 (npm package), alchemy-sdk (npm), request (npm) and dotenv (npm). 

Create a new project on alchemy and save your API key. This is needed during configuration.

Then, some environment variables need to be configured. Create a file in the root of this repo called `.env` and add the following:

```
APIKEY={alchemy_api_key}
USER_ADDR={ETH_ADDRESS}
CONTRACT_ADDR={NFT_CONTRACT_ADDRESS}
PK={PRIVATE_KEY}
PROVIDER={ALCHEMY_RPC_URL}
```

Once this is all done, you can run the system by executing `node getAddr.js`. This will check your address against the list of holders of the NFT contract you specififed, and if you do have one or more of the collection, generate a signed message. The signed message will be written to a file called `input_data_0.json` as an array of integers that represents the ascii code of each letter in the signature. This is the preimage input to the hash ciruit. 

Now, run `chmod +x compile.sh && ./compile` and wait for the circuit to initialize. You will be prompted twice to give entropy input. The entire process should take ~20-30 minutes on a fast laptop. The result of this process will be two files, `proof.json` and `public.json` that contain the proof and public inputs (hash digest in binary) that are required to prove your ownership while revealing nothing private. To verify locally run `snarkjs groth16 verify verification_key.json public.json proof.json`.

## Future work
* Allow for multiple NFT collection verification at once
* Multiple address verification at once
* Automatically deploy smart contracts for verification
* Integrate metamask and remove the need for providing a private key
* Tweak the power of tau to a more reasonable size
* Generalize the system
* Build a frontend

## WARNING
This is EXPERIMENTAL software made by someone who is NOT a professional cryptographer. Use at your own risk. DO NOT use your real wallets in this program for now. I recommend https://github.com/watersnake1/AddressPy for quickly generating throwaway wallets. Also, your computer's speed will greatly effect UX. 
