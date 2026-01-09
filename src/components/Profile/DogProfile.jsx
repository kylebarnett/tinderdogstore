import { useState, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { fileToBase64 } from '../../utils/storage';
import { toyCategories } from '../../data/toys';

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
      <div className="text-center p-5">
        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
          {dogProfile.photo ? (
            <img src={dogProfile.photo} alt={dogProfile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Photo
            </div>
          )}
        </div>
        <h3 className="m-0 mb-4 text-gray-800 text-2xl font-bold">{dogProfile.name}</h3>
        <div className="text-left bg-gray-50 rounded-xl p-4 mb-4">
          {dogProfile.size && (
            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-500 font-medium">Size:</span>
              <span>{DOG_SIZES.find((s) => s.id === dogProfile.size)?.label}</span>
            </div>
          )}
          {dogProfile.activityLevel && (
            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-500 font-medium">Activity:</span>
              <span>{ACTIVITY_LEVELS.find((a) => a.id === dogProfile.activityLevel)?.label}</span>
            </div>
          )}
          {dogProfile.toyPreferences?.length > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500 font-medium">Loves:</span>
              <span className="text-right">
                {dogProfile.toyPreferences
                  .map((p) => toyCategories.find((c) => c.id === p)?.label)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
        <button
          className="py-2.5 px-6 border-2 border-purple-600 rounded-lg bg-transparent text-purple-600 font-semibold cursor-pointer transition-all hover:bg-purple-600 hover:text-white"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h3 className="m-0 mb-5 text-gray-800 text-center text-xl font-bold">
        {dogProfile ? 'Edit Dog Profile' : 'Add Your Dog'}
      </h3>

      <div className="flex justify-center mb-6">
        <div
          className="w-28 h-28 rounded-full overflow-hidden cursor-pointer bg-gray-100 border-3 border-dashed border-gray-300 transition-colors hover:border-purple-500"
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.photo ? (
            <img src={formData.photo} alt="Dog preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-3xl leading-none">+</span>
              <span className="text-xs">Add Photo</span>
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

      <div className="mb-5">
        <label className="block mb-2 text-gray-700 font-semibold">Dog's Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter name"
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-gray-700 font-semibold">Size</label>
        <div className="grid grid-cols-2 gap-2.5">
          {DOG_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              className={`flex flex-col items-center p-3 border-2 rounded-xl bg-white cursor-pointer transition-all ${
                formData.size === size.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleChange('size', size.id)}
            >
              <span className="font-semibold text-gray-800">{size.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{size.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-gray-700 font-semibold">Activity Level</label>
        <div className="grid grid-cols-2 gap-2.5">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              className={`flex flex-col items-center p-3 border-2 rounded-xl bg-white cursor-pointer transition-all ${
                formData.activityLevel === level.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleChange('activityLevel', level.id)}
            >
              <span className="font-semibold text-gray-800">{level.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{level.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-gray-700 font-semibold">Favorite Toy Types</label>
        <div className="grid grid-cols-2 gap-2">
          {toyCategories.map((cat) => (
            <label
              key={cat.id}
              className={`flex items-center gap-2 p-2.5 px-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.toyPreferences.includes(cat.id)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.toyPreferences.includes(cat.id)}
                onChange={() => handleToyPreferenceToggle(cat.id)}
                className="accent-purple-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 py-3.5 border-none rounded-xl bg-purple-600 text-white text-base font-semibold cursor-pointer transition-colors hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
        {dogProfile && (
          <button
            className="py-3.5 px-6 border-2 border-gray-200 rounded-xl bg-white text-gray-500 text-base font-semibold cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50"
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
