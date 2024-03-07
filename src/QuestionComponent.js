import React, { useState, useEffect, useRef } from 'react';
import { loadQuestions } from './LoadQuestionLists'
import './styles/Questions.css';

const QuestionComponent = ({ inputValues, onInputChange, fileName }) => {
  // State to hold data
  const [data, setData] = useState({});
  const inputRefs = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleInputChange = (inputIndex, value) => {

    onInputChange(inputIndex, value);

    if (value !== '' && value >= 0 && value <= 2) {
      // Get all ref keys (sorted in render order)
      const keys = Object.keys(inputRefs.current);

      // Find the index of the current field's key
      const currentFieldIndex = keys.indexOf(inputIndex);

      // Focus the next field if exists
      if (currentFieldIndex >= 0 && currentFieldIndex < keys.length - 1) {
        const nextKey = keys[currentFieldIndex + 1];
        inputRefs.current[nextKey]?.focus();
      }
    }
  };
  const handleInputFocus = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    const fileNames = [fileName];
    loadQuestions(fileNames)
      .then(newData => {
        console.log(newData);
        setData(newData);
      });
  }, [fileName]);


  return (
    <div className="questions-container">
      {data[fileName] && data[fileName].numberQuestions &&
        data[fileName].numberQuestions.map((question, index) => (
          <div key={`num-${index}`} className="question-item">
            <input
              type="number"
              ref={(el) => inputRefs.current[`num-${index}`] = el}

              className={
                selectedIndex === index ? "question-input selected" : "question-input"
              }
              maxLength={1}
              value={inputValues[`num-${index}`] || ""}
              onFocus={() => handleInputFocus(index)}
              onKeyDown={(e) => {
                if (!/^[0-2]?$/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const newValue = e.target.value.slice(0, 1);
                handleInputChange(`num-${index}`, newValue);
              }}
            />
            <p className={selectedIndex === index ? "question selected" : "question"}>
              {question}
            </p>
          </div>
        ))
      }
      {data[fileName] && data[fileName].letterQuestions &&
        data[fileName].letterQuestions.map((question, index) => (
          <div key={`let-${index}`} className="question-item">
            <input
              type="number"
              ref={(el) => (inputRefs.current[`let-${index}`] = el)} // for letterQuestions
              className={
                selectedIndex === `let-${index}` ? "question-input selected" : "question-input"
              }
              maxLength={1}
              value={inputValues[`let-${index}`] || ""}
              onFocus={() => handleInputFocus(`let-${index}`)}
              onKeyDown={(e) => {
                if (!/^[0-2]?$/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const newValue = e.target.value.slice(0, 1);
                handleInputChange(`let-${index}`, newValue);
              }}
            />
            <p className={selectedIndex === `let-${index}` ? "subquestion selected" : "subquestion"}>
              {question}
            </p>
          </div>
        ))
      }
    </div>
  );

}



export default QuestionComponent;
