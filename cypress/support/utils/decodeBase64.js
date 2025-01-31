function decodeBase64(encodedData) {
    return Buffer.from(encodedData, "base64").toString("utf-8");
  }
  
module.exports = { decodeBase64 };
  