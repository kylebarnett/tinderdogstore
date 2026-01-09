import { useUser } from '../../context/UserContext';
import { DogProfile } from './DogProfile';
import { ShareInvite } from '../ShareInvite';

export function ProfilePage({ onClose }) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-start overflow-y-auto z-[250] p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg my-5 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 border-none bg-gray-100 rounded-full text-2xl cursor-pointer flex items-center justify-center text-gray-500 transition-colors z-10 hover:bg-gray-200"
          onClick={onClose}
        >
          ×
        </button>

        <div className="text-center py-8 px-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-t-2xl text-white">
          <div className="w-20 h-20 rounded-full bg-white text-purple-600 text-3xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="m-0 text-2xl font-bold">{user.username}</h2>
          <p className="m-0 mt-1 opacity-80 text-sm">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="pb-6">
          <section className="border-b border-gray-200">
            <h3 className="m-0 pt-5 px-6 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              My Dog
            </h3>
            <DogProfile />
          </section>

          <section className="border-b border-gray-200">
            <h3 className="m-0 pt-5 px-6 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              Invite Friends
            </h3>
            <ShareInvite />
          </section>
        </div>

        <div className="p-4 px-6 border-t border-gray-200">
          <button
            className="w-full py-3 border-2 border-red-100 rounded-xl bg-red-50 text-red-600 text-base font-semibold cursor-pointer transition-all hover:bg-red-100 hover:border-red-200"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
