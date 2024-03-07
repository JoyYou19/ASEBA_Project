import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
import QuestionComponent from './QuestionComponent';
import { questionSets } from './QuestionScales';
import calculateAllCategories from './TValueCalculations';
import GraphComponent from './GraphComponent';

function AppWithRouter() {
  const [currentQuestionSet, setCurrentQuestionSet] = useState(Object.keys(questionSets)[0]);
  const [currentScaleIndex, setCurrentScaleIndex] = useState(0); // New state for current scale index
  const [inputValues, setInputValues] = useState({});
  const [calculatedResults, setCalculatedResults] = useState({});
  const location = useLocation();
  const chartRef = useRef(null);


  const handleInputChange = (index, value) => {
    setInputValues({
      ...inputValues,
      [index]: value
    });
  };

  // Handler for changing the scale from the dropdown
  const handleSelectScale = (selectedScaleIndex) => {
    setCurrentScaleIndex(selectedScaleIndex);
  };
  const handleCalculateClick = () => {
    const results = calculateAllCategories(questionSets[currentQuestionSet], inputValues);
    setCalculatedResults(results);
  };

  const handleSelectQuestionSet = (selectedSetKey) => {
    // Reset related states
    setCurrentScaleIndex(0);
    setInputValues({});
    setCalculatedResults({}); // Reset calculated results
    setCurrentQuestionSet(selectedSetKey);
  };

  useEffect(() => {
    if (location.pathname === "/graphs") {
      handleCalculateClick();
    }
    if (currentQuestionSet) {
      handleCalculateClick();
    }
  }, [location, inputValues, currentQuestionSet]);

  const handleSaveAsPNG = () => {
    if (chartRef && chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const context = chartCanvas.getContext('2d');

      // Save the current state of the canvas
      context.save();

      // Set background to white for the saved image
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = 'white'; // Or any other background color
      context.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

      const imageURL = chartCanvas.toDataURL("image/png");

      // Restore the canvas to its original state
      context.restore();

      // Create a temporary anchor element and trigger a download
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURL;
      downloadLink.download = 'chart.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  return (
    <>
      <HeaderComponent
        onSaveAsPng={handleSaveAsPNG}
        questionSets={questionSets}
        currentQuestionSet={currentQuestionSet}
        onSelectQuestionSet={handleSelectQuestionSet}
        onSelectScale={handleSelectScale}
      />
      <Routes>
        <Route path="/questions" element={<QuestionComponent inputValues={inputValues}
          onInputChange={handleInputChange}
          fileName={currentQuestionSet} />} />
        {Object.keys(calculatedResults).length > 0 && questionSets[currentQuestionSet] && questionSets[currentQuestionSet].scales[currentScaleIndex] ? (
          <Route
            path="/graphs"
            element={<GraphComponent chartRef={chartRef}
              results={calculatedResults}
              scale={questionSets[currentQuestionSet].scales[currentScaleIndex]} />}
          />
        ) : null}
        <Route path="/" element={<QuestionComponent inputValues={inputValues}
          onInputChange={handleInputChange}
          fileName={currentQuestionSet} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

export default App;
