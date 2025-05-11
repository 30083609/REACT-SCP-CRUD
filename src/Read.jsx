// Read.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './styles.css';

const Read = () => {
  const [scps, setScps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSCP, setSelectedSCP] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('scp_crud').select('*');
      if (error) {
        console.error('❌ Error fetching SCPs:', error);
        setScps([]);
      } else {
        const sorted = data.sort((a, b) => {
          const numA = parseInt(a.scp_number.match(/\d+/)?.[0] || '0', 10);
          const numB = parseInt(b.scp_number.match(/\d+/)?.[0] || '0', 10);
          return numA - numB;
        });
        setScps(sorted);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const openModal = (scp) => setSelectedSCP(scp);
  const closeModal = () => setSelectedSCP(null);

  const handlePrev = () => {
    const idx = scps.findIndex((s) => s.id === selectedSCP.id);
    const prev = (idx - 1 + scps.length) % scps.length;
    setSelectedSCP(scps[prev]);
  };

  const handleNext = () => {
    const idx = scps.findIndex((s) => s.id === selectedSCP.id);
    const next = (idx + 1) % scps.length;
    setSelectedSCP(scps[next]);
  };

  return (
    <div id="Read" className="tabcontent active">
      <h2 className="scp-title">Stored SCP Entries</h2>

      {loading ? (
        <p className="empty-msg">Loading entries...</p>
      ) : scps.length === 0 ? (
        <p className="empty-msg">No SCP entries found.</p>
      ) : (
        <div className="card-grid">
          {scps.map((scp) => (
            <div
              key={scp.id}
              className="scp-card"
              onClick={() => openModal(scp)}
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
      )}

      {selectedSCP && (
        <div className="modal active" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close icon */}
            <span className="close" onClick={closeModal}>
              &times;
            </span>

            {/* Scrollable content */}
            <div className="modal-inner-box">
              <h2>
                {selectedSCP.scp_number}: {selectedSCP.title}
              </h2>
              <p>
                <strong>Object Class:</strong>{' '}
                {selectedSCP.object_class}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedSCP.description}
              </p>
              <p>
                <strong>Procedures:</strong>{' '}
                {selectedSCP.procedures}
              </p>

              {selectedSCP.image_url && (
                <img
                  src={selectedSCP.image_url}
                  alt={`Image for ${selectedSCP.scp_number}`}
                  className="scp-image-modal"
                />
              )}
            </div>

            {/* Fixed footer with arrows */}
            <div className="arrow-buttons">
              <button
                className="arrow-text-button"
                onClick={handlePrev}
              >
                &larr; Previous
              </button>
              <button
                className="arrow-text-button"
                onClick={handleNext}
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
