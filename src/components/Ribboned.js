import React from 'react';
import './Ribboned.css'; // Import your CSS file for styling

const Ribboned = ({ children }) => {
    return (
        <div className="ribbon1">
            <span>{children}</span>
        </div>
    );
};

export default Ribboned;
