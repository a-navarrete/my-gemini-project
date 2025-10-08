import inquirer from 'inquirer';

export const findRestaurants = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'city',
      message: 'City:',
    },
    {
      type: 'input',
      name: 'cuisine',
      message: 'Cuisine type:',
    },
  ]);

  console.log(
    `Searching for ${answers.cuisine} restaurants in ${answers.city}...`
  );

  // Mock restaurant data
  const restaurants = [
    {
      name: 'The Gemini Grill',
      cuisine: 'Italian',
      price: '$$$',
      rating: '★★★★★',
    },
    {
      name: 'Starlight Bistro',
      cuisine: 'French',
      price: '$$$$',
      rating: '★★★★☆',
    },
  ];

  console.log('Found restaurants:');
  console.table(restaurants);
};