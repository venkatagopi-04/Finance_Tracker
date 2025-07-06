import React, { useState } from 'react';
import axios from '../utils/axios';
import ReceiptTransactionsTable from '../components/ReceiptTransactionsTable';
import './ReceiptUpload.css';

const ReceiptUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [receiptTransactions, setReceiptTransactions] = useState([]);

  // Fetch all previous receipt-uploaded transactions on mount
  React.useEffect(() => {
    const fetchReceiptTransactions = async () => {
      try {
        const res = await axios.get('/transactions');
        // Only show transactions with source === 'receipt'
        let txns = Array.isArray(res.data) ? res.data : [res.data];
        txns = txns.filter(tx => tx && tx.source === 'receipt');
        setReceiptTransactions(txns);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchReceiptTransactions();
    // Listen for transactionAdded event to refresh list
    const handler = () => fetchReceiptTransactions();
    window.addEventListener('transactionAdded', handler);
    return () => window.removeEventListener('transactionAdded', handler);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
    console.log('File selected:', e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log('No file selected');
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append('receipt', file);
    console.log('Uploading file...');
    try {
      const res = await axios.post('/receipt/receipt-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      // After upload, trigger refresh via event
      window.dispatchEvent(new Event('transactionAdded'));
      console.log('Upload success:', res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error('Upload failed:', err.response?.data || err);
    } finally {
      setLoading(false);
      console.log('Upload finished');
    }
  };

  return (
    <div className="receipt-upload-container">
      <h2>Upload Receipt</h2>
      <form className="receipt-upload-form" onSubmit={handleUpload}>
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <div className="receipt-upload-error">{error}</div>}
      {receiptTransactions.length > 0 && (
        <ReceiptTransactionsTable transactions={receiptTransactions} />
      )}
    </div>
  );
};

export default ReceiptUpload;
