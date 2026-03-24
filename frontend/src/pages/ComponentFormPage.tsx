import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { componentsApi } from '../api/components';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import ErrorState from '../components/ErrorState';

export default function ComponentFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        github_url: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);
    const [fetchError, setFetchError] = useState('');
    const [forbidden, setForbidden] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Fetch component data in edit mode
    useEffect(() => {
        if (!isEditMode || !id) return;
        const fetch = async () => {
            setFetchLoading(true);
            try {
                const res = await componentsApi.getById(Number(id));
                // Check authorship
                if (user && res.data.author_id !== user.id) {
                    setForbidden(true);
                    return;
                }
                setForm({
                    title: res.data.title || '',
                    description: res.data.description || '',
                    category: res.data.category || '',
                    github_url: res.data.github_url || '',
                });
            } catch (err: any) {
                setFetchError(err.response?.data?.error || 'Failed to load component');
            } finally {
                setFetchLoading(false);
            }
        };
        fetch();
    }, [id, isEditMode, user]);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
        if (form.github_url.trim() && !isValidUrl(form.github_url.trim())) {
            errs.github_url = 'Please enter a valid URL';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const isValidUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setLoading(true);
        try {
            const payload: Record<string, string> = {};
            if (form.title.trim()) payload.title = form.title.trim();
            if (form.description.trim()) payload.description = form.description.trim();
            if (form.category.trim()) payload.category = form.category.trim();
            if (form.github_url.trim()) payload.github_url = form.github_url.trim();

            if (isEditMode && id) {
                await componentsApi.update(Number(id), payload);
                navigate(`/components/${id}`);
            } else {
                const res = await componentsApi.create(payload as any);
                navigate(`/components/${res.data.id}`);
            }
        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Failed to save component');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    if (!user) return null;

    if (fetchLoading) {
        return (
            <div className="state-block">
                <p className="state-block__text">Loading component...</p>
            </div>
        );
    }

    if (fetchError) {
        return <ErrorState message={fetchError} />;
    }

    if (forbidden) {
        return (
            <div className="state-block">
                <h3 className="state-block__title">Access Denied</h3>
                <p className="state-block__text">You can only edit components you created.</p>
                <Link to={`/components/${id}`} className="btn btn--secondary">View Component</Link>
            </div>
        );
    }

    return (
        <>
            <PageHeader
                title={isEditMode ? 'Edit Component' : 'Create Component'}
                subtitle={isEditMode ? 'Update component information' : 'Publish a new Quickshell component'}
            />

            {serverError && (
                <div className="alert alert--error" style={{ marginBottom: '20px' }}>
                    {serverError}
                </div>
            )}

            <form className="form form--medium" onSubmit={handleSubmit}>
                {/* Section: Basic Info */}
                <div className="form-field">
                    <label className="form-field__label" htmlFor="comp-title">Title *</label>
                    <input
                        id="comp-title"
                        className={`form-field__input ${errors.title ? 'form-field__input--error' : ''}`}
                        type="text"
                        placeholder="Component name"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                    {errors.title && <span className="form-field__error">{errors.title}</span>}
                </div>

                <div className="form-field">
                    <label className="form-field__label" htmlFor="comp-category">Category</label>
                    <input
                        id="comp-category"
                        className="form-field__input"
                        type="text"
                        placeholder="e.g. UI, Layout, Navigation"
                        value={form.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label className="form-field__label" htmlFor="comp-description">Description</label>
                    <textarea
                        id="comp-description"
                        className="form-field__input"
                        placeholder="Describe what this component does..."
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label className="form-field__label" htmlFor="comp-github">GitHub URL</label>
                    <input
                        id="comp-github"
                        className={`form-field__input ${errors.github_url ? 'form-field__input--error' : ''}`}
                        type="text"
                        placeholder="https://github.com/user/repo"
                        value={form.github_url}
                        onChange={(e) => handleChange('github_url', e.target.value)}
                    />
                    {errors.github_url && <span className="form-field__error">{errors.github_url}</span>}
                </div>

                <div className="form__actions">
                    <button className="btn btn--primary btn--lg" type="submit" disabled={loading}>
                        {loading
                            ? (isEditMode ? 'Saving...' : 'Creating...')
                            : (isEditMode ? 'Save Changes' : 'Create Component')}
                    </button>
                    <button
                        className="btn btn--secondary btn--lg"
                        type="button"
                        onClick={() => navigate(isEditMode ? `/components/${id}` : '/')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
