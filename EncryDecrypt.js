
var jose = require("node-jose");
const fs= require('fs')

var encryptiondata = async (token) => {
    const keystore = jose.JWK.createKeyStore();
    const publicKey = fs.readFileSync("privateKey.pem");
    await keystore.add(publicKey, "pem", { use: "enc" });
  
    //const payload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const recipientKeys= keystore.all({use: 'enc'})
    const recipientKey=recipientKeys[0]
    const options ={
      format: 'compact',
      feilds: {kid: recipientKey.kid}
    }
  
    const encrypted = await jose.JWE.createEncrypt(options,recipientKey)
                      .update(token).final();
    console.log("Encrypted Data is : " ,encrypted)
    decryptiondata(encrypted)
  }
  const payload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJJbnRlbEh1YiIsImVjb2RlIjoxLCJFbWFpbEFkZHJlc3MiOiJQYXJkZWVwLkt1bWFyQGZpc2dsb2JhbC5jb20iLCJpc3MiOiJHQlBBVUFUIiwiZW50aXR5X2lkIjoiMTYyNyIsInVzZXJfdHlwZSI6ImV4dGVybmFsIiwiTG9naW5OYW1lTEMiOiJQYXJkZWVwIEt1bWFyIiwiYWNjZXNzVG9rZW4iOiIyNTYyODkxY2U5MDgwNTc1YmY2MjNiYTMyY2FmYjRhMyIsIkxvZ2luTmFtZSI6IlBhcmRlZXAuSyIsImV4cGlyZXNfaW4iOjI0NjE0NzEyMDAwMDAsImlhdCI6MTY5MjI1ODk3NiwiZXhwIjoxNjkyMzQ1Mzc2fQ.pLn-F0dYn_acesfQyuAIihFvZEOPrcF6zponvMA0Mz4';
  encryptiondata(payload);
  var decryptiondata = async (token) => {
      const keystore = jose.JWK.createKeyStore();
      const privateKey = fs.readFileSync("privateKey.pem");
      await keystore.add(privateKey, "pem", { use: "enc" });
      const decrypted = await jose.JWE.createDecrypt(keystore).decrypt(token);
      console.log("Decrypted Data is : " ,decrypted.payload.toString())
  
      //return decrypted.payload.toString();
  }