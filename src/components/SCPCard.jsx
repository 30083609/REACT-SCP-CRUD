// src/components/SCPCard.jsx

import React from 'react'
import { supabase } from '../supabaseClient'

/**
 * SCPCard component
 * Displays a single SCP entry with its details and provides
 * a delete button to remove the entry from the database.
 *
 * @param {object} props.data - The SCP entry data (scp_number, title, etc.)
 * @param {function} props.onUpdate - Callback to notify parent to refresh list
 */
const SCPCard = ({ data, onUpdate }) => {
  /**
   * handleDelete
   * Prompts user for confirmation, then deletes the SCP entry
   * from the Supabase table and calls onUpdate() to refresh.
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this SCP?')) return
    // Perform deletion in Supabase
    await supabase
      .from('scp_crud')     // table name must match exactly
      .delete()
      .eq('id', data.id)
    // Notify parent to reload data
    onUpdate()
  }

  return (
    <div className="scp-card">
      {/* Display SCP number and title */}
      <h2>
        {data.scp_number}: {data.title}
      </h2>
      {/* Display object class */}
      <p><strong>Class:</strong> {data.object_class}</p>
      {/* Display description */}
      <p>{data.description}</p>
      {/* Display procedures */}
      <p><em>{data.procedures}</em></p>
      {/* If an image URL is provided, render the image */}
      {data.image_url && (
        <img
          src={data.image_url}
          alt={data.title}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      )}
      {/* Delete button */}
      <button onClick={handleDelete}>
        Delete
      </button>
    </div>
  )
}

export default SCPCard
