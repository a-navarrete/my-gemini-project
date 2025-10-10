describe('My First Test', () => {
  it('Visits the app', () => {
    cy.visit('/');
    cy.title().should('eq', 'React App');
  });
});
