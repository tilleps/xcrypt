"use strict";

const crypto = require("crypto");

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;


function encrypt(value, key, algorithm, version) {
  const keyHash = crypto.createHash("md5").update(key).digest("hex");
  const iv = crypto.randomBytes(18).toString("base64").substr(0, 16);
  
  const cipher = crypto.createCipheriv(algorithm, keyHash, iv);

  let encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);

  //  @todo Add support for authTag
  //console.log("AuthTag", cipher.getAuthTag().toString("hex"));

  return ["xcrypt", version, algorithm, iv, encrypted.toString("base64")].join(":");
}


function decrypt(value, key) {
  const ctx = value.split(":");

  //  Check if value is encrypted format
  if (ctx.length !== 5) {
    console.error("Invalid encrypted format");
    process.exit(1);
    return;
  }

  const cryptor = ctx[0];
  const version = ctx[1];
  const algorithm = ctx[2];
  const iv = ctx[3];
  const content = ctx[4];

  const keyHash = crypto.createHash("md5").update(key).digest("hex");
  const cipher = crypto.createDecipheriv(algorithm, keyHash, iv);

  let decrypted = cipher.update(content, "base64", "utf8");
  decrypted += cipher.final("utf8");

  return decrypted;
}
