import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PricingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;