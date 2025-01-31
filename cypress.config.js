const { defineConfig } = require("cypress");
const { authorize } = require("./cypress/support/utils/authorize");
const { getEmails } = require("./cypress/support/utils/gmail");
const { decodeBase64 } = require("./cypress/support/utils/decodeBase64");
const { getOtpFromEmail } = require("./cypress/support/utils/getOtpFromEmail");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Tâches personnalisées pour les scripts
      on("task", {
        authorizeTask() {
          return authorize().then((auth) => {
            console.log("Authorization completed");
            return "Authorization successful"; // Vous pouvez retourner plus d'informations si nécessaire
          });
        },
        fetchEmailsTask() {
          return getEmails().then((emails) => {
            console.log("Emails fetched:", emails);
            return emails;
          });
        },
        getOtpFromEmailTask() {
          return getOtpFromEmail().then((otp) => {
            console.log("OTP trouvé:", otp);
            return otp;
          });
        },
        decodeBase64Task(encodedData) {
          const decodedData = decodeBase64(encodedData);
          console.log("Decoded data:", decodedData);
          return decodedData;
        },
      });

      return config; // Retourner la configuration
    },
  },
});
