"use strict";

const test = require("tap").test;

const lib = require("./");
const encrypt = lib.encrypt;
const decrypt = lib.decrypt;


test("Xcrypt", function(t) {

  t.test("basic functionality", function (t) {
  
    let secretKey = "SECRET_KEY";
    let algorithm = "aes-256-ctr";
    let version = "1";
    let unencryptedValue = "hello cruel world!";

  
    t.test("Encrypt", function (t) {
      let encryptedValue = encrypt(unencryptedValue, secretKey, algorithm, version);
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
      }
      catch (err) {
        t.fail("should use default algorithm");
      }
      
      t.end();
    });


    t.end();
  });
  

  t.test("invalid encrypted format", function (t) {
    let secretKey = "SECRET_KEY";    
    let encryptedValue = ":::";
    
    let result;
    
    try {
      result = decrypt(encryptedValue, secretKey);
      t.fail("should throw error");
    }
    catch (err) {
      t.ok(err);
      t.equal(err.message, "Invalid encrypted format");
      t.pass("should throw error");
    }

    t.end();
  });


  t.test("unknown cipher", function (t) {
    let secretKey = "SECRET_KEY";    
    let encryptedValue = "::::";
    
    let result;
    
    try {
      result = decrypt(encryptedValue, secretKey);
      t.fail("should throw error");
    }
    catch (err) {
      t.ok(err);
      t.equal(err.message, "Unknown cipher");
      t.pass("should throw error");
    }

    t.end();
  });



  t.end();
    
});


