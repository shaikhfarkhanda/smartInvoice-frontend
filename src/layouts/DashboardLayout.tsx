import React, { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../utils/auth";
interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow p-4">
                <h1 className="text-2xl font-bold text-gray-800">SmartInvoice</h1>
                <nav className="space-x-4">
                    <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/invoices" className="text-blue-600 hover:underline">Invoices</Link>
                            <Link to="/create-invoice" className="text-blue-600 hover:underline">Create Invoice</Link>
                            <button 
                                onClick={async () => {
                                    await logout();
                                    setIsLoggedIn(false);
                                    navigate('/login');
                                }}
                                className="text-red-600 hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    )}
                </nav>
            </header>
            <main className="flex-1 p-6">{children}</main>
            <footer className="bg-white p-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} SmartInvoice. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;