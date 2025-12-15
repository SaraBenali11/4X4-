import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ConfirmModal.css';

export default function ConfirmModal({
  title = 'Confirmation',
  message = 'Are you sure?',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
}) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <header className="confirm-modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onCancel} aria-label="Fermer">
            ✖
          </button>
        </header>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <footer className="confirm-modal-footer">
          <button className="btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button className="btn-primary" onClick={onConfirm}>{confirmText}</button>
        </footer>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};
