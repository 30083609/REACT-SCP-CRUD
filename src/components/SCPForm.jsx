// src/components/SCPForm.jsx

import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../styles.css'

/**
 * SCPForm component
 * Used for both creating new SCP entries and editing existing ones.
 *
 * Props:
 *  - onSubmit: callback fired after successful create/update
 *  - editData: (optional) existing SCP record to pre-fill form for editing
 */
const SCPForm = ({ onSubmit, editData = null }) => {
  // formData holds all field values, image_file is a File object if selected
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

  /**
   * handleChange
   * Updates formData state when user types into inputs or selects a file.
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image_file') {
      // when the file input changes, store the File object
      setFormData((prev) => ({ ...prev, image_file: files[0] }))
    } else {
      // for text inputs and textareas, store the typed value
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  /**
   * uploadImageToCloudinary
   * Given a File, uploads it to Cloudinary using your unsigned preset,
   * and returns the resulting secure_url.
   */
  const uploadImageToCloudinary = async (file) => {
    // read credentials from Vite env vars
    const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const url          = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    // build multipart/form-data body
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    // send to Cloudinary
    const res  = await fetch(url, { method: 'POST', body: form })
    const json = await res.json()
    return json.secure_url
  }

  /**
   * handleSubmit
   * Triggered when user submits the form.
   * - Confirms action
   * - Uploads image if provided
   * - Builds payload with timestamps
   * - Inserts or updates the supabase table
   * - Resets form and notifies parent via onSubmit()
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // ask user to confirm create vs update
    const confirmMsg = editData
      ? 'Update this SCP entry?'
      : 'Create new SCP entry?'
    if (!window.confirm(confirmMsg)) return

    // 1) upload image if they've selected a new file
    let imageUrl = editData?.image_url || ''
    if (formData.image_file) {
      imageUrl = await uploadImageToCloudinary(formData.image_file)
    }

    // 2) build the record payload
    const payload = {
      scp_number:   formData.scp_number,
      title:        formData.title,
      object_class: formData.object_class,
      description:  formData.description,
      procedures:   formData.procedures,
      image_url:    imageUrl,
      // only set created_at on new entries, updated_at on both
      ...(editData
        ? { updated_at: new Date().toISOString() }
        : { created_at: new Date().toISOString() }
      )
    }

    // 3) write to Supabase
    if (editData) {
      // update existing row
      await supabase
        .from('scp_crud')
        .update(payload)
        .eq('id', editData.id)
    } else {
      // insert new row
      await supabase
        .from('scp_crud')
        .insert([payload])
    }

    // 4) clear form fields and tell parent we're done
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
        {/* Row 1: number, title, object class */}
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

        {/* Description textarea */}
        <textarea
          name="description"
          placeholder="Description"
          className="form-field create-textarea"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Procedures textarea */}
        <textarea
          name="procedures"
          placeholder="Procedures"
          className="form-field create-textarea"
          value={formData.procedures}
          onChange={handleChange}
          required
        />

        {/* File input for image */}
        <input
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}
          className="form-field file-upload"
        />

        {/* Submit button */}
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
