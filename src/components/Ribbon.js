import React from 'react';
import './Ribbon.css'; // Import your CSS file for styling

const Ribbon = ({ children }) => {
    return (
        <div className="ribbon">
            <span>{children}</span>
        </div>
    );
};

export default Ribbon;
