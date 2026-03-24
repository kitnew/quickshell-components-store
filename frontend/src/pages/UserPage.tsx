import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { componentsApi } from '../api/components';
import { useAuth } from '../context/AuthContext';
import type { Component } from '../types';
import ComponentCard from '../components/ComponentCard';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function UserPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyComponents();
    }, [user, navigate]);

    const fetchMyComponents = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await componentsApi.getAll();
            // Filter for current user's components
            const mine = res.data.filter((c) => c.author_id === user?.id);
            setComponents(mine);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load components');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        try {
            await componentsApi.delete(deleteId);
            setComponents((prev) => prev.filter((c) => c.id !== deleteId));
            setDeleteId(null);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete');
            setDeleteId(null);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* User Header */}
            <div className="user-header">
                <div className="user-header__info">
                    <h1 className="user-header__name">{user.username}</h1>
                    <p className="user-header__email">{user.email}</p>
                    <p className="user-header__badge">Registered user</p>
                </div>
                <div className="user-header__actions">
                    <Link to="/components/new" className="btn btn--primary">
                        + Create Component
                    </Link>
                    <button className="btn btn--secondary" onClick={() => { logout(); navigate('/'); }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* My Components */}
            <div className="section">
                <div className="section__header">
                    <h2 className="section__title">
                        My Components
                        {!loading && !error && (
                            <span className="section__count"> ({components.length})</span>
                        )}
                    </h2>
                </div>

                {loading && <LoadingState />}

                {!loading && error && <ErrorState message={error} onRetry={fetchMyComponents} />}

                {!loading && !error && components.length === 0 && (
                    <EmptyState
                        title="No components yet"
                        text="You haven't published any components. Start by creating your first one."
                        action={
                            <Link to="/components/new" className="btn btn--primary">
                                Create your first component
                            </Link>
                        }
                    />
                )}

                {!loading && !error && components.length > 0 && (
                    <div className="component-grid">
                        {components.map((comp) => (
                            <ComponentCard
                                key={comp.id}
                                component={comp}
                                onDelete={(id) => setDeleteId(id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Future expansion placeholder — Saved, Drafts, Settings, etc. */}

            {deleteId !== null && (
                <ConfirmDialog
                    title="Delete Component"
                    text="Are you sure you want to delete this component? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </>
    );
}
