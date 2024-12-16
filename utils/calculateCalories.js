/**
 * Calculează aportul caloric recomandat pe baza greutății, înălțimii și vârstei utilizatorului.
 * Formula utilizată: 10 * greutate + 6.25 * înălțime - 5 * vârstă + 5
 *
 * @param {number} weight - Greutatea utilizatorului în kg
 * @param {number} height - Înălțimea utilizatorului în cm
 * @param {number} age - Vârsta utilizatorului
 * @returns {number|null} - Aportul caloric recomandat (rotunjit), sau null dacă input-ul este invalid
 */
const calculateCalories = (weight, height, age) => {
  const weightNumber = parseFloat(weight);
  const heightNumber = parseFloat(height);
  const ageNumber = parseFloat(age);

  if (isNaN(weightNumber) || isNaN(heightNumber) || isNaN(ageNumber)) {
    console.error("⚠️ Input invalid pentru calculul caloriilor:", { weight, height, age });
    return null;
  }

  const recommendedCalories = 10 * weightNumber + 6.25 * heightNumber - 5 * ageNumber + 5;
  console.log("✅ Calorii calculate cu succes:", recommendedCalories);
  return Math.round(recommendedCalories);
};

module.exports = calculateCalories;
