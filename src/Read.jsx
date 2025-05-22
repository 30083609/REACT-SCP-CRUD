import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './styles.css';

const Read = () => {
  const [scps,           setScps]        = useState([]);    // holds fetched SCP entries
  const [loading,        setLoading]     = useState(true);  // loading state
  const [selectedSCP,    setSelectedSCP] = useState(null);  // currently opened entry

  // fetchData: load all entries from the 'scp_crud' table in Supabase
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scp_crud')  // target the scp_crud table
      .select('*');      // select all fields

    if (error) {
      console.error('❌ Error fetching SCPs:', error);
      setScps([]);
    } else {
      // sort by the numeric part of scp_number before setting state
      const sorted = data.sort((a, b) => {
        const numA = parseInt(a.scp_number.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(b.scp_number.match(/\d+/)?.[0] || '0', 10);
        return numA - numB;
      });
      setScps(sorted);
    }
    setLoading(false);
  };

  // on mount, fetch all SCP entries once
  useEffect(() => {
    fetchData();
  }, []);

  // openModal: show details for the clicked SCP
  const openModal = (scp) => setSelectedSCP(scp);

  // closeModal: hide the modal
  const closeModal = () => setSelectedSCP(null);

  // handlePrev: navigate to the previous SCP in the list
  const handlePrev = () => {
    const idx = scps.findIndex((s) => s.id === selectedSCP.id);
    const prev = (idx - 1 + scps.length) % scps.length;
    setSelectedSCP(scps[prev]);
  };

  // handleNext: navigate to the next SCP in the list
  const handleNext = () => {
    const idx = scps.findIndex((s) => s.id === selectedSCP.id);
    const next = (idx + 1) % scps.length;
    setSelectedSCP(scps[next]);
  };

  if (loading) {
    return <p className="empty-msg">Loading entries…</p>;  // show while fetching
  }
  if (scps.length === 0) {
    return <p className="empty-msg">No entries found.</p>; // show if table empty
  }

  return (
    <div id="Read" className="tabcontent active">
      <h2 className="scp-title">Stored SCP Entries</h2>

      <div className="card-grid">
        {scps.map((scp) => (
          <div
            key={scp.id}
            className="scp-card"
            onClick={() => openModal(scp)}  // when clicked, open detail modal
          >
            <h3>{scp.scp_number}</h3>
            {scp.image_url && (
              <img
                src={scp.image_url}
                alt={`Image for ${scp.scp_number}`}
                className="scp-image"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {selectedSCP && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>

            <div className="modal-inner-box">
              <h2>
                {selectedSCP.scp_number}: {selectedSCP.title}
              </h2>
              <p>
                <strong>Object Class:</strong> {selectedSCP.object_class}
              </p>
              <p>
                <strong>Description:</strong> {selectedSCP.description}
              </p>
              <p>
                <strong>Procedures:</strong> {selectedSCP.procedures}
              </p>
              {selectedSCP.image_url && (
                <img
                  src={selectedSCP.image_url}
                  alt={`Image for ${selectedSCP.scp_number}`}
                  className="scp-image-modal"
                />
              )}
            </div>

            <div className="arrow-buttons">
              <button
                className="arrow-text-button"
                onClick={handlePrev}    // go to previous SCP
              >
                &larr; Previous
              </button>
              <button
                className="arrow-text-button"
                onClick={handleNext}    // go to next SCP
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Read;
