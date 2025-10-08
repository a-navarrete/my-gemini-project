import inquirer from 'inquirer';

export const findFlight = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'departure',
      message: 'Departure airport:',
    },
    {
      type: 'input',
      name: 'destination',
      message: 'Destination airport:',
    },
    {
      type: 'input',
      name: 'date',
      message: 'Date (YYYY-MM-DD):',
    },
  ]);

  console.log(
    `Searching for flights from ${answers.departure} to ${answers.destination} on ${answers.date}...`
  );

  // Mock flight data
  const flights = [
    {
      airline: 'Gemini Air',
      flight: 'GA123',
      price: '$500',
      departure: '10:00 AM',
      arrival: '12:00 PM',
    },
    {
      airline: 'Starlight Airways',
      flight: 'SA456',
      price: '$600',
      departure: '02:00 PM',
      arrival: '04:00 PM',
    },
  ];

  console.log('Found flights:');
  console.table(flights);
};
