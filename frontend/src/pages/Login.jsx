import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../auth.css';
import { validateLoginForm, validateEmail } from '../utils/validation';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [fieldTouched, setFieldTouched] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation
        if (fieldTouched[name]) {
            validateField(name, value);
        }
    };

    // Validate individual field
    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        if (fieldName === 'email') {
            const emailValidation = validateEmail(value);
            if (!emailValidation.valid) {
                newErrors.email = emailValidation.message;
            } else {
                delete newErrors.email;
            }
        } else if (fieldName === 'password') {
            if (!value) {
                newErrors.password = 'Password is required';
            } else {
                delete newErrors.password;
            }
        }

        setErrors(newErrors);
    };

    // Handle field blur
    const handleFieldBlur = (fieldName) => {
        setFieldTouched(prev => ({
            ...prev,
            [fieldName]: true
        }));
        validateField(fieldName, formData[fieldName]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate entire form
        const validation = validateLoginForm(formData);
        setErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('role', response.data.role);
                navigate('/dashboard');
            } else {
                setError('Login failed: No token received');
                setLoading(false);
            }
        } catch (err) {
            let msg = err.response?.data?.msg || 'Invalid email or password';
            if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
                msg = 'Cannot reach the server. Start the backend: cd backend && python main.py (port 5001), then refresh.';
            }
            setError(msg);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Left Side Illustration */}
                <div className="auth-illustration">
                    <h2>Welcome Back!</h2>
                    <p>Access your dashboard to manage inventory efficiently.</p>
                    {/* Placeholder for illustration */}
                    <div style={{ fontSize: '100px', marginTop: '20px' }}>📦</div>
                </div>

                {/* Right Side Form */}
                <div className="auth-form-container">
                    <h2 className="auth-title">Login</h2>
                    <p className="auth-subtitle">Sign in to your account</p>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                backgroundColor: '#fee',
                                color: '#c33',
                                padding: '12px',
                                borderRadius: '4px',
                                marginBottom: '15px',
                                border: '1px solid #fcc',
                                fontSize: '14px'
                            }}>
                                ✗ {error}
                            </div>
                        )}

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                name="email"
                                type="email"
                                className={`input-field ${errors.email ? 'input-error' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={() => handleFieldBlur('email')}
                                placeholder="name@example.com"
                            />
                            {errors.email && (
                                <span className="error-message">
                                    ✗ {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                className={`input-field ${errors.password ? 'input-error' : ''}`}
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={() => handleFieldBlur('password')}
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="error-message">
                                    ✗ {errors.password}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="gradient-btn"
                            disabled={loading || Object.keys(errors).length > 0}
                        >
                            {loading ? 'LOGGING IN...' : 'SIGN IN'}
                        </button>

                        <div className="auth-links">
                            <p>Don't have an account? <Link to="/signup">Create an Account</Link></p>
                            <p><Link to="/forgot-password">Forgot Password?</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
