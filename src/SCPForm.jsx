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

  // handleChange: update text inputs or capture selected file into state
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image_file') {
      setFormData(f => ({ ...f, image_file: files[0] }))    // store file object
    } else {
      setFormData(f => ({ ...f, [name]: value }))          // update field value
    }
  }

  // Cloudinary credentials from environment
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  // uploadImageToCloudinary: POST the file to Cloudinary and return its URL
  const uploadImageToCloudinary = async (file) => {
    const url  = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    const res  = await fetch(url, { method: 'POST', body: form })
    const data = await res.json()
    return data.secure_url   // URL to stored image
  }

  // handleSubmit: confirm action, upload image if any, then insert or update via Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()
    const confirmMsg = editData
      ? 'Update this SCP entry?'
      : 'Create new SCP entry?'
    if (!window.confirm(confirmMsg)) return  // abort if cancelled

    // determine image URL: reuse old or upload new
    let imageUrl = editData?.image_url || ''
    if (formData.image_file) {
      imageUrl = await uploadImageToCloudinary(formData.image_file)
    }

    // build payload for DB
    const payload = {
      scp_number:   formData.scp_number,
      title:        formData.title,
      object_class: formData.object_class,
      description:  formData.description,
      procedures:   formData.procedures,
      image_url:    imageUrl,
      updated_at:   new Date().toISOString(),
      created_at:   editData ? editData.created_at : new Date().toISOString(),
    }

    if (editData) {
      // Supabase update call
      await supabase
        .from('scp_crud')
        .update(payload)
        .eq('id', editData.id)             // delete where id matches
    } else {
      // Supabase insert call
      await supabase
        .from('scp_crud')
        .insert([payload])                 // insert new record
    }

    // clear form state and notify parent
    setFormData({
      scp_number: '',
      title: '',
      object_class: '',
      description: '',
      procedures: '',
      image_file: null,
    })
    onSubmit()                             // e.g. close form or refresh list
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
            onChange={handleChange}         // update scp_number in state
            required
          />
          <input
            className="form-field"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}         // update title in state
            required
          />
          <input
            className="form-field"
            type="text"
            name="object_class"
            placeholder="Object Class"
            value={formData.object_class}
            onChange={handleChange}         // update object_class in state
            required
          />
        </div>

        <textarea
          className="form-field"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}           // update description in state
          required
        />

        <textarea
          className="form-field"
          name="procedures"
          placeholder="Procedures"
          value={formData.procedures}
          onChange={handleChange}           // update procedures in state
          required
        />

        <input
          className="form-field"
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}           // capture image file in state
        />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editData ? 'Update SCP' : 'Add SCP'}
          </button>
          {goBack && (
            <button
              type="button"
              className="cancel-btn"
              onClick={goBack}               // cancel: return to previous view
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
