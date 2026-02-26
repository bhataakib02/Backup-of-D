import { Chart as ChartJS, registerables } from 'chart.js';

// Register all the chart types and features we need
ChartJS.register(...registerables);

// Add any additional chart.js configuration here
// This ensures chart.js is properly set up throughout the application