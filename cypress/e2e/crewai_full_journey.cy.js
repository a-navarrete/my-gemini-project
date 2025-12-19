describe('CrewAI Full User Journey E2E Test', () => {
  it('should allow a user to search, select, and book a flight and hotel', () => {
    // Visit the application
    cy.visit('/');

    // Intercept the API call and wait for it to complete
    cy.intercept('POST', '/api/crewai/orchestrate').as('orchestrateRequest');

    // 1. Search for a flight and hotel
    cy.get('[data-cy="search-input"]').type('flights to London and a hotel for 3 nights');
    cy.get('[data-cy="search-button"]').click();

    cy.wait('@orchestrateRequest', { timeout: 30000 }); // Increased timeout for the API call itself

    // Now assert for results
    cy.contains('Flight Results', { timeout: 20000 }).should('be.visible');
    cy.contains('Hotel Results', { timeout: 20000 }).should('be.visible');

    // 2. Select a flight and a hotel
    cy.get('[data-testid="flight-select-button"]').first().click();
    cy.get('[data-testid="hotel-select-button"]').first().click();

    // Verify trip summary updates
    cy.get('[data-testid="trip-summary-flight"]').should('be.visible');
    cy.get('[data-testid="trip-summary-hotel"]').should('be.visible');

    // 3. Proceed to checkout
    cy.get('[data-testid="book-now-button"]').click();

    // Verify navigation to checkout page
    cy.url().should('include', '/checkout');
    cy.contains('Checkout', { timeout: 5000 }).should('be.visible');

    // 4. Fill out checkout form
    cy.get('[data-testid="checkout-name-input"]').type('John Doe');
    cy.get('[data-testid="checkout-email-input"]').type('john.doe@example.com');
    cy.get('[data-testid="checkout-payment-input"]').type('4111111111111111'); // Mock credit card number

    // 5. Submit booking
    cy.get('[data-testid="confirm-booking-button"]').click();

    // 6. Verify booking confirmation
    cy.contains('Booking Confirmed!', { timeout: 10000 }).should('be.visible');
    cy.contains('Thank you for your booking, John Doe!', { timeout: 10000 }).should('be.visible');
  });
});
