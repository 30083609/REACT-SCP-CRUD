import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import SCPForm from './SCPForm';

const Update = ({ goBack }) => {
  const [scps,     setScps]     = useState([]);   // list of entries for selection
  const [loading,  setLoading]  = useState(true); // loading indicator
  const [editData, setEditData] = useState(null); // data for the entry being edited

  // fetchScps: load all SCP records from Supabase, sorted by scp_number
  const fetchScps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scp_crud')                      // DB interaction: select from table
      .select('*')                           // retrieve all columns
      .order('scp_number', { ascending: true }); // sort by SCP number

    if (error) {
      console.error('Error loading SCPs:', error);
      setScps([]);                           // clear list on error
    } else {
      setScps(data);                         // populate state with fetched data
    }
    setLoading(false);
  };

  // on mount: fetch the list once
  useEffect(() => {
    fetchScps();
  }, []);

  // handleEdit: prepare selected SCP for editing in the form
  const handleEdit = (scp) => {
    setEditData({
      ...scp,
      image_file: null,       // reset file input
      image_url: scp.image_url
    });
  };

  // handleSubmit: after form submission, clear editData and refresh list
  const handleSubmit = () => {
    setEditData(null);
    fetchScps();              // reload updated data from DB
  };

  // handleCancel: cancel editing and return to selection list
  const handleCancel = () => {
    setEditData(null);
  };

  // if in edit mode, show the SCPForm with preloaded data
  if (editData) {
    return (
      <div className="tabcontent active">
        <button className="back-btn" onClick={handleCancel}>
          ← Back to List
        </button>
        <SCPForm
          editData={editData}   // pass current entry to form for editing
          onSubmit={handleSubmit} 
          goBack={handleCancel} // allow form to cancel
        />
      </div>
    );
  }

  // default view: show grid of entries to choose from
  return (
    <div id="Update" className="tabcontent active">
      <h2 className="scp-title">Select an SCP to Update</h2>

      {loading ? (
        <p className="empty-msg">Loading entries…</p>
      ) : scps.length === 0 ? (
        <p className="empty-msg">No SCP entries found.</p>
      ) : (
        <div className="card-grid">
          {scps.map((scp) => (
            <div key={scp.id} className="scp-card">
              <h3>{scp.scp_number}</h3>
              {scp.image_url && (
                <img
                  src={scp.image_url}
                  alt={scp.scp_number}
                  className="scp-image"
                  loading="lazy"
                />
              )}
              <button
                className="submit-btn"
                style={{ marginTop: '0.5rem' }}
                onClick={() => handleEdit(scp)} // enter edit mode for this SCP
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={goBack}>
        ← Main Menu
      </button>
    </div>
  );
};

export default Update;
