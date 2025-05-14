import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../styles.css'

const SCPForm = ({ onSubmit, editData = null }) => {
  const [formData, setFormData] = useState(
    editData || {
      scp_number: '',
      title: '',
      object_class: '',
      description: '',
      procedures: '',
      image_file: null
    }
  )

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image_file') {
      setFormData((prev) => ({ ...prev, image_file: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const uploadImageToCloudinary = async (file) => {
    const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const url          = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    const res  = await fetch(url, { method: 'POST', body: form })
    const json = await res.json()
    return json.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirmMsg = editData
      ? 'Update this SCP entry?'
      : 'Create new SCP entry?'

    if (!window.confirm(confirmMsg)) return

    // 1) upload image if needed
    let imageUrl = editData?.image_url || ''
    if (formData.image_file) {
      imageUrl = await uploadImageToCloudinary(formData.image_file)
    }

    // 2) build your payload
    const payload = {
      scp_number:   formData.scp_number,
      title:        formData.title,
      object_class: formData.object_class,
      description:  formData.description,
      procedures:   formData.procedures,
      image_url:    imageUrl,
      // created_at only on new, updated_at on both
      ...(editData
        ? { updated_at: new Date().toISOString() }
        : { created_at: new Date().toISOString() }
      )
    }

    // 3) insert or update
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

    // 4) reset & notify parent
    setFormData({
      scp_number:   '',
      title:        '',
      object_class: '',
      description:  '',
      procedures:   '',
      image_file:   null
    })
    onSubmit()
  }

  return (
    <div className="create-wrapper">
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-row-1">
          <input
            type="text"
            name="scp_number"
            placeholder="SCP Number"
            value={formData.scp_number}
            onChange={handleChange}
            className="form-field"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="form-field"
            required
          />
          <input
            type="text"
            name="object_class"
            placeholder="Object Class"
            value={formData.object_class}
            onChange={handleChange}
            className="form-field"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="form-field create-textarea"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <textarea
          name="procedures"
          placeholder="Procedures"
          className="form-field create-textarea"
          value={formData.procedures}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}
          className="form-field file-upload"
        />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editData ? 'Update SCP' : 'Add SCP'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SCPForm
