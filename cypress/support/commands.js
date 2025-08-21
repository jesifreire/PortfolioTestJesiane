Cypress.Commands.add("registerAndLogin", () => {
  cy.get('#show-register').click();
  cy.get('#email').type('teste@teste.com');
  cy.get('#password').type('123456');
  cy.get('#auth-btn').click();
  cy.contains('Dashboard').should('exist');
});
