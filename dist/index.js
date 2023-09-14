"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.mjs
var lib_exports = {};
__export(lib_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt
});
module.exports = __toCommonJS(lib_exports);
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
  if (typeof value !== "string") {
    throw new TypeError("Encrypted value must be a string");
  }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decrypt,
  encrypt
});
