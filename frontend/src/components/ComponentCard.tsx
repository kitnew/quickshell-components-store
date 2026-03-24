import { Link } from 'react-router-dom';
import type { Component } from '../types';
import { useAuth } from '../context/AuthContext';

interface ComponentCardProps {
    component: Component;
    onDelete?: (id: number) => void;
}

export default function ComponentCard({ component, onDelete }: ComponentCardProps) {
    const { user } = useAuth();
    const isAuthor = user && user.id === component.author_id;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="card">
            <div className="card__header">
                <Link to={`/components/${component.id}`}>
                    <h3 className="card__title">{component.title}</h3>
                </Link>
                <div className="card__meta">
                    {component.category && (
                        <span className="card__badge">{component.category}</span>
                    )}
                    <span className="card__meta-item">{formatDate(component.created_at)}</span>
                </div>
            </div>

            {component.description && (
                <div className="card__body">
                    <p className="card__description">{component.description}</p>
                </div>
            )}

            <div className="card__actions">
                <Link to={`/components/${component.id}`} className="btn btn--secondary btn--sm">
                    View Details
                </Link>
                {isAuthor && (
                    <>
                        <Link to={`/components/${component.id}/edit`} className="btn btn--ghost btn--sm">
                            Edit
                        </Link>
                        {onDelete && (
                            <button
                                className="btn btn--ghost btn--sm"
                                style={{ color: 'var(--color-danger)' }}
                                onClick={() => onDelete(component.id)}
                            >
                                Delete
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
