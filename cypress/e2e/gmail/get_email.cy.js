describe("Tests utilisant authorize.js, gmail.js, et decodeBase64.js", () => {
    it("Test d'autorisation", () => {
      cy.task("authorizeTask").then((result) => {
        cy.log(result); // Affiche le succès de l'autorisation
      });
    });
  
    it("Test de récupération d'e-mails", () => {
      cy.task("fetchEmailsTask").then((emails) => {
        expect(emails).to.not.equal(null);
        cy.log(emails); // Affiche les e-mails récupérés
      });
    });

    it.skip("Test de récupération d'OTP", () => {
      cy.task("getOtpFromEmailTask").then((otp) => {
        cy.log(otp); // Affiche les e-mails récupérés
      });
    });
  
    it("Test de décodage Base64", () => {
      const encodedData = "SGVsbG8gd29ybGQ="; // Exemple de données encodées
      cy.task("decodeBase64Task", encodedData).then((decodedData) => {
        cy.log(decodedData); // Affiche les données décodées
      });
    });
});
  