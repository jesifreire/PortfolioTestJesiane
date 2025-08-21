describe('FittTest - Fluxo principal', () => {
  beforeEach(() => {
    // Sempre começa do zero
    cy.clearLocalStorage();
    cy.visit('index.html');
  });

  it('deve realizar cadastro e login', () => {
    cy.registerAndLogin();

    // Faz logout
    cy.get('#logout-btn').click();

    // Faz login novamente com o usuário já cadastrado
    cy.get('#email').type('teste@teste.com');
    cy.get('#password').type('123456');
    cy.get('#auth-btn').click();
    cy.contains('Dashboard').should('exist');
  });

  it('deve adicionar, editar e excluir um exercício', () => {
  cy.registerAndLogin();

  // Adicionar exercício
  cy.get('#manage-exercise-name').type('Funcional');
  cy.get('#exercise-manage-form button[type="submit"]').click();
  cy.contains('Funcional').should('exist');

  // Editar exercício
  cy.window().then(win => {
    cy.stub(win, 'prompt').returns('Funcional Editado');
    cy.get('.edit-ex').first().click();
  });
  cy.contains('Funcional Editado').should('exist');

  // Excluir exercício
  cy.window().then(win => {
    cy.stub(win, 'confirm').returns(true);
    cy.get('.del-ex').first().click();
  });
  cy.contains('Funcional Editado').should('not.exist');
});

it('deve registrar um exercício', () => {
  cy.registerAndLogin();

  // Adicionar exercício
  cy.get('#manage-exercise-name').type('Corrida');
  cy.get('#exercise-manage-form button[type="submit"]').click();

  // Registrar exercício
  cy.get('#exercise-select').select('Corrida');
  cy.get('#category-select').select('Cardio');
  cy.get('#difficulty-select').select('Fácil');
  cy.get('#day-select').select('Seg');
  cy.get('#duration').type('30');
  cy.get('#exercise-form button[type="submit"]').click();

  cy.get('#recent-list').contains('Corrida').should('exist');
});
});