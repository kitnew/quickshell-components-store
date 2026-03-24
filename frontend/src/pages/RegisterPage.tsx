import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <h2 className="auth-card__title">Already logged in</h2>
                    <p className="auth-card__subtitle">
                        You are signed in as <strong>{user.username}</strong>.
                    </p>
                    <Link to="/" className="btn btn--primary">Go to Components</Link>
                </div>
            </div>
        );
    }

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.username.trim()) errs.username = 'Username is required';
        else if (form.username.trim().length < 3) errs.username = 'Username must be at least 3 characters';
        if (!form.email.trim()) errs.email = 'Email is required';
        if (!form.password.trim()) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await authApi.register({
                username: form.username,
                email: form.email,
                password: form.password,
            });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-card__title">Register</h2>
                <p className="auth-card__subtitle">Create an account to publish and manage components.</p>

                {serverError && (
                    <div className="alert alert--error" style={{ marginBottom: '20px' }}>
                        {serverError}
                    </div>
                )}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label className="form-field__label" htmlFor="reg-username">Username</label>
                        <input
                            id="reg-username"
                            className={`form-field__input ${errors.username ? 'form-field__input--error' : ''}`}
                            type="text"
                            placeholder="Your username"
                            value={form.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />
                        {errors.username && <span className="form-field__error">{errors.username}</span>}
                    </div>

                    <div className="form-field">
                        <label className="form-field__label" htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            className={`form-field__input ${errors.email ? 'form-field__input--error' : ''}`}
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <span className="form-field__error">{errors.email}</span>}
                    </div>

                    <div className="form-field">
                        <label className="form-field__label" htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            className={`form-field__input ${errors.password ? 'form-field__input--error' : ''}`}
                            type="password"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                        {errors.password && <span className="form-field__error">{errors.password}</span>}
                    </div>

                    <div className="form__actions">
                        <button className="btn btn--primary btn--lg" type="submit" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </div>
                </form>

                <p className="form__footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
