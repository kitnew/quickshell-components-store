import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path ? 'navbar__link navbar__link--active' : 'navbar__link';

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__brand">
                    Quickshell Components
                </Link>

                <div className="navbar__links">
                    <Link to="/" className={isActive('/')}>
                        Components
                    </Link>

                    {user ? (
                        <>
                            <Link to="/me" className={isActive('/me')}>
                                My Profile
                            </Link>
                            <Link to="/components/new" className="btn btn--primary btn--sm">
                                + Add Component
                            </Link>
                            <div className="navbar__divider" />
                            <div className="navbar__user">
                                <span className="navbar__username">{user.username}</span>
                                <button className="btn btn--ghost btn--sm" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={isActive('/login')}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn--primary btn--sm">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
