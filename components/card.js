import React from 'react';

const Card = ({ customStyle = {}, className, children }) => {

  let defaultStyles = {
      borderColor: `var(--color-primary-50-transparent)`,
      borderRadius: `0.5rem`,
      borderStyle: `solid`,
      borderWidth: `1px`,
      boxShadow: '0 10px 28px rgba(0,0,0,.08)',
      padding: `3rem`,
  };

  Object.keys(customStyle).forEach((key, i) => {
    defaultStyles[key] = customStyle[key];
  });

  return (
    <div
      style={defaultStyles}
      className={className}
    >
      {children}
    </div>
  );
}


export default Card;
