import web3 from "@solana/web3.js";
// import { 
//     Connection,
//     clusterApiUrl,
//     Keypair,
//     Transaction,
//     PublicKey,
// } from "@solana/web3.js";

import { PING_PROGRAM_ADDRESS, PING_PROGRAM_DATA_ADDRESS } from "./index.ts";

import "dotenv/config";
import base58 from "bs58";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const payer = getKeypairFromEnvironment('SECRET_KEY');
const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
// const connection = new Connection(clusterApiUrl('devnet'));

await sendPingTransaction(connection, payer);

async function sendPingTransaction(connection: web3.Connection, payer: web3.Keypair) {
    console.log(`Sending ping transaction...`);

    const transaction = new web3.Transaction();
    const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
    const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

    const instruction = new web3.TransactionInstruction({
        keys: [
            {
                pubkey: pingProgramDataId,
                isSigner: false,
                isWritable: true
            },
        ],
        programId
    });

    transaction.add(instruction);

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    );
    console.log(`✅ Transaction completed! Signature: ${signature}`)
}