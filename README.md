## Overview
Blockchain wallet application using SRAM PUF.Storing private data like private keys of a digital wallet in a device that is resistant to physical attacks is difficult and expensive. Instead if the key information could be derived from the complex physical properties of the device which cannot be cloned or predicted we can have a decent security. Physical unclonable functions (PUF) are based on physical system which output like a random function and is resistant to the attacker with physical access to the system. This makes it an ideal device for storing/deriving private data. In this project, we can use Static random access memory (SRAM) to build a PUF to derive a secure seed which can then be used to derive a hierarchy of Elliptic curve private keys. In essence, we build a non-clonable cryptocurrency wallet to store private keys and validate wallet functions like transaction signing and verification. The signing of the transactions are performed with the private keys in an offline environment so, ones private key does not come into contact with the server that is connected online thus further increasing security. We experiment with two SRAM chips: Microchip 23LC1024 and Cypress CY62256NLL and investigate their properties while building the PUF using them.
## Steps to run the project 
#### step 1 : clone the project
*Firstly clone the project into your working directory.*
#### step 2: npm install
*Open command prompt inside the project and run npm install to install all the required dependencies.*
#### step 3: rn-nodeify --hack --install
*run the following command to install shims for core node modules.*
#### step 4: react-native run-android
*Finally, run the project using the above command*
