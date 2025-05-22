import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './styles.css';

const Delete = () => {
  const [scps,        setScps]        = useState([]);     // list of SCP entries
  const [loading,     setLoading]     = useState(true);   // loading indicator
  const [deletingId,  setDeletingId]  = useState(null);   // ID of entry being deleted

  // fetchSCPs: load all entries from the 'scp_crud' table
  const fetchSCPs = async () => {
    setLoading(true);                                 // show loading state
    const { data, error } = await supabase            // query Supabase
      .from('scp_crud')                               //  ↳ from scp_crud table
      .select('*')                                    //  ↳ select all columns
      .order('scp_number', { ascending: true });      //  ↳ sort by SCP number

    if (error) {
      console.error('Error loading SCPs:', error);    // log any fetch error
      setScps([]);                                    // clear on failure
    } else {
      setScps(data);                                  // populate state with fetched data
    }
    setLoading(false);                                // hide loading state
  };

  // on mount, load the SCP list once
  useEffect(() => {
    fetchSCPs();
  }, []);

  // handleDelete: remove a single SCP entry by ID
  const handleDelete = async (scp) => {
    // confirm with the user before deleting
    if (!window.confirm(`Really delete ${scp.scp_number}: ${scp.title}?`)) return;

    setDeletingId(scp.id);                            // disable this button while deleting
    const { error } = await supabase                  // send delete request
      .from('scp_crud')                               //  ↳ target scp_crud table
      .delete()                                       //  ↳ delete operation
      .eq('id', scp.id);                              //  ↳ where id matches

    if (error) {
      console.error('Delete error:', error);          // log any delete error
      alert('Failed to delete, see console.');
    } else {
      await fetchSCPs();                              // refresh list after successful delete
    }
    setDeletingId(null);                              // re-enable buttons
  };

  if (loading) {
    return <p className="empty-msg">Loading SCP entries…</p>;  // show while fetching
  }
  if (scps.length === 0) {
    return <p className="empty-msg">No entries to delete.</p>; // show if none
  }

  return (
    <div className="delete-grid">
      {scps.map((scp) => (
        <div key={scp.id} className="delete-card">
          <h3>
            {scp.scp_number}: {scp.title}
          </h3>
          <button
            className="delete-btn"
            onClick={() => handleDelete(scp)}          // call delete handler on click
            disabled={deletingId === scp.id}           // disable while this ID is deleting
          >
            {deletingId === scp.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Delete;
