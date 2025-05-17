
import React from 'react'
import { supabase } from '../supabaseClient'

const SCPCard = ({ data, onUpdate }) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this SCP?')) return
    await supabase.from('SCP-CRUD').delete().eq('id', data.id)
    onUpdate()
  }

  return (
    <div className="scp-card">
      <h2>{data.scp_number}: {data.title}</h2>
      <p><strong>Class:</strong> {data.object_class}</p>
      <p>{data.description}</p>
      <p><em>{data.procedures}</em></p>
      {data.image_url && <img src={data.image_url} alt={data.title} style={{ width: '100%', maxWidth: '300px' }} />}
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

export default SCPCard
