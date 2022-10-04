import React from 'react';

import "./styles/button.css";

const sizes = {
  default: `buttonDefault`,
  lg: `buttonLg`,
  xl: `buttonXl`
};

const fontSizes = {
  default: `0.875rem`,
  sm: `0.875rem`,
  md: `0.950rem`,
  lg: `1.025rem`,
  xl: `1.2rem`
};




const Button = ({ children, textSize = '', size, onClick, opposite, outline, customMargin, outlineNoHover, disabled, customType, className }) => {
  return (
    <button
      style={{
            fontSize: `${fontSizes[textSize] || fontSizes.default}`,
            fontFamily: 'Nunito',
            margin: customMargin
          }}
      type={`${customType ? customType : 'button'}`}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size] || sizes.default}
        ${opposite ? `buttonOpposite` : ``}
        ${outline ? `buttonOutline` : ``}
        ${outlineNoHover ? `buttonOutlineNoHover` : ``}
        ${className ? className : ``}
        ${!outlineNoHover && !outline && !opposite ? `button` : ``}
    `}
    >
      {children}
    </button>
  );
};

export default Button;
