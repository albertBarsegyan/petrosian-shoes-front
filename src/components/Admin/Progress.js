import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({ percentage }) => {
  return (
    <div className='progress' >
      <div
      style={{width: `${percentage}%`}}
        className='progress-success'
        role='progressbar'
      >
        <p>{percentage}%</p>
      </div>
    </div>
  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default Progress;