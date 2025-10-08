import inquirer from 'inquirer';

export const bookHotel = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'city',
      message: 'City:',
    },
    {
      type: 'input',
      name: 'checkin',
      message: 'Check-in date (YYYY-MM-DD):',
    },
    {
      type: 'input',
      name: 'checkout',
      message: 'Check-out date (YYYY-MM-DD):',
    },
  ]);

  console.log(
    `Searching for hotels in ${answers.city} from ${answers.checkin} to ${answers.checkout}...`
  );

  // Mock hotel data
  const hotels = [
    {
      name: 'The Gemini Hotel',
      price: '$200/night',
      rating: '★★★★★',
    },
    {
      name: 'Starlight Inn',
      price: '$150/night',
      rating: '★★★★☆',
    },
  ];

  console.log('Found hotels:');
  console.table(hotels);
};