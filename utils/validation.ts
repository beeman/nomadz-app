export const validatePassword = (password: string): string | null => {
  if (password.length < 8 || password.length > 128) {
    return 'Password must be between 8 and 128 characters.';
  }
  if (/\s/.test(password)) {
    return 'Password cannot contain spaces.';
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least one letter.';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (username.length < 2 || username.length > 32) {
    return 'Username must be between 2 and 32 characters.';
  }
  if (/\s/.test(username)) {
    return 'Username cannot contain spaces.';
  }
  if (!/[a-zA-Z]/.test(username)) {
    return 'Username must contain at least one letter.';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateName = (value: string, name: string = 'Name'): string | null => {
  if (!value.trim()) return `${name} is required`;
  if (value.length < 2) return `${name} must be at least 2 characters`;
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return 'Phone number is required';
  if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateTwitter = (twitter: string): string | null => {
  if (!twitter.trim()) return 'Twitter account is required';
  if (!twitter.startsWith('@')) {
    return 'Twitter account must start with @'
  }
  if (twitter.length > 100) {
    return 'Your Twitter account is too long.';
  }
  return null;
};

export const validateTelegram = (twitter: string): string | null => {
  if (!twitter.trim()) return 'Telegram account is required';
  if (!twitter.startsWith('@')) {
    return 'Telegram account must start with @'
  }
  if (twitter.length > 100) {
    return 'Your Telegram account is too long.';
  }
  return null;
};

export const validateLinkedIn = (linkedin: string): string | null => {
  if (!linkedin.trim()) return 'LinkedIn profile is required';
  if (!linkedin.startsWith('https://www.linkedin.com/in/')) {
    return 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)';
  }
  if (linkedin.length > 200) {
    return 'Your LinkedIn profile URL is too long.';
  }
  return null;
};

// =============================================
// Card Validation Functions
// =============================================

export const validateCardNumber = (cardNumber: string): string | null => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (!/^\d{16}$/.test(cleanNumber)) {
    return 'Invalid card number';
  }
  return null;
};

export const validateCardExpiry = (expiry: string): string | null => {
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) {
    return 'Invalid expiry date';
  }

  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    return 'Card has expired';
  }

  return null;
};

export const validateCardCvc = (cvc: string): string | null => {
  if (!/^\d{3}$/.test(cvc)) {
    return 'Invalid CVC';
  }
  return null;
};

export const formatCardNumber = (value: string): string => {
  // Remove any non-digit characters
  const digits = value.replace(/\D/g, '');

  // Group digits into sets of 4
  const groups = digits.match(/.{1,4}/g) || [];

  // Join groups with spaces
  return groups.join(' ');
};

export const formatCardExpiry = (value: string): string => {
  // Remove any non-digit characters
  let digits = value.replace(/\D/g, '');
  console.log({ value, digits })

  if (digits.length >= 2) {
    // Handle month formatting
    let month = digits.substring(0, 2);
    if (parseInt(month) > 12) {
      month = `0${month[0]}`; // Take first digit and add leading zero
      digits = '0' + digits
    } else if (parseInt(month) === 0) {
      month = '01';
    } else if (month.length === 1) {
      month = `0${month}`;
    }

    // Add slash and year
    if (digits.length >= 3) {
      return `${month}/${digits.substring(2, 4)}`;
    }
    return `${month}/`;
  }
  return digits;
};
