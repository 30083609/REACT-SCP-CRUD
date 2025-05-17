import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import SCPForm from './SCPForm';

const Update = ({ goBack }) => {
  const [scps, setScps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  // Fetch SCPs from Supabase
  const fetchScps = async () => {
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
    fetchScps();
  }, []);

  const handleEdit = (scp) => {
    setEditData({
      ...scp,
      image_file: null,
      image_url: scp.image_url
    });
  };

   const handleSubmit = () => {
    setEditData(null);
    fetchScps();
  };

  const handleCancel = () => {
    setEditData(null);
  };

  if (editData) {
    return (
      <div className="tabcontent active">
        <button className="back-btn" onClick={handleCancel}>
          ← Back to List
        </button>
        <SCPForm
          editData={editData}
          onSubmit={handleSubmit}
          goBack={handleCancel}
        />
      </div>
    );
  }

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
                onClick={() => handleEdit(scp)}
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
