import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';


const HeaderComponent = ({ onSaveAsPng, questionSets, currentQuestionSet, onSelectQuestionSet, onSelectScale }) => {
  // Ensure that currentQuestionSet is a valid key in questionSets
  const isValidQuestionSet = currentQuestionSet && questionSets[currentQuestionSet];

  // Generate scale options only if the current question set is valid
  const scaleOptions = isValidQuestionSet
    ? questionSets[currentQuestionSet].scales.map((scale, index) => (
      <option key={index} value={index}>{scale.graphName}</option>
    ))
    : [];
  return (
    <div className="header">
      <div className="dropdown-wrapper">
        <select onChange={(e) => onSelectQuestionSet(e.target.value)}>
          {Object.entries(questionSets).map(([key, questionSet], index) => (
            <option key={index} value={key}>{questionSet.name}</option>
          ))}
        </select>
      </div>
      <div className="dropdown-wrapper">
        <select onChange={(e) => onSelectScale(e.target.value)}>
          {scaleOptions}
        </select>
      </div>
      <div className="navigation">
        <Link to="/questions">Questions</Link>
        <Link to="/graphs">Graphs</Link>
      </div>
      <button onClick={onSaveAsPng}>Save Graph as PNG</button>
    </div>
  )
}

export default HeaderComponent;
