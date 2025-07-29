// ChartComponent.jsx
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Helper function to format the date
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // 'en-GB' format: 17 August 2024
};

const LineChart3 = () => {
  // Get today's date
  const today = new Date();
  const formattedDate = formatDate(today);

  const [series] = useState([{
    name: "Cutlist",
    data: [10, 41, 35, 51, 50, 100, 200]
  }]);

  const [options] = useState({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false // Hides the toolbar
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    title: {
      text: '',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={200} />
      </div>
    </div>
  );
};

export default LineChart3;
