import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const SCPCard = ({ data, onUpdate }) => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...data })

  const handleDelete = async () => {
    if (!window.confirm('Delete this SCP entry?')) return

    const { error } = await supabase.from('SCP-CRUD').delete().eq('id', data.id)
    if (error) {
      console.error('Delete error:', error)
    } else {
      onUpdate()
    }
  }

  const handleUpdate = async () => {
    if (!window.confirm('Apply updates to this SCP?')) return

    const { error } = await supabase.from('SCP-CRUD').update(form).eq('id', data.id)
    if (error) {
      console.error('Update error:', error)
    } else {
      setEditing(false)
      onUpdate()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="scp-entry">
      {editing ? (
        <>
          <input name="scp_number" value={form.scp_number} onChange={handleChange} />
          <input name="title" value={form.title} onChange={handleChange} />
          <input name="object_class" value={form.object_class} onChange={handleChange} />
          <textarea name="description" value={form.description} onChange={handleChange} />
          <textarea name="procedures" value={form.procedures} onChange={handleChange} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{data.scp_number} - {data.title}</h2>
          <p><strong>Class:</strong> {data.object_class}</p>
          <p><strong>Description:</strong> {data.description}</p>
          <p><strong>Procedures:</strong> {data.procedures}</p>
          {data.image_url && <img src={data.image_url} className="scp-image" alt="SCP Visual" />}
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  )
}

export default SCPCard
