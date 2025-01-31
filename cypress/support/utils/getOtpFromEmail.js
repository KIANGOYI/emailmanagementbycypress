const { getEmails } = require("./gmail");

/**
 * Fonction pour extraire les emails et récupérer le code OTP
 */
async function getOtpFromEmail() {
  try {
    return getEmails().then((email) => {
      // Extraction du code OTP avec une expression régulière
      if (email != null && email != undefined) {
        const otpRegex = /\b\d{6}\b/; // Exemple : pour un OTP à 6 chiffres
        const otpMatch = email.match(otpRegex);
        if (!otpMatch) {
          throw new Error("Aucun code OTP valide n'a été trouvé dans l'email.");
        }

        console.log("Le code OTP est :", otpMatch[0]);
        return otpMatch[0];
      } else {
        console.log("Aucun email n'a été trouvé");
        return null;
      }
    });
  } catch (error) {
    console.error("Erreur dans getOtpFromEmail :", error.message);
    throw error;
  }
}

module.exports = {getOtpFromEmail}
