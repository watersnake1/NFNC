circom check.circom --r1cs --wasm --sym --c
node check_js/generate_witness.js check_js/check.wasm input.json witness.wtns
snarkjs powersoftau new bn128 18 pot18_0000.ptau -v
snarkjs powersoftau contribute pot18_0000.ptau pot18_0001.ptau --name="Initial contribution (milady)" -v
snarkjs powersoftau prepare phase2 pot18_0001.ptau pot18_final.ptau -v
snarkjs groth16 setup check.r1cs pot18_final.ptau check_0000.zkey
snarkjs zkey contribute check_0000.zkey check_0001.zkey --name="Milady" -v
snarkjs zkey export verificationkey check_0001.zkey verification_key.json
snarkjs groth16 prove check_0001.zkey witness.wtns proof.json public.json
