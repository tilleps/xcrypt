#!/usr/bin/env node

import { encrypt, decrypt } from "xcrypt";
import yargs from "yargs";


//  https://github.com/yargs/yargs/blob/master/docs/api.md


/**
 * @type {import("yargs").Arguments}
 */
const opts = await yargs
  .usage("Usage: $0")
  .help("help")
  .option("secret", {
    demandOption: true,
    alias: "s",
    describe: "The secret key used to encrypt/decrypt"
  })
  .option("decrypt", {
    alias: "d",
    boolean: true,
    describe: "Set mode to decrypt"
  })  
  .option("list-algorithms", {
    alias: "l",
    boolean: true,
    describe: "List the supported algorithms"
  })
  .option("algorithm", {
    alias: "a",
    default: "aes-256-ctr",
    describe: "Set the cipher algorithm used to encrypt"
  })
  .argv;


function getPipedData() {
  return new Promise(function(resolve, reject) {
    var data  = "";

    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", function(chunk) {
      data += chunk;
    });

    process.stdin.on("end", function() {
      resolve(data);
    });
    
    process.stdin.on("error", function() {
      reject();
    });
  });
}


(async function main() {
  const mode = opts.decrypt ? "decrypt" : "encrypt";
  const secretKey = opts.secret;

  let algorithm = opts.algorithm;
  
  //  @todo check for valid algorithm
  
  //
  //  Get the data to crypt
  //
  let data = "";
  if (opts._.length === 0) {
    //  Get piped data
    data = await getPipedData();
  }
  else {
    //  Get the remainding arguments
    data = opts._.join(" ");
  }
  
  switch (mode) {
    case "encrypt":
      const encrypted = encrypt(data, secretKey, algorithm);
      process.stdout.write(encrypted);
      break;
      
    case "decrypt":
      const decrypted = decrypt(data, secretKey);
      process.stdout.write(decrypted);
      break;
      
    default:
      console.error(`Unsupported mode: ${mode}`);
      process.exit(1);
      break;
  }
}());
