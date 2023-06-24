import React, { useState } from 'react';
import './index.css';

const LogMaintainer = ({logs, setLogs}) => {


  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="log-maintainer-container">
      <h3 className="log-maintainer-header">Logs:</h3>
      <button className="log-maintainer-button" onClick={clearLogs}>
        Clear Logs
      </button>
      <ul className="log-maintainer-list">
        {logs.map((log, index) => (
          <li key={index} className="log-maintainer-list-item">
            [{log.timestamp}] {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogMaintainer;
