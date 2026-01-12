import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { fileToBase64 } from '../../utils/storage';
import styles from './DogProfile.module.css';

const DOG_SIZES = [
  { id: 'small', label: 'Small', description: 'Under 20 lbs' },
  { id: 'medium', label: 'Medium', description: '20-50 lbs' },
  { id: 'large', label: 'Large', description: '50-90 lbs' },
  { id: 'giant', label: 'Giant', description: '90+ lbs' }
];

const CHEW_STRENGTHS = [
  { id: 'gentle', label: 'Gentle', description: 'Nibbles softly' },
  { id: 'moderate', label: 'Moderate', description: 'Normal chewer' },
  { id: 'aggressive', label: 'Aggressive', description: 'Destroys toys fast' },
  { id: 'destroyer', label: 'Destroyer', description: 'Nothing survives' }
];

const PLAY_STYLES = [
  { id: 'fetch', label: 'Fetch', description: 'Loves to chase & retrieve' },
  { id: 'tug', label: 'Tug', description: 'Loves tug-of-war' },
  { id: 'cuddle', label: 'Cuddle', description: 'Snuggles with toys' },
  { id: 'puzzle', label: 'Puzzle', description: 'Loves treat puzzles' }
];

const ACTIVITY_LEVELS = [
  { id: 'low', label: 'Low', description: 'Couch potato' },
  { id: 'moderate', label: 'Moderate', description: 'Daily walks' },
  { id: 'high', label: 'High', description: 'Very active' },
  { id: 'very-high', label: 'Very High', description: 'Endless energy' }
];

export function DogProfile({ onEditingChange }) {
  const { dogProfile, saveDogProfile } = useUser();
  const [isEditing, setIsEditing] = useState(!dogProfile);
  const [formData, setFormData] = useState({
    name: dogProfile?.name || '',
    size: dogProfile?.size || '',
    chewStrength: dogProfile?.chewStrength || '',
    playStyle: dogProfile?.playStyle || '',
    activityLevel: dogProfile?.activityLevel || '',
    photo: dogProfile?.photo || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      onEditingChange?.(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    onEditingChange?.(true);
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
          {dogProfile.chewStrength && (
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Chewer</span>
              <span>{CHEW_STRENGTHS.find((c) => c.id === dogProfile.chewStrength)?.label}</span>
            </div>
          )}
          {dogProfile.playStyle && (
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Plays</span>
              <span>{PLAY_STYLES.find((p) => p.id === dogProfile.playStyle)?.label}</span>
            </div>
          )}
          {dogProfile.activityLevel && (
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Activity</span>
              <span>{ACTIVITY_LEVELS.find((a) => a.id === dogProfile.activityLevel)?.label}</span>
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
        <label>Chew Strength</label>
        <div className={styles.optionGrid}>
          {CHEW_STRENGTHS.map((strength) => (
            <motion.button
              key={strength.id}
              type="button"
              className={`${styles.optionBtn} ${formData.chewStrength === strength.id ? styles.optionBtnSelected : ''}`}
              onClick={() => handleChange('chewStrength', strength.id)}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.optionLabel}>{strength.label}</span>
              <span className={styles.optionDesc}>{strength.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className={styles.formField}>
        <label>Play Style</label>
        <div className={styles.optionGrid}>
          {PLAY_STYLES.map((style) => (
            <motion.button
              key={style.id}
              type="button"
              className={`${styles.optionBtn} ${formData.playStyle === style.id ? styles.optionBtnSelected : ''}`}
              onClick={() => handleChange('playStyle', style.id)}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.optionLabel}>{style.label}</span>
              <span className={styles.optionDesc}>{style.description}</span>
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
                chewStrength: dogProfile.chewStrength,
                playStyle: dogProfile.playStyle,
                activityLevel: dogProfile.activityLevel,
                photo: dogProfile.photo
              });
              setIsEditing(false);
              onEditingChange?.(false);
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
