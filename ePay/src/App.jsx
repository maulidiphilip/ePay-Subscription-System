import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubscriptionPlans from './components/SubscriptionPlans';
import Checkout from './components/Checkout';
import Success from './components/Success';
import Failure from './components/Failure';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubscriptionPlans />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
      </Routes>
    </Router>
  );
}

export default App;