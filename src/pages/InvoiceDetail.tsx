import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "../utils/axios";
import DashboardLayout from "../layouts/DashboardLayout";

type Client = { 
    name: string;
    email: string;
}

type LineItem = {
    description: string;
    quantity: number;
    rate: number | string;
}

type Invoice = {
    id: number;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    status: string;
    notes: string;
    client: Client;
    items: LineItem[];
}
const InvoiceDetail: React.FC = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        console.log("Fetching invoice with ID:", id);

        axios.get(`/invoices/${id}/`)
            .then((res) => {
                console.log("✅ Invoice fetched:", res.data);
                setInvoice(res.data);
            })
            .catch((err) => {
                console.error("❌ Error fetching invoice:", err);
            });
    }, [id]);


     if (!invoice) {
        return <div>Loading ...</div>;
     }

     const handleSendEmail = async () => {
        try {
            await axios.post(`/invoices/${id}/send/`);
            alert('Invoice sent successfully!');
        } catch (error) {
            console.error('Error sending invoice:', error);
            alert('Failed to send invoice.');
        }
     };

     return (
        <DashboardLayout>
            <div className="p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Invoice #{invoice.invoice_number}</h2>
                <div className="mb-4">
                    <p><strong>Client Name:</strong> {invoice.client.name}</p>
                    <p><strong>Client Email:</strong> {invoice.client.email}</p>
                    <p><strong>Issue Date:</strong> {invoice.issue_date}</p>
                    <p><strong>Due Date:</strong> {invoice.due_date}</p>
                    <p><strong>Status:</strong> {invoice.status}</p>
                    <p><strong>Notes:</strong> {invoice.notes || 'N/A'}</p>
                </div>
                <h3 className="text-lg font-semibold mb-2">Line Items</h3>
                <table className="w-full border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Description</th>
                        <th className="border px-4 py-2 text-right">Quantity</th>
                        <th className="border px-4 py-2 text-right">Rate</th>
                        <th className="border px-4 py-2 text-right">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoice.items?.map((item, idx) => (
                        <tr key={idx}>
                        <td className="border px-4 py-2">{item.description}</td>
                        <td className="border px-4 py-2 text-right">{item.quantity}</td>
                        <td className="border px-4 py-2 text-right">₹{Number(item.rate).toFixed(2)}</td>
                        <td className="border px-4 py-2 text-right">₹{(item.quantity * Number(item.rate)).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="text-right font-bold mt-4 text-lg">
                    Subtotal: ₹{invoice.items.reduce((acc, item) => acc + item.quantity * Number(item.rate), 0).toFixed(2)}
                </div>
                {invoice.id && ( 
                    <div>
                        <a 
                            href={`${import.meta.env.VITE_API_BASE_URL}/invoices/${invoice.id}/pdf/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Download PDF
                        </a>
                        <button 
                            onClick={handleSendEmail}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-4 ml-2"
                        >
                            Send Invoice
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InvoiceDetail;