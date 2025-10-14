describe('Full user flow', () => {
  it('allows a user to search, select, and book a trip', () => {
    // Visit the site
    cy.visit('/');
    cy.log('Visited the site');

    // Type a search query and submit
    cy.get('input[type="text"]').type('flights to london');
    cy.get('form').submit();
    cy.log('Submitted the search form');

    // Assert that results are displayed
    cy.contains('Flights');
    cy.contains('Hotels');
    cy.log('Asserted that results are displayed');

    // Select a flight and a hotel
    cy.get('[data-cy=select-flight-button]').first().click();
    cy.get('[data-cy=select-hotel-button]').first().click();
    cy.log('Selected a flight and a hotel');

    // Log the content of the trip summary before assertion
    cy.get('.trip-summary').then(($summary) => {
      cy.log('Trip Summary Content:', $summary.text());
    });

    // Assert that the trip summary is updated
    cy.get('[data-cy=selected-flight-airline]').contains('British Airways');
    cy.get('[data-cy=selected-hotel-name]').contains('The Savoy');
    cy.log('Asserted that the trip summary is updated');

    // Book the trip
    cy.get('[data-cy=book-now-button]').click();
    cy.log('Clicked the book now button');

    // Assert that the checkout page is displayed
    cy.get('[data-cy=checkout-title]').should('be.visible');
    cy.log('Asserted that the checkout page is displayed');

    // Fill out the checkout form
    cy.get('[data-cy=checkout-name]').type('Test User');
    cy.get('[data-cy=checkout-email]').type('test@example.com');
    cy.get('[data-cy=checkout-cardNumber]').type('1234567812345678');
    cy.get('[data-cy=checkout-expiry]').type('12/25');
    cy.get('[data-cy=checkout-cvv]').type('123');
    cy.log('Filled out the checkout form');

    // Submit the booking
    cy.get('[data-cy=confirm-booking-button]').click();
    cy.log('Submitted the booking');

    // Assert that a success message is displayed
    cy.contains('Booking successful!');
    cy.log('Asserted that a success message is displayed');
  });
});
