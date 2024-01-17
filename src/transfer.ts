import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const destKeyString = process.argv[2] || null;
if (!destKeyString) {
    console.log(`Please provide a public key to send to.`);
    process.exit(1);
}
console.log(`Destination pub key: ${destKeyString}`);

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
const toPubKey = new PublicKey(destKeyString);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(`Connected to solana devnet`);

// Transaction
const transaction = new Transaction();

const LAMPORTS_TO_SEND = 5000;

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: toPubKey,
    lamports: LAMPORTS_TO_SEND,
});
transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

const sol = LAMPORTS_TO_SEND / LAMPORTS_PER_SOL;
console.log(`Sent ${sol} SOL to address ${toPubKey}`);
console.log(`Transaction signature: ${signature}`);

// "burn" address: BgPWg4mkVGJWhn7AL6P599fLYYtXLGCsrHWekftiGYLz