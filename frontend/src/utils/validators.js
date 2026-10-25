// Client-side validation helpers.

export function isValidEmail(email) {
  if (!email) return false;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
}

// SkillSwap is open to everyone: any valid email domain is accepted
// (Gmail, Outlook, Yahoo, personal, work, or institutional addresses).
// Institutional emails are supported but never required.
export function isCollegeEmail(email) {
  return isValidEmail(email);
}

export function isStrongPassword(password) {
  if (!password) return false;
  // Min 8 chars, at least one letter and one number (backend requires 8-64)
  return password.length >= 8 && password.length <= 64 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

export function required(value) {
  if (value == null || value === '') return 'This field is required';
  return null;
}

export function minLength(value, len) {
  if (!value) return null;
  if (String(value).length < len) return `Must be at least ${len} characters`;
  return null;
}

export function maxLength(value, len) {
  if (!value) return null;
  if (String(value).length > len) return `Must not exceed ${len} characters`;
  return null;
}

// Returns a { field: message } object for the first error of each field.
export function runValidators(values, validators) {
  const errors = {};
  for (const field of Object.keys(validators)) {
    const fns = Array.isArray(validators[field]) ? validators[field] : [validators[field]];
    for (const fn of fns) {
      const msg = fn(values[field], values);
      if (msg) {
        errors[field] = msg;
        break;
      }
    }
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors || {}).length > 0;
}
