const calculateCalories = (weight, height, age) => {
  const weightNumber = parseFloat(weight);
  const heightNumber = parseFloat(height);
  const ageNumber = parseFloat(age);

  if (isNaN(weightNumber) || isNaN(heightNumber) || isNaN(ageNumber)) {
    console.log("Please enter valid numbers");
    return null;
  }

  // Formula pentru calculul caloriilor necesare
  const recCalories =
    10 * weightNumber + 6.25 * heightNumber - 5 * ageNumber + 5;
  return Math.round(recCalories);
};

module.exports = calculateCalories;
