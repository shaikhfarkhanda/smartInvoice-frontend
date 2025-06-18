import React, { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import InvoiceForm from "../components/InvoiceForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateInvoice: React.FC = () => {

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn]);
    
    return (
        <DashboardLayout>
            <InvoiceForm />
        </DashboardLayout>
    );
};

export default CreateInvoice;