describe('Conversational Flight Search E2E', () => {
  it('should allow a user to search for flights and see results cards', () => {
    // Mock flight data that the API will return
    const mockFlights = [
      {
        id: 1,
        airline: 'UA',
        flightNumber: 'UA456',
        from: 'NYC',
        to: 'SFO',
        price: 299.99,
        fares: [{ name: 'Main Cabin', price: 299.99, details: '1 checked bag' }],
      },
      {
        id: 2,
        airline: 'AA',
        flightNumber: 'AA789',
        from: 'NYC',
        to: 'SFO',
        price: 349.50,
        fares: [{ name: 'Main Cabin', price: 349.50, details: '1 checked bag' }],
      },
    ];

    // Intercept the API call to the chatbot and return our mock data
    cy.intercept('POST', '/api/chatbot', {
      statusCode: 200,
      body: {
        sessionId: 'test-session-123',
        reply: 'Here are the best flights I found for you.',
        flights: mockFlights,
      },
    }).as('chatbotRequest');

    // Visit the application
    cy.visit('/');

    // Find the initial input, type a message, and send it
    cy.get('input[placeholder="Where are we traveling to?"]')
      .type('flights to sfo');
    
    cy.get('button').contains('Send').click();

    // Wait for the API call to complete
    cy.wait('@chatbotRequest');

    // Assert that the flight cards are now visible in the DOM
    cy.contains('UA UA456').should('be.visible');
    cy.contains('$299.99').should('be.visible');
    
    cy.contains('AA AA789').should('be.visible');
    cy.contains('$349.50').should('be.visible');

    // Check for a detail from the fare
    cy.contains('Main Cabin').should('be.visible');
  });
});
