import { NavLink, Outlet, useNavigate } from 'react-router';
import { Toast } from '../components/Toast';
import { useAuth } from '../hooks/useAuth';

export const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/tasks');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>Study Planner</h1>
          <p>План навчальних завдань на React</p>
        </div>

        <nav className="app-nav" aria-label="Головна навігація">
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Tasks
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Profile
          </NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="nav-auth-btn"
            >
              Logout ({user?.username})
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <Toast />
    </div>
  );
};