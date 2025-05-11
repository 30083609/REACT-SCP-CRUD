import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SCPForm = ({ onSubmit, editData = null, goBack }) => {
  const [formData, setFormData] = useState(editData || {
    scp_number: '',
    title: '',
    object_class: '',
    description: '',
    procedures: '',
    image_file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_file') {
      setFormData((prev) => ({ ...prev, image_file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const url = 'https://api.cloudinary.com/v1_1/dfo9ahmct/image/upload';
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'unsigned');

    const response = await fetch(url, { method: 'POST', body: form });
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmMsg = editData ? 'Update this SCP entry?' : 'Create new SCP entry?';
    if (!window.confirm(confirmMsg)) return;

    let imageUrl = editData?.image_url || '';
    if (formData.image_file) {
      imageUrl = await uploadImageToCloudinary(formData.image_file);
    }

    const payload = {
      scp_number: formData.scp_number,
      title: formData.title,
      object_class: formData.object_class,
      description: formData.description,
      procedures: formData.procedures,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editData) {
      await supabase.from('scp_crud').update(payload).eq('id', editData.id);
    } else {
      await supabase.from('scp_crud').insert([payload]);
    }

    setFormData({
      scp_number: '',
      title: '',
      object_class: '',
      description: '',
      procedures: '',
      image_file: null
    });

    onSubmit();
  };

  return (
    <div className="create-wrapper">
      {goBack && (
        <button className="back-btn" onClick={goBack}>← Back to Menu</button>
      )}

      <h2 className="scp-title">{editData ? 'Update SCP Entry' : 'Create New SCP Entry'}</h2>

      <form onSubmit={handleSubmit} className="create-form">
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
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="form-field"
          required
        />
        <textarea
          name="procedures"
          placeholder="Special Containment Procedures"
          value={formData.procedures}
          onChange={handleChange}
          className="form-field"
          required
        />
        <input
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}
          className="form-field"
        />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editData ? 'Update SCP' : 'Add SCP'}
          </button>
          <button type="button" className="cancel-btn" onClick={goBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SCPForm;
