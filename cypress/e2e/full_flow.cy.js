describe('Unified Chatbot Flow', () => {
  it('allows a user to search for a flight using the chatbot', () => {
    cy.visit('/');

    // Initial prompt
    cy.get('input[placeholder="Where are we traveling to?"]').type('flights to london');
    cy.get('button').contains('Send').click();

    // Chatbot interaction
    cy.contains('flights to london');
    
    // Assert that the bot responds
    cy.contains('Sure, let me help with that!');
  });
});
