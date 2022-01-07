const web3 = require("@solana/web3.js")
const keys = require("./keys")

const getwalletBalance = async (publicKey) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed")
        const walletBalance = await connection.getBalance(new web3.PublicKey(publicKey))
        return parseInt(walletBalance) / web3.LAMPORTS_PER_SOL
    } catch (error) {
        console.log(error)
    }
}

const airdropSolUser = async () => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed")
        userwallet = await web3.Keypair.fromSecretKey(keys.userSecretKey)
        const userAirdropSignature = await connection.requestAirdrop(
            new web3.PublicKey(userwallet.publicKey),
            2 * web3.LAMPORTS_PER_SOL
        )
        await connection.confirmTransaction(userAirdropSignature)


    } catch (error) {
        console.log(error)
    }
}

const airdropSolTreasury = async () => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed")
        treasurywallet = await web3.Keypair.fromSecretKey(keys.treasurySecretKey)
        const treasuryAirdropSignature = await connection.requestAirdrop(
            new web3.PublicKey(treasurywallet.publicKey),
            2 * web3.LAMPORTS_PER_SOL
        )
        await connection.confirmTransaction(treasuryAirdropSignature)
    } catch (error) {
        console.log(error)
    }
}

const transferSOL = async (from, to, transferAmt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(from.publicKey.toString()),
                toPubkey: new web3.PublicKey(to.publicKey.toString()),
                lamports: transferAmt * web3.LAMPORTS_PER_SOL
            })
        )
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getwalletBalance,
    airdropSolUser,
    transferSOL,
    airdropSolTreasury
}