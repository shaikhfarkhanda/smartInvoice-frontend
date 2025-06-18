import React, { useEffect, useState } from 'react';
import axios from "../utils/axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface LineItem {
    description: string;
    quantity: number;
    rate: number;
}

interface Invoice {
    id: number;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    status: string;
    client: Client;
    items: LineItem[];
}

const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState<"All" | "Paid" | "Unpaid">("All");
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            alert("You must be logged in to view invoices.");
            return ;
        }

        axios.get('invoices/')
            .then((res) => setInvoices(res.data))
            .catch((err) => {
                console.error("Error fetching invoices:", err);
                if (err.response?.status === 403 || err.response?.status === 401) {
                    alert("Session expired or unauthorized access.");
                }
            });
    }, [isLoggedIn]);

    const markAsPaid = async (invoiceId: number) => {
        try {
            await axios.patch(`invoices/${invoiceId}/`, { 
                status: "Paid"
            });
            //refresh invoice list
            const res = await axios.get("invoices/");
            setInvoices(res.data);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to mark invoice as paid.");
        }
    };

    return ( 
        <div className='p-6 bg-white rounded shadow'>
            <h2 className='text-xl font-bold mb-4'>Invoices</h2>
            <div className='mb-4 space-x-2'>
                {["All", "Paid", "Unpaid"].map((status) => (
                    <button
                        key={status}
                        className={`px-3 py-1 rounded ${filter === status ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setFilter(status as "All" | "Paid" | "Unpaid")}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <table className='min-w-full border border-gray-300 text-left'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className="px-4 py-2">Invoice #</th>
                        <th className="px-4 py-2">Client Name</th>
                        <th className="px-4 py-2">Issue Date</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className='px-4 py-2'>Total (₹)</th>
                        <th className='px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.filter((invoice) => {
                        if (filter === "All") return true;
                        return invoice.status === filter;
                    })
                        .map((invoice) => (
                        <tr 
                            key={invoice.id}
                            className='border-t hover:bg-gray-50 cursor-pointer'
                            onClick={() => navigate(`/invoice/${invoice.id}`)}
                        >
                            <td className="px-4 py-2">{invoice.invoice_number}</td>
                            <td className="px-4 py-2">{invoice.client.name}</td>
                            <td className="px-4 py-2">{invoice.issue_date}</td>
                            <td className="px-4 py-2">{invoice.due_date}</td>
                            <td className="px-4 py-2">{invoice.status}</td>
                            <td className='px-4 py-2'>₹{invoice.items.reduce((total, item) => total + item.quantity * item.rate, 0).toFixed(2)}</td>
                            <td className='px-4 py-2'>
                                {invoice.status === 'Unpaid' && (
                                    <button 
                                        className='text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600'
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                            markAsPaid(invoice.id)}
                                        }
                                    >
                                        Mark as Paid
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceList;