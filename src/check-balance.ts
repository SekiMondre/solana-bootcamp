import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const pubKeyString = process.argv[2];
if (!pubKeyString) {
    throw new Error("No public key provided.");
}
const publicKey = new PublicKey(pubKeyString);

const isValidAddress = PublicKey.isOnCurve(publicKey.toBuffer());
if (!isValidAddress) {
    throw new Error("Invalid address.");
}

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);
const balance = balanceInLamports / LAMPORTS_PER_SOL;
console.log(`💰 The balance for the wallet at address ${publicKey} is ${balance}!`);

// pub key: 3ETCHQBZXGNEAohKp24huXU17WZE2C9qSedTow5HnzWg