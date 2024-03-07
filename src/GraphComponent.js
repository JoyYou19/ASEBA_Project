import React, { useState, useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { registerables } from 'chart.js';

import './styles/Header.css';

import Chart from 'chart.js/auto'; // Import Chart.js

Chart.defaults.font.family = "Lato"; // Set default font family to "Lato"
Chart.defaults.font.size = 18;


// The main graph component
const GraphComponent = ({ chartRef, results, scale }) => {
  const categories = Object.keys(scale).filter(key => key !== 'graphName');
  // Prepare datasets for calculated T values
  const scaleResults = results[scale.graphName];
  const calculatedDataSet = {
    label: 'Calculated T Values',
    data: categories.map(category => ({
      x: scale[category].name,
      y: scaleResults[category] || 0, // Access nested results
    })),
    borderColor: 'rgba(0, 0, 255, 0.5)',  // Example: bright orange color
    borderWidth: 8,
    backgroundColor: 'rgba(0, 0, 0, 0)', // You can set background color as transparent
    pointBackgroundColor: 'rgba(0, 0, 255, 0.5)', // Blue with 50% opacity
    pointBorderColor: 'rgba(0, 0, 255, 0.5)',
    pointBorderWidth: 1,
    pointRadius: 12,
    showLine: true,
    fill: false,
  };

  // Prepare datasets for reference T values
  const referenceTValuesDataSet = {
    label: 'Reference T Values',
    data: [],
    borderColor: 'grey',
    backgroundColor: 'grey',
    showLine: false,
    pointRadius: 0,
  };

  // Populate the reference T values dataset
  categories.forEach(category => {
    const tValueMapping = scale[category].tValueMapping;
    Object.entries(tValueMapping).forEach(([key, value]) => {
      referenceTValuesDataSet.data.push({
        x: scale[category].name,
        y: value
      });
    });
  });

  // Data for the chart
  const data = {
    datasets: [referenceTValuesDataSet, calculatedDataSet]
  };

  const referencePoints = prepareReferencePoints(scale);
  const options = {
    plugins: {
      coloredBackgroundPlugin: {},
      drawNumbersPlugin: {},// Ensure your plugin is enabled
      legend: {
        display: false, // Hide the legend
      },
    },
    referencePoints: referencePoints,
    scales: {
      y: {
        beginAtZero: false,
        min: 50, // Set minimum value for Y-axis
        // Add more Y-axis configuration as needed
      },
      x: {
        offset: true,
      }
    },
    // ... other global options
  };


  // ... rest of your component ...

  return (
    <div className="canvas-container">
      <Line ref={chartRef} data={data} options={options} /> {/* Attach the ref */}
    </div>
  );
};


const coloredBackgroundPlugin = {
  id: 'coloredBackgroundPlugin',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const yAxis = chart.scales.y;
    const chartArea = chart.chartArea;

    const drawColoredRect = (color, yMin, yMax) => {
      const yTop = yAxis.getPixelForValue(yMax);
      const yBottom = yAxis.getPixelForValue(yMin);

      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(chartArea.left, yTop, chartArea.right - chartArea.left, yBottom - yTop);
      ctx.restore();
    };

    // Define your ranges and colors here
    drawColoredRect('rgba(255, 0, 0, 0.2)', 70, yAxis.max);
    drawColoredRect('rgba(255, 255, 0, 0.2)', 65, 70);
    drawColoredRect('rgba(0, 255, 0, 0.2)', yAxis.min, 65);
  }
};

// Register the necessary Chart.js components
ChartJS.register(coloredBackgroundPlugin);

const drawNumbersPlugin = {
  id: 'drawNumbersPlugin',
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.font = '17px Lato';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const referencePoints = chart.config.options.referencePoints || [];
    referencePoints.forEach(point => {
      const meta = chart.getDatasetMeta(0);
      const x = chart.scales.x.getPixelForValue(point.category);
      const y = chart.scales.y.getPixelForValue(point.tValue);

      ctx.save();
      ctx.fillStyle = 'black';
      ctx.fillText(point.scoreRange, x, y);
      ctx.restore();
    });
  }
};

ChartJS.register(drawNumbersPlugin);
const transformTValueMappingToChartData = (sindromuSkala) => {
  const chartData = [];

  // Iterate over each category in SindromuSkala
  Object.entries(sindromuSkala).forEach(([categoryKey, categoryValue]) => {
    if (categoryKey !== 'graphName' && categoryValue.tValueMapping) {
      // Iterate over each T value mapping
      Object.entries(categoryValue.tValueMapping).forEach(([key, value]) => {
        chartData.push({
          x: categoryValue.name,
          y: value,
        });
      });
    }
  });

  return chartData;
};


const prepareReferencePoints = (scale) => {
  const referencePoints = {};

  Object.entries(scale).forEach(([categoryKey, categoryValue]) => {
    if (categoryKey !== 'graphName') {
      Object.entries(categoryValue.tValueMapping).forEach(([originalScore, tValue]) => {
        const category = categoryValue.name;
        if (!referencePoints[category]) {
          referencePoints[category] = {};
        }
        if (!referencePoints[category][tValue]) {
          referencePoints[category][tValue] = [];
        }
        referencePoints[category][tValue].push(originalScore);
      });
    }
  });

  // Convert grouped scores into a range format
  const referencePointsArray = [];
  Object.entries(referencePoints).forEach(([category, tValues]) => {
    Object.entries(tValues).forEach(([tValue, scores]) => {
      const scoreRange = scores.length > 1 ? `${scores[0]}-${scores[scores.length - 1]}` : scores[0];
      referencePointsArray.push({
        category: category,
        tValue: Number(tValue),
        scoreRange: scoreRange,
      });
    });
  });

  return referencePointsArray;
};

export default GraphComponent;
