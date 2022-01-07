const web3 = require("@solana/web3.js")

const userWallet = web3.Keypair.generate()
//console.log(userWallet)

const userPublicKey = new web3.PublicKey(userWallet._keypair.publicKey).toString();
const userSecretKey = userWallet._keypair.secretKey

const treasuryWallet = web3.Keypair.generate()
const treasuryPublicKey = new web3.PublicKey(treasuryWallet._keypair.publicKey).toString();
const treasurySecretKey = treasuryWallet._keypair.secretKey

module.exports = {
    userPublicKey,
    userSecretKey,
    treasuryPublicKey,
    treasurySecretKey

}