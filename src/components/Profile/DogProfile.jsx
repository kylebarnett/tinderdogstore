import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { fileToBase64 } from '../../utils/storage';
import { toyCategories } from '../../data/toys';
import styles from './DogProfile.module.css';

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
      <motion.div
        className={styles.view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.photoDisplay}>
          {dogProfile.photo ? (
            <img src={dogProfile.photo} alt={dogProfile.name} />
          ) : (
            <div className={styles.photoPlaceholder}>No Photo</div>
          )}
        </div>
        <h3>{dogProfile.name}</h3>
        <div className={styles.details}>
          {dogProfile.size && (
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Size</span>
              <span>{DOG_SIZES.find((s) => s.id === dogProfile.size)?.label}</span>
            </div>
          )}
          {dogProfile.activityLevel && (
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Activity</span>
              <span>{ACTIVITY_LEVELS.find((a) => a.id === dogProfile.activityLevel)?.label}</span>
            </div>
          )}
          {dogProfile.toyPreferences?.length > 0 && (
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Loves</span>
              <span>
                {dogProfile.toyPreferences
                  .map((p) => toyCategories.find((c) => c.id === p)?.label)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
        <motion.button
          className={styles.editBtn}
          onClick={handleEdit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Edit Profile
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.form}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{dogProfile ? 'Edit Dog Profile' : 'Add Your Dog'}</h3>

      <div className={styles.photoUpload}>
        <div
          className={styles.photoPreview}
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.photo ? (
            <img src={formData.photo} alt="Dog preview" />
          ) : (
            <div className={styles.photoPreviewPlaceholder}>
              <Camera size={24} />
              <span style={{ fontSize: '12px' }}>Add Photo</span>
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

      <div className={styles.formField}>
        <label>Dog's Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div className={styles.formField}>
        <label>Size</label>
        <div className={styles.optionGrid}>
          {DOG_SIZES.map((size) => (
            <motion.button
              key={size.id}
              type="button"
              className={`${styles.optionBtn} ${formData.size === size.id ? styles.optionBtnSelected : ''}`}
              onClick={() => handleChange('size', size.id)}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.optionLabel}>{size.label}</span>
              <span className={styles.optionDesc}>{size.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className={styles.formField}>
        <label>Activity Level</label>
        <div className={styles.optionGrid}>
          {ACTIVITY_LEVELS.map((level) => (
            <motion.button
              key={level.id}
              type="button"
              className={`${styles.optionBtn} ${formData.activityLevel === level.id ? styles.optionBtnSelected : ''}`}
              onClick={() => handleChange('activityLevel', level.id)}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.optionLabel}>{level.label}</span>
              <span className={styles.optionDesc}>{level.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className={styles.formField}>
        <label>Favorite Toy Types</label>
        <div className={styles.checkboxGrid}>
          {toyCategories.map((cat) => (
            <label
              key={cat.id}
              className={`${styles.checkboxItem} ${formData.toyPreferences.includes(cat.id) ? styles.checkboxItemChecked : ''}`}
            >
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

      <div className={styles.formActions}>
        <motion.button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </motion.button>
        {dogProfile && (
          <button
            className={styles.cancelBtn}
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
    </motion.div>
  );
}
