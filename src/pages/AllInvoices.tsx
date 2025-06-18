import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import InvoiceList from '../components/InvoiceList';

const AllInvoices: React.FC = () => {
    return (
        <DashboardLayout>
            <InvoiceList />
        </DashboardLayout>
    );
};

export default AllInvoices;