import React, { useState } from 'react';
import axios from '../utils/axios';

const ReceiptUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      console.log('Upload success:', res.data);
      // Dispatch event for dashboard refresh
      window.dispatchEvent(new Event('transactionAdded'));
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error('Upload failed:', err.response?.data || err);
    } finally {
      setLoading(false);
      console.log('Upload finished');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: 'var(--card-bg)', borderRadius: 8 }}>
      <h2>Upload Receipt</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        <button type="submit" disabled={loading || !file} style={{ marginTop: 12 }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {result && (
        <pre style={{ marginTop: 16, background: '#222', color: '#fff', padding: 12, borderRadius: 4, overflowX: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default ReceiptUpload;
