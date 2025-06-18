import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard: React.FC = () => {
    return (
        <DashboardLayout>
            <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
            <p className="text-gray-600">Here you can manage your invoices and clients.</p>
        </DashboardLayout>
    );
};

export default Dashboard;