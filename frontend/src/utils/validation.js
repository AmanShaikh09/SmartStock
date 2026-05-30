// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain lowercase letters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase letters' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain numbers' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain special characters (!@#$%^&*)' };
  }
  return { valid: true, message: '' };
};

// Password strength calculator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None', color: '#ccc' };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  Object.values(checks).forEach(check => {
    if (check) strength++;
  });

  let label, color;
  if (strength === 0) {
    label = 'None';
    color = '#ccc';
  } else if (strength <= 2) {
    label = 'Weak';
    color = '#ff4444';
  } else if (strength <= 3) {
    label = 'Fair';
    color = '#ffbb00';
  } else if (strength === 4) {
    label = 'Strong';
    color = '#88dd00';
  } else {
    label = 'Very Strong';
    color = '#00dd00';
  }

  return { strength, label, color, percentage: (strength / 5) * 100 };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  return { valid: true, message: '' };
};

// Full name validation
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true, message: '' };
};

// Signup form validation
export const validateSignupForm = (formData) => {
  const errors = {};

  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.valid) errors.name = nameValidation.message;

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.message;

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.message;

  // Validate confirm password
  const confirmValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmValidation.valid) errors.confirmPassword = confirmValidation.message;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.message;

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Bulk quantity validation
export const validateBulkQuantity = (quantity) => {
  const qty = parseInt(quantity);

  if (isNaN(qty)) {
    return { valid: false, message: 'Quantity must be a number' };
  }

  if (qty < 0) {
    return { valid: false, message: 'Quantity cannot be negative' };
  }

  return { valid: true, message: '' };
};

// Validate bulk item
export const validateBulkItem = (item) => {
  const errors = {};

  if (!item.product_id) {
    errors.product_id = 'Product ID is required';
  }

  const quantityValidation = validateBulkQuantity(item.quantity);
  if (!quantityValidation.valid) {
    errors.quantity = quantityValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate bulk items array
export const validateBulkItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      isValid: false,
      errors: { items: 'At least one product must be selected' },
    };
  }

  const itemErrors = [];
  let isValid = true;

  items.forEach((item, index) => {
    const validation = validateBulkItem(item);
    if (!validation.isValid) {
      isValid = false;
      itemErrors.push({
        index,
        product_name: item.product_name,
        errors: validation.errors,
      });
    }
  });

  return {
    isValid,
    errors: itemErrors,
  };
};
