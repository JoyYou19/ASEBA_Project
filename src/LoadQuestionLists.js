const fetchData = (fileName) => {
  return fetch(`data/${fileName}`)
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n').filter(line => line.trim());

      const numberQuestions = [];
      const letterQuestions = [];

      lines.forEach(line => {
        if (line.match(/^\d+/)) { // If the line starts with a number
          numberQuestions.push(line);
        } else if (line.match(/^[a-zA-Z]/)) { // If the line starts with a letter
          letterQuestions.push(line);
        }
      });

      return { numberQuestions, letterQuestions };
    });
};

export const loadQuestions = (fileNames) => {
  return Promise.all(fileNames.map(fileName => fetchData(fileName)))
    .then(results => {
      const newData = {};
      fileNames.forEach((fileName, index) => {
        newData[fileName] = {
          numberQuestions: results[index].numberQuestions,
          letterQuestions: results[index].letterQuestions
        };
      });
      console.log(newData);
      return newData;
    });
};
