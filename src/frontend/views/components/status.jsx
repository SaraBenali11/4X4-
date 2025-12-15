import React from 'react';
import PropTypes from 'prop-types';

export default function StatusBadge({ status }) {
  let cls = '';
  if (status === 'Confirmée') {
    cls = 'badge confirmed';
  } else if (status === 'Reçue') {
    cls = 'badge recu';
  } else if (status === 'Retournée') {
    cls = 'badge retournee';
  } else {
    cls = 'badge pending';
  }
  return <span className={cls}>{status}</span>;
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};
