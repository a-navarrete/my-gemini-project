import inquirer from 'inquirer';

export const findSights = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'city',
      message: 'City:',
    },
    {
      type: 'input',
      name: 'activity',
      message: 'Type of activity (e.g., museum, park, tour):',
    },
  ]);

  console.log(
    `Searching for ${answers.activity} in ${answers.city}...`
  );

  // Mock sights and activities data
  const sights = [
    {
      name: 'The Gemini Museum of Art',
      type: 'Museum',
      price: '$25',
    },
    {
      name: 'Starlight Park',
      type: 'Park',
      price: 'Free',
    },
  ];

  console.log('Found sights and activities:');
  console.table(sights);
};