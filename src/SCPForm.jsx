// src/components/SCPForm.jsx
import React, { useState } from 'react'
import { supabase } from './supabaseClient.js'

const SCPForm = ({ onSubmit, editData = null, goBack }) => {
  const [formData, setFormData] = useState(editData || {
    scp_number: '',
    title: '',
    object_class: '',
    description: '',
    procedures: '',
    image_file: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image_file') {
      setFormData(f => ({ ...f, image_file: files[0] }))
    } else {
      setFormData(f => ({ ...f, [name]: value }))
    }
  }

  // read from your .env via Vite
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const uploadImageToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    const res  = await fetch(url, { method: 'POST', body: form })
    const data = await res.json()
    return data.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const confirmMsg = editData
      ? 'Update this SCP entry?'
      : 'Create new SCP entry?'
    if (!window.confirm(confirmMsg)) return

    // upload if needed
    let imageUrl = editData?.image_url || ''
    if (formData.image_file) {
      imageUrl = await uploadImageToCloudinary(formData.image_file)
    }

    const payload = {
      scp_number:  formData.scp_number,
      title:       formData.title,
      object_class: formData.object_class,
      description:  formData.description,
      procedures:   formData.procedures,
      image_url:    imageUrl,
      updated_at:   new Date().toISOString(),
      created_at:   editData
        ? editData.created_at
        : new Date().toISOString(),
    }

    // **use the exact table slug** (all lowercase, underscore)
    if (editData) {
      await supabase
        .from('scp_crud')
        .update(payload)
        .eq('id', editData.id)
    } else {
      await supabase
        .from('scp_crud')
        .insert([payload])
    }

    // reset + notify parent
    setFormData({
      scp_number: '',
      title: '',
      object_class: '',
      description: '',
      procedures: '',
      image_file: null,
    })
    onSubmit()
  }

  return (
    <div className="create-wrapper">
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-row-1">
          <input
            className="form-field"
            type="text"
            name="scp_number"
            placeholder="SCP Number"
            value={formData.scp_number}
            onChange={handleChange}
            required
          />
          <input
            className="form-field"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            className="form-field"
            type="text"
            name="object_class"
            placeholder="Object Class"
            value={formData.object_class}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          className="form-field"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-field"
          name="procedures"
          placeholder="Procedures"
          value={formData.procedures}
          onChange={handleChange}
          required
        />

        <input
          className="form-field"
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editData ? 'Update SCP' : 'Add SCP'}
          </button>
          {goBack && (
            <button
              type="button"
              className="cancel-btn"
              onClick={goBack}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SCPForm
