import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './styles.css';

const Delete = () => {
  const [scps,        setScps]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [deletingId,  setDeletingId]  = useState(null);

  // fetch all entries
  const fetchSCPs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scp_crud')
      .select('*')
      .order('scp_number', { ascending: true });
    if (error) {
      console.error('Error loading SCPs:', error);
      setScps([]);
    } else {
      setScps(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSCPs();
  }, []);

  const handleDelete = async (scp) => {
    if (!window.confirm(`Really delete ${scp.scp_number}: ${scp.title}?`)) return;
    setDeletingId(scp.id);
    const { error } = await supabase
      .from('scp_crud')
      .delete()
      .eq('id', scp.id);
    if (error) {
      console.error('Delete error:', error);
      alert('Failed to delete, see console.');
    } else {
      await fetchSCPs();
    }
    setDeletingId(null);
  };

  if (loading) {
    return <p className="empty-msg">Loading SCP entries…</p>;
  }
  if (scps.length === 0) {
    return <p className="empty-msg">No entries to delete.</p>;
  }

  return (
    <div className="delete-grid">
      {scps.map((scp) => (
        <div key={scp.id} className="delete-card">
          <h3>{scp.scp_number}: {scp.title}</h3>
          <button
            className="delete-btn"
            onClick={() => handleDelete(scp)}
            disabled={deletingId === scp.id}
          >
            {deletingId === scp.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Delete;
