import React, { useEffect, useState } from 'react';
import axios from "../utils/axios";

type LineItem = {
    description: string;
    quantity: number;
    rate: number;
};

const InvoiceForm: React.FC = () => {
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<LineItem[]>([
        {description: '', quantity: 1, rate: 0},
    ]);
    const [notes, setNotes] = useState('');

     const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const newItems = [...items];
        if (field === 'description') newItems[index].description = value as string;
        if (field === 'quantity') newItems[index].quantity = Number(value);
        if (field === 'rate') newItems[index].rate = Number(value);
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0}]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const clientResponse = await axios.post('clients/', {
                name: clientName,
                email: clientEmail,
            });

            const clientId = clientResponse.data.id;
            console.log("✅ Client created:", clientResponse.data);

            const invoiceData = {
                client: clientId,
                invoice_number: `INV-${Math.floor(Math.random() * 100000)}`,
                issue_date: invoiceDate,
                due_date: dueDate,
                status: "Unpaid",
                notes: notes,
                items: items,
            };

            const invoiceResponse = await axios.post('invoices/', 
                invoiceData,
            );
            console.log("✅ Invoice created:", invoiceResponse.data);

            alert('Invoice created successfully!');

            setClientName('');
            setClientEmail('');
            setInvoiceDate('');
            setDueDate('');
            setNotes('');
            setItems([{description: '', quantity: 1, rate: 0}]);
            setFormErrors([]);
            
        } catch(error) {
            console.error('❌ Error creating invoice:', error);
            alert('Error creating invoice. See console.');
        }
    };

    const validateForm = (): boolean => {
        const errors: string[] = [];

        if (!clientName.trim()) errors.push("Client name is required.");
        if (!clientEmail.trim()) {
            errors.push("Client email is required.");
        } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
            errors.push("Email format is invalid.");
        }

        if (!invoiceDate) errors.push("Invoice date is required.");
        if (!dueDate) errors.push("Due date is required.");

        items.forEach((item, index) => {
            if (!item.description.trim()) {
                errors.push(`Item ${index + 1}: description is required.`);
            }
            if (item.quantity <= 0) {
                errors.push(`Item ${index + 1}: quantity must be atleast 1.`);
            }
            if (item.rate < 0) {
                errors.push(`Item ${index + 1}: rate cannot be negative.`);
            }
        });

        setFormErrors(errors);
        return errors.length === 0;
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/invoices/")
            .then((res) => res.json())
            .then((data) => console.log("Connected ✅", data))
            .catch((err) => console.error("❌ Error connecting to backend", err));
    }, []);

    return (
        <>
        {formErrors.length > 0 && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                <ul className='list-disc pl-5'>
                    {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-6 bg-white p-6 rounded shadow-md'>
            <h2 className='text-xl font-bold'>Create Invoice</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                    type="text"
                    placeholder='Client Name'
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className='input'
                />
                <input
                    type="email"
                    placeholder='Client Email'
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className='input'
                />
                <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className='input'
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className='input'
                />
                <textarea 
                    placeholder='Additional Notes'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className='input w-full h-24'
                />
            </div>
            <div>
                <h3 className='font-semibold mb-2'>Line Items</h3>
                {items.map((item, index) => (
                    <div key={index} className='grid grid-cols-1 md:grid-cols-4 gap-3 mb-3'>
                        <input
                            type="text"
                            placeholder='Description'
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className='input'
                        />
                        <input
                            type="number"
                            placeholder='Quantity'
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className='input'
                        />
                        <input 
                            type='number'
                            placeholder='Rate'
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                            className='input'
                        />
                        <button 
                            type='button'
                            onClick={() => removeItem(index)}
                            className='bg-red-100 text-red-600 px-3 rounded hover:bg-red-200'
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className='mt-2 text-blue-600 hover:underline'
                >
                    + Add Item
                </button>
            </div>

            <div className='text-right font-semibold text-lg'>Subtotal: ₹{subtotal.toFixed(2)}</div>

            <button type="submit" className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                Create Invoice
            </button>
        </form>
        </>
    );
};

export default InvoiceForm;