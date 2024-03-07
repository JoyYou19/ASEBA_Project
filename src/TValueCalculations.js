
const calculateAllTValues = (categories, inputValues) => {
  const tValues = {};

  for (const [categoryKey, categoryInfo] of Object.entries(categories)) {
    if (categoryInfo.questionIndices && categoryInfo.tValueMapping) {
      let sum = 0;
      let includesMinusOne = false;

      // Sum values for regular questions
      for (const index of categoryInfo.questionIndices) {
        if (index !== -1) {
          const key = `num-${index - 1}`;
          sum += (Number(inputValues[key]) || 0);
        } else {
          includesMinusOne = true;
        }
      }

      // If -1 is present, add its calculation to the sum
      if (includesMinusOne) {
        const sumForMinusOne = Object.keys(inputValues)
          .filter(key => key.startsWith("let-"))
          .reduce((acc, key) => acc + (Number(inputValues[key]) || 0), 0);
        sum += sumForMinusOne;
      }

      tValues[categoryKey] = categoryInfo.tValueMapping[sum] || 0;
    }
  }

  return tValues;
};

const calculateAllCategories = (currentQuestionSet, inputValues) => {
  const scales = currentQuestionSet.scales;

  if (!scales) {
    console.error("No scales found for the current question set:", currentQuestionSet);
    return {};
  }

  const allCategoriesResults = {};

  scales.forEach(scaleObj => {
    allCategoriesResults[scaleObj.graphName] = calculateAllTValues(scaleObj, inputValues);
  });
  console.log(allCategoriesResults);

  return allCategoriesResults;
};

export default calculateAllCategories;
