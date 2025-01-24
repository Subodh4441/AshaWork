import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';

 
@Injectable({
  providedIn: "root"
})
export class EncryptionService {
  private key: CryptoJS.lib.WordArray;
  private iv: CryptoJS.lib.WordArray;
 
  constructor() {
    // Ensure the key and IV are the same as in your .NET Core app.
    // Replace these with your actual key and IV values (base64-encoded strings).
    const keyBase64 = 'ZHM4YW0zd3lzM3BkNzVuZjBnZ3R2YWp3MmszdW55OTI=';
    const ivBase64 = 'am04bGdxYTNqMWQwYWp1cw==';

    this.key = CryptoJS.enc.Base64.parse(keyBase64);
    this.iv = CryptoJS.enc.Base64.parse(ivBase64);
  }
 
  encryptionAES(decryptedText: string): string {
    if (!decryptedText) {
      return '';
    }

    const encrypted = CryptoJS.AES.encrypt(decryptedText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const base64String = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    // Make the Base64 string URL-safe
    const urlSafeBase64 = base64String.replace(/\+/g, '-').replace(/\//g, '_');
    return urlSafeBase64;
  }

  decryptionAES(encryptedText: string): string {
    if (!encryptedText) {
      return '';
    }
    // Convert the URL-safe Base64 string back to a standard Base64 string
    const base64String = encryptedText.replace(/-/g, '+').replace(/_/g, '/');

    const encryptedWordArray = CryptoJS.enc.Base64.parse(base64String);
    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedWordArray
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }
}