import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import web3 from "@solana/web3.js";

const PROGRAM_ID = "FPbwbLDPX9UhwMje9Kbs62xEcfVpZrZYBvWTxAdLfCHa"; // localhost

// const API_URL = "https://api.devnet.solana.com";
const API_URL = "http://localhost:8899";

const connection = new web3.Connection(API_URL, "confirmed");

const keypair = getKeypairFromEnvironment("SECRET_KEY");
const publicKey = keypair.publicKey;

console.log(`Address: `, publicKey.toBase58());

const balanceInLamports = await connection.getBalance(publicKey);
const balance = balanceInLamports / web3.LAMPORTS_PER_SOL;

console.log(`Balance: ${balance} SOL`);

const transaction = new web3.Transaction();
transaction.add(
    new web3.TransactionInstruction({
        keys: [],
        programId: new web3.PublicKey(PROGRAM_ID),
    }),
);

console.log("Sending transaction...");
const txHash = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair],
);
console.log("Transaction sent with hash:", txHash);