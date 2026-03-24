import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { componentsApi } from '../api/components';
import { useAuth } from '../context/AuthContext';
import type { Component } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorState from '../components/ErrorState';

export default function ComponentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [component, setComponent] = useState<Component | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const isAuthor = user && component && user.id === component.author_id;

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError('');
            setNotFound(false);
            try {
                const res = await componentsApi.getById(Number(id));
                setComponent(res.data);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setNotFound(true);
                } else {
                    setError(err.response?.data?.error || 'Failed to load component');
                }
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleDelete = async () => {
        if (!component) return;
        try {
            await componentsApi.delete(component.id);
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete');
            setShowDelete(false);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

    if (loading) {
        return (
            <div className="state-block">
                <p className="state-block__text">Loading component...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="state-block">
                <h3 className="state-block__title">Component not found</h3>
                <p className="state-block__text">The component you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn btn--secondary">Back to components</Link>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => window.location.reload()} />;
    }

    if (!component) return null;

    return (
        <>
            <div className="detail-header">
                <h1 className="detail-header__title">{component.title}</h1>
                <div className="detail-header__meta">
                    {component.category && (
                        <span className="card__badge">{component.category}</span>
                    )}
                    <span>Created {formatDate(component.created_at)}</span>
                    {component.updated_at !== component.created_at && (
                        <span>Updated {formatDate(component.updated_at)}</span>
                    )}
                </div>
            </div>

            <div className="detail-content">
                {component.description && (
                    <div className="detail-content__section">
                        <p className="detail-content__label">Description</p>
                        <p className="detail-content__text">{component.description}</p>
                    </div>
                )}

                {component.github_url && (
                    <div className="detail-content__section">
                        <p className="detail-content__label">GitHub Repository</p>
                        <p className="detail-content__text">
                            <a href={component.github_url} target="_blank" rel="noopener noreferrer">
                                {component.github_url}
                            </a>
                        </p>
                    </div>
                )}

                {!component.description && !component.github_url && (
                    <div className="detail-content__section">
                        <p className="detail-content__text" style={{ color: 'var(--color-text-muted)' }}>
                            No additional details provided.
                        </p>
                    </div>
                )}
            </div>

            <div className="detail-actions">
                <Link to="/" className="btn btn--secondary">← Back to components</Link>
                {isAuthor && (
                    <>
                        <Link to={`/components/${component.id}/edit`} className="btn btn--primary">
                            Edit
                        </Link>
                        <button className="btn btn--danger" onClick={() => setShowDelete(true)}>
                            Delete
                        </button>
                    </>
                )}
            </div>

            {showDelete && (
                <ConfirmDialog
                    title="Delete Component"
                    text={`Are you sure you want to delete "${component.title}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDelete(false)}
                />
            )}
        </>
    );
}
