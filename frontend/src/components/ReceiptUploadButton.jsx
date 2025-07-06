// ReceiptUploadButton.jsx - Button and modal for uploading receipt images or PDFs
// Handles file selection, upload, and displays result or error

import React, { useRef, useState } from 'react';
import axios from '../utils/axios';
import './ReceiptUploadButton.css';

const ReceiptUploadButton = () => {
  // State for modal open/close, file, loading, result, and error
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInput = useRef();

  // Open modal and reset state
  const handleOpen = () => {
    setOpen(true);
    setResult(null);
    setError(null);
    setFile(null);
  };
  // Close modal and reset state
  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setResult(null);
    setError(null);
  };
  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };
  // Handle file upload to backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append('receipt', file);
    try {
      const res = await axios.post('/receipt/receipt-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      // Notify app that a new transaction was added
      window.dispatchEvent(new Event('transactionAdded'));
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open upload modal */}
      <button className="upload-btn" onClick={handleOpen}>Upload Receipt</button>
      {open && (
        <div className="receipt-modal-overlay" onClick={handleClose}>
          <div className="receipt-modal" onClick={e => e.stopPropagation()}>
            <button className="receipt-modal-close" onClick={handleClose}>&times;</button>
            <h2>Upload Receipt</h2>
            {/* Upload form */}
            <form onSubmit={handleUpload}>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
              <button type="submit" disabled={loading || !file}>
                {loading ? (
                  <span className="spinner" />
                ) : 'Upload'}
              </button>
            </form>
            {loading && (
              <div className="upload-status" style={{marginTop: 10}}>
                Uploading and processing receipt...
              </div>
            )}
            {result && (
              <div className="upload-status success" style={{ width: '100%' }}>
                <span>Upload successful!</span>
                <div className="receipt-result-details" style={{ marginTop: 12, background: '#181818', color: '#fff', padding: 14, borderRadius: 6, overflowX: 'auto', maxHeight: 400, fontSize: '1rem', lineHeight: 1.6 }}>
                  {Array.isArray(result)
                    ? result.map((tx, idx) => (
                        <div key={idx} style={{ marginBottom: 18, borderBottom: '1px solid #333', paddingBottom: 10 }}>
                          <div><b>Type:</b> {tx.type}</div>
                          <div><b>Amount:</b> {tx.amount} {tx.currency || ''}</div>
                          <div><b>Date:</b> {tx.date ? new Date(tx.date).toLocaleDateString() : ''}</div>
                          {tx.category && <div><b>Category:</b> {tx.category}</div>}
                          {tx.subcategory && <div><b>Subcategory:</b> {tx.subcategory}</div>}
                          {tx.description && <div><b>Description:</b> {tx.description}</div>}
                          {tx.paymentMethod && <div><b>Payment Method:</b> {tx.paymentMethod}</div>}
                          {tx.tags && tx.tags.length > 0 && <div><b>Tags:</b> {tx.tags.join(', ')}</div>}
                          {tx.status && <div><b>Status:</b> {tx.status}</div>}
                          {tx.metadata && tx.metadata.ocrPage && <div><b>Page:</b> {tx.metadata.ocrPage}</div>}
                        </div>
                      ))
                    : (
                        <div>
                          <div><b>Type:</b> {result.type}</div>
                          <div><b>Amount:</b> {result.amount} {result.currency || ''}</div>
                          <div><b>Date:</b> {result.date ? new Date(result.date).toLocaleDateString() : ''}</div>
                          {result.category && <div><b>Category:</b> {result.category}</div>}
                          {result.subcategory && <div><b>Subcategory:</b> {result.subcategory}</div>}
                          {result.description && <div><b>Description:</b> {result.description}</div>}
                          {result.paymentMethod && <div><b>Payment Method:</b> {result.paymentMethod}</div>}
                          {result.tags && result.tags.length > 0 && <div><b>Tags:</b> {result.tags.join(', ')}</div>}
                          {result.status && <div><b>Status:</b> {result.status}</div>}
                          {result.metadata && result.metadata.ocrPage && <div><b>Page:</b> {result.metadata.ocrPage}</div>}
                        </div>
                      )}
                </div>
              </div>
            )}
            {error && <div className="upload-status error">{error}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptUploadButton;
