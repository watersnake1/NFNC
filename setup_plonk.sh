snarkjs powersoftau new bn128 18 ceremony/pot18p_0000.ptau -v
snarkjs powersoftau contribute ceremony/pot18p_0000.ptau ceremony/pot18p_0001.ptau --name="Contribution" -v
snarkjs powersoftau contribute ceremony/pot18p_0001.ptau ceremony/pot18p_0002.ptau --name="Second contribution" -v -e="milady milady"
snarkjs powersoftau verify ceremony/pot18p_0003.ptau
snarkjs powersoftau beacon ceremony/pot18p_0003.ptau ceremony/pot18p_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
snarkjs powersoftau prepare phase2 pot18p_beacon.ptau pot18p_final.ptau -v

