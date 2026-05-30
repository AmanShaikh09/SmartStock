import React, { useState } from 'react';

const BulkQuantityModal = ({ isOpen, onClose, products, onSubmit, isLoading }) => {
    const [bulkInput, setBulkInput] = useState('');
    const [inputMethod, setInputMethod] = useState('csv'); // 'csv' or 'form'
    const [bulkItems, setBulkItems] = useState([]);
    const [formProduct, setFormProduct] = useState({ product_id: '', quantity: '' });
    const [errors, setErrors] = useState([]);

    const handleCsvInput = (value) => {
        setBulkInput(value);
        setErrors([]);
    };

    const parseCsvInput = () => {
        const lines = bulkInput
            .trim()
            .split('\n')
            .filter(line => line.trim());

        const newItems = [];
        const newErrors = [];

        lines.forEach((line, index) => {
            const parts = line.split(',').map(p => p.trim());
            
            if (parts.length < 2) {
                newErrors.push(`Line ${index + 1}: Invalid format. Use: Product Name, Quantity`);
                return;
            }

            const productName = parts[0];
            const quantity = parseInt(parts[1]);

            if (isNaN(quantity)) {
                newErrors.push(`Line ${index + 1}: Quantity must be a number`);
                return;
            }

            if (quantity < 0) {
                newErrors.push(`Line ${index + 1}: Quantity cannot be negative`);
                return;
            }

            // Find product by name
            const product = products.find(
                p => p.name?.toLowerCase() === productName.toLowerCase()
            );

            if (!product) {
                newErrors.push(`Line ${index + 1}: Product "${productName}" not found`);
                return;
            }

            newItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity: quantity,
                line: index + 1,
            });
        });

        if (newErrors.length > 0) {
            setErrors(newErrors);
        }

        setBulkItems(newItems);
        return newItems;
    };

    const handleAddItemForm = () => {
        setErrors([]);

        if (!formProduct.product_id) {
            setErrors(['Please select a product']);
            return;
        }

        const quantity = parseInt(formProduct.quantity);
        if (isNaN(quantity)) {
            setErrors(['Quantity must be a number']);
            return;
        }

        if (quantity < 0) {
            setErrors(['Quantity cannot be negative']);
            return;
        }

        const product = products.find(p => p.id === parseInt(formProduct.product_id));
        if (!product) {
            setErrors(['Product not found']);
            return;
        }

        // Check if product already in list
        if (bulkItems.some(item => item.product_id === product.id)) {
            setErrors([`${product.name} is already in the list`]);
            return;
        }

        setBulkItems([
            ...bulkItems,
            {
                product_id: product.id,
                product_name: product.name,
                quantity: quantity,
            },
        ]);

        setFormProduct({ product_id: '', quantity: '' });
    };

    const handleRemoveItem = (index) => {
        setBulkItems(bulkItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setErrors([]);

        if (inputMethod === 'csv' && bulkInput.trim()) {
            const items = parseCsvInput();
            if (items.length === 0) return;
            await onSubmit(items);
        } else if (bulkItems.length > 0) {
            await onSubmit(bulkItems);
        } else {
            setErrors(['Please add at least one product']);
        }
    };

    const handleClose = () => {
        setBulkInput('');
        setBulkItems([]);
        setFormProduct({ product_id: '', quantity: '' });
        setErrors([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>Bulk Update Quantities</h3>
                <p className="modal-subtitle">Update inventory quantities for multiple products at once</p>

                {/* Method Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '12px'
                }}>
                    <button
                        type="button"
                        onClick={() => {
                            setInputMethod('csv');
                            setBulkItems([]);
                            setFormProduct({ product_id: '', quantity: '' });
                        }}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            background: inputMethod === 'csv' ? 'var(--primary)' : 'transparent',
                            color: inputMethod === 'csv' ? 'white' : 'var(--text-secondary)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        📋 CSV Format
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setInputMethod('form');
                            setBulkInput('');
                        }}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            background: inputMethod === 'form' ? 'var(--primary)' : 'transparent',
                            color: inputMethod === 'form' ? 'white' : 'var(--text-secondary)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ➕ Form
                    </button>
                </div>

                {/* Error Messages */}
                {errors.length > 0 && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        border: '1px solid #fcc',
                        fontSize: '0.9rem'
                    }}>
                        {errors.map((err, idx) => (
                            <div key={idx}>✗ {err}</div>
                        ))}
                    </div>
                )}

                {/* CSV Method */}
                {inputMethod === 'csv' && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: '8px'
                        }}>
                            Paste Product Data (Format: Product Name, Quantity)
                        </label>
                        <textarea
                            value={bulkInput}
                            onChange={(e) => handleCsvInput(e.target.value)}
                            placeholder={'Example:\nAnker Bluetooth Headset, 50\nHP ZenBook, 30\nApple MacBook Air, 15'}
                            className="modal-input"
                            style={{
                                minHeight: '150px',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                padding: '12px',
                                marginBottom: '12px'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => parseCsvInput()}
                            className="btn btn-secondary"
                            style={{ marginBottom: '12px' }}
                        >
                            Parse & Preview
                        </button>
                    </div>
                )}

                {/* Form Method */}
                {inputMethod === 'form' && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        gap: '12px',
                        marginBottom: '20px'
                    }}>
                        <select
                            value={formProduct.product_id}
                            onChange={(e) => setFormProduct({ ...formProduct, product_id: e.target.value })}
                            className="modal-input"
                            style={{ marginBottom: 0 }}
                        >
                            <option value="">Select Product</option>
                            {products
                                .filter(p => !bulkItems.some(item => item.product_id === p.id))
                                .map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                        </select>
                        <input
                            type="number"
                            value={formProduct.quantity}
                            onChange={(e) => setFormProduct({ ...formProduct, quantity: e.target.value })}
                            placeholder="Quantity"
                            className="modal-input"
                            min="0"
                            style={{ marginBottom: 0, width: '100px' }}
                        />
                        <button
                            type="button"
                            onClick={handleAddItemForm}
                            className="btn btn-primary"
                            style={{ marginBottom: 0, padding: '8px 16px' }}
                        >
                            Add
                        </button>
                    </div>
                )}

                {/* Preview/List */}
                {bulkItems.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                            Items to Update ({bulkItems.length})
                        </h4>
                        <div style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            {bulkItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        borderBottom: idx < bulkItems.length - 1 ? '1px solid var(--border)' : 'none'
                                    }}
                                >
                                    <div>
                                        <strong>{item.product_name}</strong>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            Quantity: <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{item.quantity}</strong>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(idx)}
                                        className="btn btn-danger btn-sm"
                                        style={{ padding: '4px 12px' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border)'
                }}>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={isLoading || bulkItems.length === 0}
                    >
                        {isLoading ? 'Updating...' : 'Update All'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkQuantityModal;
