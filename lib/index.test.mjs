import { test } from "tap";
import { encrypt, decrypt } from "./index.mjs";

test("Xcrypt", function (t) {
  t.test("basic functionality", function (t) {
    let secretKey = "SECRET_KEY";
    let algorithm = "aes-256-ctr";
    let unencryptedValue = "hello cruel world!";

    t.test("Encrypt", function (t) {
      let encryptedValue = encrypt(unencryptedValue, secretKey, algorithm);
      let decryptedValue = decrypt(encryptedValue, secretKey);

      t.ok(encryptedValue);
      t.equal(unencryptedValue, decryptedValue);
      t.end();
    });

    t.test("Encrypt without version", function (t) {
      let encryptedValue = encrypt(unencryptedValue, secretKey, algorithm);
      let decryptedValue = decrypt(encryptedValue, secretKey);

      t.equal(unencryptedValue, decryptedValue);
      t.end();
    });

    t.test("Encrypt without algorithm", function (t) {
      try {
        encrypt(unencryptedValue, secretKey);
        t.pass("should use default algorithm");
      } catch (err) {
        t.fail("should use default algorithm");
      }

      t.end();
    });

    t.end();
  });

  t.test("invalid encrypted value type", function (t) {
    let secretKey = "SECRET_KEY";
    let encryptedValue = undefined;

    let result;

    try {
      result = decrypt(encryptedValue, secretKey);
      t.fail("should throw error");
    } catch (err) {
      t.ok(err);

      if (err instanceof TypeError) {
        t.equal(err.message, "Encrypted value must be a string");
        t.pass("should throw error");
      } else {
        t.fail("should throw error");
      }
    }

    t.end();
  });


  t.test("invalid encrypted format", function (t) {
    let secretKey = "SECRET_KEY";
    let encryptedValue = "::";

    let result;

    try {
      result = decrypt(encryptedValue, secretKey);
      t.fail("should throw error");
    } catch (err) {
      t.ok(err);

      if (err instanceof Error) {
        t.equal(err.message, "Invalid encrypted format");
        t.pass("should throw error");
      } else {
        t.fail("should throw error");
      }
    }

    t.end();
  });

  t.test("unknown cipher", function (t) {
    let secretKey = "SECRET_KEY";
    let encryptedValue = ":::";

    let result;

    try {
      result = decrypt(encryptedValue, secretKey);
      t.fail("should throw error");
    } catch (err) {
      t.ok(err);
      t.hasProp(err, "message");

      if (err instanceof Error) {
        t.equal(err.message, "Unknown cipher");
        t.pass("should throw error");
      } else {
        t.fail("should throw error");
      }
    }

    t.end();
  });

  t.end();
});
