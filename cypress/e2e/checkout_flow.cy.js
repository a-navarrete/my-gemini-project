describe('Checkout flow', () => {
  it('navigates to the checkout page when the button is clicked', () => {
    cy.visit('/');

    // Simulate search and selection to enable the Book Now button
    cy.get('input[type="text"]').type('flights to london');
    cy.get('form').submit();
    cy.contains('Flights');
    cy.contains('Hotels');
    cy.get('[data-cy=select-flight-button]').first().click();
    cy.get('[data-cy=select-hotel-button]').first().click();
    cy.get('[data-cy=book-now-button]').should('be.visible').click();

    cy.get('[data-cy=checkout-title]').should('be.visible');
  });
});