// Importation des modules nécessaires
const { google } = require("googleapis");
const { authorize } = require("./authorize");
const { decodeBase64 } = require("./decodeBase64");

/**
 * Fonction pour récupérer les e-mails récents depuis Gmail.
 * Cette fonction utilise l'API Gmail pour chercher les e-mails
 * en fonction d'une requête spécifique et affiche leur contenu.
 */
async function getEmails() {
  try {
    // Autoriser l'accès à l'API Gmail
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });

    // Requête pour récupérer les e-mails correspondant à des critères
    // "subject:OTP after:2025/01/15" 
    const query = "from:notifications@replit.com after:2025/01/15";
    const res = await gmail.users.messages.list({
      userId: "me", // "me" correspond à l'utilisateur authentifié
      q: query, // Filtre les e-mails
      maxResults: 1, // Limite les résultats à 1 e-mail
    });

    // Vérification s'il y a des messages dans la réponse
    if (!res.data.messages || res.data.messages.length === 0) {
      console.log("Aucun e-mail trouvé correspondant à la requête.");
      return;
    }

    // Récupération des détails du premier message
    const messageId = res.data.messages[0].id;
    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    // Vérification de la présence du contenu dans le message
    if (
      !message.data.payload ||
      !message.data.payload.body ||
      !message.data.payload.body.data
    ) {
      console.error("Le contenu de l'e-mail est vide ou inaccessible.");
      return;
    }

    // Décodage du contenu de l'e-mail encodé en base64
    const decodedData = decodeBase64(message.data.payload.body.data)

    // Affichage du contenu décodé de l'e-mail
    console.log("Extrait de l'e-mail :", decodedData);
    return decodedData;
  } catch (error) {
    // Gestion des exceptions
    console.error(
      "Une erreur est survenue lors de la récupération des e-mails :",
      error.message
    );
    console.error("Détails de l'erreur :", error.stack);
  }
}

// Exécution de la fonction pour récupérer les e-mails
//getEmails();

// Exportation de la fonction pour une utilisation dans d'autres modules
module.exports = { getEmails };
