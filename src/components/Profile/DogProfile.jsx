import { useState, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { fileToBase64 } from '../../utils/storage';
import { toyCategories } from '../../data/toys';
import './DogProfile.css';

const DOG_SIZES = [
  { id: 'small', label: 'Small', description: 'Under 20 lbs' },
  { id: 'medium', label: 'Medium', description: '20-50 lbs' },
  { id: 'large', label: 'Large', description: '50-90 lbs' },
  { id: 'giant', label: 'Giant', description: '90+ lbs' }
];

const ACTIVITY_LEVELS = [
  { id: 'low', label: 'Low', description: 'Couch potato' },
  { id: 'moderate', label: 'Moderate', description: 'Daily walks' },
  { id: 'high', label: 'High', description: 'Very active' },
  { id: 'very-high', label: 'Very High', description: 'Endless energy' }
];

export function DogProfile() {
  const { dogProfile, saveDogProfile } = useUser();
  const [isEditing, setIsEditing] = useState(!dogProfile);
  const [formData, setFormData] = useState({
    name: dogProfile?.name || '',
    size: dogProfile?.size || '',
    activityLevel: dogProfile?.activityLevel || '',
    toyPreferences: dogProfile?.toyPreferences || [],
    photo: dogProfile?.photo || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToyPreferenceToggle = (categoryId) => {
    setFormData((prev) => {
      const prefs = prev.toyPreferences.includes(categoryId)
        ? prev.toyPreferences.filter((p) => p !== categoryId)
        : [...prev.toyPreferences, categoryId];
      return { ...prev, toyPreferences: prefs };
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      handleChange('photo', base64);
    } catch (err) {
      alert('Failed to load image');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter your dog\'s name');
      return;
    }

    setIsSaving(true);
    try {
      saveDogProfile(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing && dogProfile) {
    return (
      <div className="dog-profile-view">
        <div className="dog-photo-display">
          {dogProfile.photo ? (
            <img src={dogProfile.photo} alt={dogProfile.name} />
          ) : (
            <div className="dog-photo-placeholder">No Photo</div>
          )}
        </div>
        <h3>{dogProfile.name}</h3>
        <div className="dog-details">
          {dogProfile.size && (
            <div className="dog-detail">
              <span className="detail-label">Size:</span>
              <span>{DOG_SIZES.find((s) => s.id === dogProfile.size)?.label}</span>
            </div>
          )}
          {dogProfile.activityLevel && (
            <div className="dog-detail">
              <span className="detail-label">Activity:</span>
              <span>{ACTIVITY_LEVELS.find((a) => a.id === dogProfile.activityLevel)?.label}</span>
            </div>
          )}
          {dogProfile.toyPreferences?.length > 0 && (
            <div className="dog-detail">
              <span className="detail-label">Loves:</span>
              <span>
                {dogProfile.toyPreferences
                  .map((p) => toyCategories.find((c) => c.id === p)?.label)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
        <button className="edit-profile-btn" onClick={handleEdit}>
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div className="dog-profile-form">
      <h3>{dogProfile ? 'Edit Dog Profile' : 'Add Your Dog'}</h3>

      <div className="photo-upload">
        <div
          className="photo-preview"
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.photo ? (
            <img src={formData.photo} alt="Dog preview" />
          ) : (
            <div className="photo-placeholder">
              <span>+</span>
              <span>Add Photo</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handlePhotoUpload}
          hidden
        />
      </div>

      <div className="form-field">
        <label>Dog's Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div className="form-field">
        <label>Size</label>
        <div className="option-grid">
          {DOG_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              className={`option-btn ${formData.size === size.id ? 'selected' : ''}`}
              onClick={() => handleChange('size', size.id)}
            >
              <span className="option-label">{size.label}</span>
              <span className="option-desc">{size.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label>Activity Level</label>
        <div className="option-grid">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              className={`option-btn ${formData.activityLevel === level.id ? 'selected' : ''}`}
              onClick={() => handleChange('activityLevel', level.id)}
            >
              <span className="option-label">{level.label}</span>
              <span className="option-desc">{level.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label>Favorite Toy Types</label>
        <div className="checkbox-grid">
          {toyCategories.map((cat) => (
            <label key={cat.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.toyPreferences.includes(cat.id)}
                onChange={() => handleToyPreferenceToggle(cat.id)}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
        {dogProfile && (
          <button
            className="cancel-btn"
            onClick={() => {
              setFormData({
                name: dogProfile.name,
                size: dogProfile.size,
                activityLevel: dogProfile.activityLevel,
                toyPreferences: dogProfile.toyPreferences,
                photo: dogProfile.photo
              });
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
