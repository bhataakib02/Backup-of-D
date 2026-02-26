import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Simple test component
const TestDashboard = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        NEXUS CYBER INTELLIGENCE - TEST
      </h1>
      <p className="text-lg text-gray-600">
        Testing if basic React components work...
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900">
          ✅ React is working!
        </h2>
        <p className="text-blue-700">
          If you can see this, the basic React setup is functional.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TestDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
