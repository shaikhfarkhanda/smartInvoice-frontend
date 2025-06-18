import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import AllInvoices from './pages/AllInvoices';
import InvoiceDetail from './pages/InvoiceDetail';
import Login from './pages/Login';
import Logout from './components/Logout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
        <Route path="/invoices" element={<AllInvoices />} />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
