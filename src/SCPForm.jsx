import React, { useState } from 'react'
import { supabase } from './supabaseClient.js'

const SCPForm = ({ onSubmit, editData = null, goBack }) => {
  // formData stores the values of all form fields
  const [formData, setFormData] = useState(
    editData || {
      scp_number:   '',
      title:        '',
      object_class: '',
      description:  '',
      procedures:   '',
      image_file:   null,
    }
  )


  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'image_file') {
      setFormData(f => ({ ...f, image_file: files[0] }))
    } else {
      setFormData(f => ({ ...f, [name]: value }))
    }
  }

  // Read Cloudinary credentials from Vite’s environment variables
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  /*
  Sends the selected image file to Cloudinary and returns its URL.
  */
  const uploadImageToCloudinary = async (file) => {
    const url  = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    const res  = await fetch(url, { method: 'POST', body: form })
    const data = await res.json()
    return data.secure_url
  }

  /**
   * handleSubmit
   * Validates and confirms with the user, uploads the image if provided,
   * builds the payload, then inserts or updates the SCP entry in Supabase.
   * Finally resets the form and notifies the parent via onSubmit().
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirmMsg = editData
      ? 'Update this SCP entry?'
      : 'Create new SCP entry?'
    if (!window.confirm(confirmMsg)) return

    // If editing, preserve existing image URL; otherwise start with empty
    let imageUrl = editData?.image_url || ''
    if (formData.image_file) {
      imageUrl = await uploadImageToCloudinary(formData.image_file)
    }

    // Build the record payload
    const payload = {
      scp_number:   formData.scp_number,
      title:        formData.title,
      object_class: formData.object_class,
      description:  formData.description,
      procedures:   formData.procedures,
      image_url:    imageUrl,
      // set timestamps appropriately
      updated_at:   new Date().toISOString(),
      created_at:   editData
        ? editData.created_at
        : new Date().toISOString(),
    }

    // Insert or update via Supabase
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

    // Reset form and notify parent
    setFormData({
      scp_number:   '',
      title:        '',
      object_class: '',
      description:  '',
      procedures:   '',
      image_file:   null,
    })
    onSubmit()
  }

  return (
    <div className="create-wrapper">
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-row-1">
          {/* SCP Number field */}
          <input
            className="form-field"
            type="text"
            name="scp_number"
            placeholder="SCP Number"
            value={formData.scp_number}
            onChange={handleChange}
            required
          />
          {/* Title field */}
          <input
            className="form-field"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {/* Object Class field */}
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

        {/* Description textarea */}
        <textarea
          className="form-field create-textarea"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Procedures textarea */}
        <textarea
          className="form-field create-textarea"
          name="procedures"
          placeholder="Procedures"
          value={formData.procedures}
          onChange={handleChange}
          required
        />

        {/* Image file upload */}
        <input
          className="form-field file-upload"
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}
        />

        {/* Submit & optional Cancel */}
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
