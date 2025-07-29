// ChartComponent.jsx
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Helper function to format the date and time
const formatDate = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${dayName} (${formattedHours}:${formattedMinutes}${period})`;
};

const LineChart2 = () => {
  // Get today's date and time
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
      width: 2
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
      categories: ['10:00am', '11:00am', '12:00am', '01.00pm', '02:00pm', '03:00pm', '04:00pm']
    }
  });

  return (
    <div>
      <div className="chart-header flex justify-between items-center">
        <p className="text-xl font-bold">Today’s Transaction</p>
        <p>{formattedDate}</p>
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={300} />
      </div>
    </div>
  );
};

export default LineChart2;
