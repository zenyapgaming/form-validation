const form = document.querySelector('#signup-form');
const fields = form.querySelectorAll('input, select');
const country = document.querySelector('#country');
const postal = document.querySelector('#postal');
const password = document.querySelector('#password');
const confirm = document.querySelector('#confirm');

const postalRules = {
  MY: { regex: /^\d{5}$/, msg: 'Malaysian postal code = 5 digits (e.g. 43000).' },
  US: { regex: /^\d{5}(-\d{4})?$/, msg: 'US ZIP = 5 digits (e.g. 90210) or ZIP+4.' },
  UK: { regex: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, msg: 'Enter a valid UK postcode (e.g. SW1A 1AA).' },
  SG: { regex: /^\d{6}$/, msg: 'Singapore postal code = 6 digits (e.g. 238823).' },
};

function getError(input) {
  input.setCustomValidity(''); // reset first, or old errors stick
  const { value, validity } = input;

  if (validity.valueMissing) return 'This field is required.';

  switch (input.id) {
    case 'email':
      if (validity.typeMismatch) return 'Enter a valid email, e.g. name@example.com.';
      break;
    case 'postal': {
      const rule = postalRules[country.value];
      if (!rule) return 'Pick a country first.';
      if (!rule.regex.test(value)) return rule.msg;
      break;
    }
    case 'password':
      if (validity.tooShort) return `Min 8 characters (you have ${value.length}).`;
      break;
    case 'confirm':
      if (value !== password.value) return 'Passwords do not match.';
      break;
  }
  return '';
}

function validate(input) {
  const msg = getError(input);
  input.setCustomValidity(msg); // keeps checkValidity() + :user-invalid in sync
  input.nextElementSibling.textContent = msg; // the .error span
  return msg === '';
}

fields.forEach((input) => {
  // validate when user leaves the field
  input.addEventListener('blur', () => {
    input.dataset.touched = 'true';
    validate(input);
  });
  // after that, validate live as they type
  input.addEventListener('input', () => {
    if (input.dataset.touched) validate(input);
  });
});

// dependent fields
country.addEventListener('change', () => {
  if (postal.value) validate(postal);
});
password.addEventListener('input', () => {
  if (confirm.value) validate(confirm);
});

const message = document.querySelector('#form-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // validate ALL fields (don't stop at the first bad one)
  const results = [...fields].map((input) => {
    input.dataset.touched = 'true';
    return validate(input);
  });

  if (results.includes(false)) {
    message.textContent = 'Please fix the errors above before submitting.';
    message.className = 'message-error';
    form.querySelector(':invalid')?.focus(); // jump to first bad field
    return;
  }

  message.textContent = 'High five! 🙌 All good.';
  message.className = 'message-success';
  form.reset();
  fields.forEach((input) => {
    delete input.dataset.touched;
    input.nextElementSibling.textContent = '';
  });
});