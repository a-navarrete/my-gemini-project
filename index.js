import inquirer from 'inquirer';
import { findFlight } from './features/flights.js';
import { bookHotel } from './features/hotels.js';
import { findRestaurants } from './features/restaurants.js';
import { findSights } from './features/sights.js';

const main = async () => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        '✈️  Find a flight',
        '🏨  Book a hotel',
        '🍔  Search for restaurants',
        '🏞️  Discover sights and activities',
        new inquirer.Separator(),
        '👋  Exit',
      ],
    },
  ]);

  switch (choice) {
    case '✈️  Find a flight':
      await findFlight();
      break;
    case '🏨  Book a hotel':
      await bookHotel();
      break;
    case '🍔  Search for restaurants':
      await findRestaurants();
      break;
    case '🏞️  Discover sights and activities':
      await findSights();
      break;
    case '👋  Exit':
      console.log('Goodbye!');
      return;
  }

  // We'll add a prompt to ask the user if they want to do something else
  main();
};

main();
