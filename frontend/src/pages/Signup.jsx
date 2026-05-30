import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../auth.css';
import {
    validateSignupForm,
    getPasswordStrength,
    validateEmail,
    validateName,
    validatePassword,
    validateConfirmPassword,
} from '../utils/validation';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
    });
    const [errors, setErrors] = useState({});
    const [fieldTouched, setFieldTouched] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        strength: 0,
        label: 'None',
        color: '#ccc',
        percentage: 0,
    });
    const navigate = useNavigate();

    // Handle field changes with real-time validation
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

        // Update password strength
        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    // Validate individual field
    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'name':
                const nameValidation = validateName(value);
                if (!nameValidation.valid) {
                    newErrors.name = nameValidation.message;
                } else {
                    delete newErrors.name;
                }
                break;
            case 'email':
                const emailValidation = validateEmail(value);
                if (!emailValidation.valid) {
                    newErrors.email = emailValidation.message;
                } else {
                    delete newErrors.email;
                }
                break;
            case 'password':
                const passwordValidation = validatePassword(value);
                if (!passwordValidation.valid) {
                    newErrors.password = passwordValidation.message;
                } else {
                    delete newErrors.password;
                }
                break;
            case 'confirmPassword':
                const confirmValidation = validateConfirmPassword(formData.password, value);
                if (!confirmValidation.valid) {
                    newErrors.confirmPassword = confirmValidation.message;
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
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
        const validation = validateSignupForm(formData);
        setErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            }, { timeout: 10000 });

            setSuccess('Registration successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration Error:', err);
            let errMsg =
                err.response?.data?.detail ||
                err.response?.data?.msg ||
                err.message ||
                'Registration failed.';
            if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
                errMsg =
                    'Cannot reach the server. Start the backend from the project folder: cd backend && python main.py (must listen on port 5001), then try again.';
            }
            setError(errMsg);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Left Side Illustration */}
                <div className="auth-illustration">
                    <h2>Welcome!</h2>
                    <p>Join our community and start your journey.</p>
                    <div style={{ fontSize: '100px', marginTop: '20px' }}>🌟</div>
                </div>

                {/* Right Side Form */}
                <div className="auth-form-container">
                    <h2 className="auth-title">Sign Up</h2>
                    <p className="auth-subtitle">Create your account</p>

                    <form onSubmit={handleSubmit}>
                        {success && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{success}</p>}
                        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={() => handleFieldBlur('name')}
                                className={`input-field ${errors.name ? 'input-error' : ''}`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <span className="error-message">
                                    ✗ {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={() => handleFieldBlur('email')}
                                className={`input-field ${errors.email ? 'input-error' : ''}`}
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
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={() => handleFieldBlur('password')}
                                className={`input-field ${errors.password ? 'input-error' : ''}`}
                                placeholder="Create a strong password"
                            />
                            {errors.password && (
                                <span className="error-message">
                                    ✗ {errors.password}
                                </span>
                            )}
                            {formData.password && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <small style={{ fontSize: '12px', color: '#666' }}>Password Strength:</small>
                                        <small style={{ color: passwordStrength.color, fontWeight: 'bold' }}>
                                            {passwordStrength.label}
                                        </small>
                                    </div>
                                    <div style={{
                                        height: '6px',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${passwordStrength.percentage}%`,
                                            backgroundColor: passwordStrength.color,
                                            transition: 'all 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={() => handleFieldBlur('confirmPassword')}
                                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                                placeholder="Re-enter your password"
                            />
                            {errors.confirmPassword && (
                                <span className="error-message">
                                    ✗ {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="input-field"
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="gradient-btn"
                            disabled={loading || Object.keys(errors).length > 0}
                        >
                            {loading ? 'REGISTERING...' : 'SIGN UP'}
                        </button>

                        <div className="auth-links">
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
