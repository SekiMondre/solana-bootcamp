import { Keypair } from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const keypair = Keypair.generate();

console.log(`Pub key: `, keypair.publicKey.toBase58());
console.log(`Prv key: `, keypair.secretKey);
console.log(`✅ Generated keypair!`);

const envKeypair = getKeypairFromEnvironment("PRIVATE_KEY");

console.log(`Env key pub: `, envKeypair.publicKey.toBase58());
console.log(`Env key prv: `, envKeypair.secretKey);