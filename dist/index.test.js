"use strict";

// lib/index.test.mjs
var import_tap = require("tap");

// lib/index.mjs
var import_crypto = require("crypto");
var DEFAULT_ALGORITHM = "aes-256-ctr";
function encrypt(value, key, algorithm) {
  const keyHash = (0, import_crypto.createHash)("md5").update(key).digest("hex");
  const iv = (0, import_crypto.randomBytes)(18).toString("base64").substr(0, 16);
  algorithm = algorithm || DEFAULT_ALGORITHM;
  const cipher = (0, import_crypto.createCipheriv)(algorithm, keyHash, iv);
  let encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return ["xcrypt", algorithm, iv, encrypted.toString("base64")].join(":");
}
function decrypt(value, key) {
  const ctx = value.split(":");
  if (ctx.length !== 4) {
    throw new Error("Invalid encrypted format");
  }
  const [cryptor, algorithm, iv, content] = ctx;
  const keyHash = (0, import_crypto.createHash)("md5").update(key).digest("hex");
  const cipher = (0, import_crypto.createDecipheriv)(algorithm, keyHash, iv);
  let decrypted = cipher.update(content, "base64", "utf8");
  decrypted += cipher.final("utf8");
  return decrypted;
}

// lib/index.test.mjs
(0, import_tap.test)("Xcrypt", function(t) {
  t.test("basic functionality", function(t2) {
    let secretKey = "SECRET_KEY";
    let algorithm = "aes-256-ctr";
    let unencryptedValue = "hello cruel world!";
    t2.test("Encrypt", function(t3) {
      let encryptedValue = encrypt(unencryptedValue, secretKey, algorithm);
      let decryptedValue = decrypt(encryptedValue, secretKey);
      t3.ok(encryptedValue);
      t3.equal(unencryptedValue, decryptedValue);
      t3.end();
    });
    t2.test("Encrypt without version", function(t3) {
      let encryptedValue = encrypt(unencryptedValue, secretKey, algorithm);
      let decryptedValue = decrypt(encryptedValue, secretKey);
      t3.equal(unencryptedValue, decryptedValue);
      t3.end();
    });
    t2.test("Encrypt without algorithm", function(t3) {
      try {
        encrypt(unencryptedValue, secretKey);
        t3.pass("should use default algorithm");
      } catch (err) {
        t3.fail("should use default algorithm");
      }
      t3.end();
    });
    t2.end();
  });
  t.test("invalid encrypted format", function(t2) {
    let secretKey = "SECRET_KEY";
    let encryptedValue = "::";
    let result;
    try {
      result = decrypt(encryptedValue, secretKey);
      t2.fail("should throw error");
    } catch (err) {
      t2.ok(err);
      if (err instanceof Error) {
        t2.equal(err.message, "Invalid encrypted format");
        t2.pass("should throw error");
      } else {
        t2.fail("should throw error");
      }
    }
    t2.end();
  });
  t.test("unknown cipher", function(t2) {
    let secretKey = "SECRET_KEY";
    let encryptedValue = ":::";
    let result;
    try {
      result = decrypt(encryptedValue, secretKey);
      t2.fail("should throw error");
    } catch (err) {
      t2.ok(err);
      t2.hasProp(err, "message");
      if (err instanceof Error) {
        t2.equal(err.message, "Unknown cipher");
        t2.pass("should throw error");
      } else {
        t2.fail("should throw error");
      }
    }
    t2.end();
  });
  t.end();
});
