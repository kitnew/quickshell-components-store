import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { componentsApi } from '../api/components';
import { useAuth } from '../context/AuthContext';
import type { Component } from '../types';
import PageHeader from '../components/PageHeader';
import ComponentCard from '../components/ComponentCard';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function ComponentsPage() {
    const { user } = useAuth();
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Filter state
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

    const fetchComponents = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await componentsApi.getAll();
            setComponents(res.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load components');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    const handleDelete = async () => {
        if (deleteId === null) return;
        try {
            await componentsApi.delete(deleteId);
            setComponents((prev) => prev.filter((c) => c.id !== deleteId));
            setDeleteId(null);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete component');
            setDeleteId(null);
        }
    };

    // Derive categories from data
    const categories = useMemo(() => {
        const cats = new Set<string>();
        components.forEach((c) => { if (c.category) cats.add(c.category); });
        return Array.from(cats).sort();
    }, [components]);

    // Filtered + sorted list
    const filtered = useMemo(() => {
        let list = [...components];

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    (c.description && c.description.toLowerCase().includes(q))
            );
        }
        if (category) {
            list = list.filter((c) => c.category === category);
        }
        list.sort((a, b) => {
            const da = new Date(a.created_at).getTime();
            const db = new Date(b.created_at).getTime();
            return sort === 'newest' ? db - da : da - db;
        });
        return list;
    }, [components, search, category, sort]);

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setSort('newest');
    };

    const hasFilters = search || category || sort !== 'newest';

    return (
        <>
            <PageHeader
                title="Components"
                subtitle="Browse and publish Quickshell components"
                action={
                    user ? (
                        <Link to="/components/new" className="btn btn--primary">
                            + Create Component
                        </Link>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to="/login" className="btn btn--secondary">Login</Link>
                            <Link to="/register" className="btn btn--primary">Register</Link>
                        </div>
                    )
                }
            />

            {/* Filter bar */}
            {!loading && !error && components.length > 0 && (
                <div className="filter-bar">
                    <input
                        className="filter-bar__input"
                        type="text"
                        placeholder="Search components..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="filter-bar__select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        className="filter-bar__select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn--ghost btn--sm" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Content */}
            {loading && <LoadingState />}

            {!loading && error && <ErrorState message={error} onRetry={fetchComponents} />}

            {!loading && !error && filtered.length === 0 && (
                <EmptyState
                    title={components.length === 0 ? 'No components yet' : 'No matching components'}
                    text={
                        components.length === 0
                            ? 'Be the first to publish a component.'
                            : 'Try adjusting your search or filters.'
                    }
                    action={
                        components.length === 0 && user ? (
                            <Link to="/components/new" className="btn btn--primary">
                                Create first component
                            </Link>
                        ) : hasFilters ? (
                            <button className="btn btn--secondary" onClick={clearFilters}>
                                Clear filters
                            </button>
                        ) : undefined
                    }
                />
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="component-grid">
                    {filtered.map((comp) => (
                        <ComponentCard
                            key={comp.id}
                            component={comp}
                            onDelete={(id) => setDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            {/* Delete confirmation */}
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
