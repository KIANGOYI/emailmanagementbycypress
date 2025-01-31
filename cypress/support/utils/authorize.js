// Importation des modules nécessaires
const fs = require("fs");
const { google } = require("googleapis");

/**
 * Fonction pour autoriser l'accès à l'API Google.
 * Cette fonction charge les informations d'identification (credentials), 
 * vérifie ou génère un token, et retourne un client OAuth2 autorisé.
 *
 * @returns {Promise<OAuth2Client>} Une instance OAuth2Client autorisée
 * @throws {Error} Lance une erreur si l'autorisation échoue
 */
async function authorize() {
  try {
    // Lecture et analyse des informations d'identification
    const credentialsPath = "C:/Projects/Cypress/EmailManagementByCypress/cypress/fixtures/credentials.json";
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Le fichier ${credentialsPath} est introuvable. Veuillez vérifier son emplacement.`);
    }
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    const { client_id, client_secret, redirect_uris } = credentials.web;

    // Initialisation du client OAuth2
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Vérification si un token existe déjà
    const TOKEN_PATH = "C:/Projects/Cypress/EmailManagementByCypress/cypress/fixtures/token.json";
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
      oAuth2Client.setCredentials(token);
      return oAuth2Client;
    }

    // Génération d'une URL d'autorisation
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/gmail.readonly"], // Scope pour lire les e-mails Gmail
    });
    console.log("Veuillez autoriser cette application en visitant cette URL :", authUrl);

    // Demande de code d'autorisation à l'utilisateur
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      readline.question("Entrez le code fourni par la page ici : ", (code) => {
        readline.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            return reject(new Error(`Erreur lors de la génération du token : ${err.message}`));
          }
          oAuth2Client.setCredentials(token);

          // Sauvegarde du token pour les futures utilisations
          try {
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log(`Token sauvegardé dans ${TOKEN_PATH}`);
          } catch (writeErr) {
            console.error(`Erreur lors de l'enregistrement du token : ${writeErr.message}`);
            return null
          }

          resolve(oAuth2Client);
        });
      });
    });
  } catch (error) {
    console.error("Erreur lors de l'autorisation :", error.message);
    throw error;
  }
}

// Exportation de la fonction pour une utilisation dans d'autres modules
module.exports = { authorize };
