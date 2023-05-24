import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";

const DEFAULT_ALGORITHM = "aes-256-ctr";


/**
 * @param {string} value
 * @param {string} key
 * @param {string} [algorithm]
 * @return {string}
 */
export function encrypt(value, key, algorithm) {
  const keyHash = createHash("md5").update(key).digest("hex");
  const iv = randomBytes(18).toString("base64").substr(0, 16);

  algorithm = algorithm || DEFAULT_ALGORITHM;
  
  const cipher = createCipheriv(algorithm, keyHash, iv);

  let encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);

  //  @todo Add support for authTag
  //console.log("AuthTag", cipher.getAuthTag().toString("hex"));

  return ["xcrypt", algorithm, iv, encrypted.toString("base64")].join(":");
}

/**
 * @param {string} value
 * @param {string} key
 * @throws {Error}
 * @return {string}
 */
export function decrypt(value, key) {
  const ctx = value.split(":");

  // @todo add support for legacy ctx.length === 5

  //  Check if value is encrypted format
  if (ctx.length !== 4) {
    //  @todo custom error
    throw new Error("Invalid encrypted format");
  }


  const [cryptor, algorithm, iv, content] = ctx;
  const keyHash = createHash("md5").update(key).digest("hex");
  const cipher = createDecipheriv(algorithm, keyHash, iv);

  let decrypted = cipher.update(content, "base64", "utf8");
  decrypted += cipher.final("utf8");

  return decrypted;
}



