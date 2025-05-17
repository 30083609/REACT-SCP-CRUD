// src/Delete.jsx

import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './styles.css'

/**
 * Delete component
 * Lists all SCP entries and allows deleting any of them.
 */
const Delete = () => {
  // scps: array of all entries
  // loading: whether data is being fetched
  // deletingId: id of the SCP currently being deleted (to disable its button)
  const [scps,       setScps]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  /**
   * fetchSCPs
   * Retrieves all SCP entries from Supabase, sorted by scp_number.
   * Sets loading state, then stores data or logs an error.
   */
  const fetchSCPs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('scp_crud')
      .select('*')
      .order('scp_number', { ascending: true })

    if (error) {
      console.error('❌ Error loading SCPs:', error)
      setScps([])
    } else {
      setScps(data)
    }
    setLoading(false)
  }

  // On component mount, fetch the list of SCPs:
  useEffect(() => {
    fetchSCPs()
  }, [])

  /**
   * handleDelete
   * Prompt user for confirmation, then deletes the selected SCP.
   * After deletion, re-fetches the list to refresh the UI.
   *
   * @param {Object} scp – the SCP record to delete
   */
  const handleDelete = async (scp) => {
    if (!window.confirm(`Really delete ${scp.scp_number}: ${scp.title}?`)) {
      return
    }

    // disable this SCP's delete button
    setDeletingId(scp.id)

    const { error } = await supabase
      .from('scp_crud')
      .delete()
      .eq('id', scp.id)

    if (error) {
      console.error('❌ Delete error:', error)
      alert('Failed to delete, please check console.')
    } else {
      // refresh list on successful delete
      await fetchSCPs()
    }

    setDeletingId(null)
  }

  // Show loading or empty messages if needed
  if (loading) {
    return <p className="empty-msg">Loading SCP entries…</p>
  }
  if (scps.length === 0) {
    return <p className="empty-msg">No entries to delete.</p>
  }

  // Render grid of delete cards
  return (
    <div className="delete-grid">
      {scps.map((scp) => (
        <div key={scp.id} className="delete-card">
          {/* SCP header */}
          <h3>{scp.scp_number}: {scp.title}</h3>

          {/* Delete button: disabled while this SCP is being deleted */}
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
  )
}

export default Delete
