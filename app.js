const express = require('express')
//const nfnc = require('./nfnc.js')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './html' })
})

app.post('/submitted-data', (req, res) => {
  var walletAddress = req.body.wallet
  var contractAddress = req.body.contract
  var pkey = req.body.privkey

  const { proof, vKey, publicSignals } = await nfnc.generateProof(walletAddress, contractAddress, pkey)
  // stringify these results and send them back to the user
  res.send('success!')
})

app.get('/verify', (req, res) => {
  res.sendFile('verify.html', {root: './html'} )
});

app.post('/submit-verify', (req, res) => {
  var proof = req.body.proof
  var publicSignal = req.body.publicsignal
  var vKey = req.body.vkey

  const verificationResult = await nfnc.verify(proof, vKey, publicSignal)
  res.send(verificationResult)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
