const fs = require("fs");
const { google } = require("googleapis");
//global.punycode = require('punycode');

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Vérifiez si un token existe déjà
  const TOKEN_PATH = "token.json";
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  // Générer un lien d'autorisation
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  console.log("Authorize this app by visiting this URL:", authUrl);

  // Entrer le code d'autorisation
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    readline.question("Enter the code from that page here: ", (code) => {
      readline.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log("Token stored to", TOKEN_PATH);
        resolve(oAuth2Client);
      });
    });
  });
}

//authorize().catch((error) => console.error("Error during authorization:", error));

module.exports = { authorize };
