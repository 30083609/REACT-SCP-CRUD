import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const SCPForm = ({ onSubmit }) => {
  const [scpNumber, setScpNumber] = useState('')
  const [title, setTitle] = useState('')
  const [objectClass, setObjectClass] = useState('')
  const [description, setDescription] = useState('')
  const [procedures, setProcedures] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const handleImageUpload = async () => {
    if (!imageFile) return ''
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'unsigned') // your Cloudinary preset

    const res = await fetch('https://api.cloudinary.com/v1_1/dfo9ahmct/image/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    return data.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!window.confirm('Are you sure you want to create this SCP?')) return

    const image_url = await handleImageUpload()

    const { error } = await supabase.from('SCP-CRUD').insert({
      scp_number: scpNumber,
      title,
      object_class: objectClass,
      description,
      procedures,
      image_url,
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error('Insert error:', error)
    } else {
      setScpNumber('')
      setTitle('')
      setObjectClass('')
      setDescription('')
      setProcedures('')
      setImageFile(null)
      onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="SCP Number" value={scpNumber} onChange={e => setScpNumber(e.target.value)} required />
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input type="text" placeholder="Object Class" value={objectClass} onChange={e => setObjectClass(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <textarea placeholder="Procedures" value={procedures} onChange={e => setProcedures(e.target.value)} required />
      <input type="file" onChange={e => setImageFile(e.target.files[0])} />
      <button type="submit">Add SCP</button>
    </form>
  )
}

export default SCPForm
