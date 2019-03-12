# xcrypt

Xcrypt is utility intended to encrypt and decrypt content across multiple languages

Author: Eugene Song 


## Install

```bash
npm install xcrypt
```


## Usage

```bash
Usage: xcrypt

Options:
  --version              Show version number                           [boolean]
  --help                 Show help                                     [boolean]
  --secret, -s           The secret key used to encrypt/decrypt       [required]
  --decrypt, -d          Set mode to decrypt                           [boolean]
  --list-algorithms, -l  List the supported algorithms                 [boolean]
  --algorithm, -a        Set the cipher algorithm used to encrypt
                                                        [default: "aes-256-ctr"]

Usage:
   Encrypt: 
     xcrypt -s <secret> [options]... -- <input>
     echo -n <input> | xcrypt -s <secret> [options]... --

   Decrypt: 
     xcrypt -s <key> --decrypt [options]... -- <input>
     echo -n <input> | xcrypt -s <key> --decrypt [options]... --

Options:

 -h, --help
     This help text.

 -s, --secret
     REQUIRED: The secret key used to encrypt/decrypt

 -a, --algorithm
     DEFAULT: aes-256-ctr

 -d, --decrypt
     Sets the mode to decrypt

 -l, --list-algorithms
     List the supported algorithms

 --
     Do not interpret any more arguments as options
```