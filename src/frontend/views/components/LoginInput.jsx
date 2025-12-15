import React from 'react';
import PropTypes from 'prop-types';

export default function LoginInput({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

LoginInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};
