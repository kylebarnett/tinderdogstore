import { useUser } from '../../context/UserContext';
import { DogProfile } from './DogProfile';
import { ShareInvite } from '../ShareInvite';
import './ProfilePage.css';

export function ProfilePage({ onClose }) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-page" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>
          &times;
        </button>

        <div className="profile-header">
          <div className="user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2>{user.username}</h2>
          <p className="member-since">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="profile-sections">
          <section className="profile-section">
            <h3 className="section-title">My Dog</h3>
            <DogProfile />
          </section>

          <section className="profile-section">
            <h3 className="section-title">Invite Friends</h3>
            <ShareInvite />
          </section>
        </div>

        <div className="profile-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
