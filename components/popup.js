import React from 'react';
import { X } from 'react-feather';

import './styles/popup.css';

const Popup = ( { children, showPopup, setShowPopup } ) => {

  const handleKeyDown = (ev, showPopup, setShowPopup) => {
    if (ev.keyCode === 13 && !showPopup) {
      // enter to open
      setShowPopup(true);
    } else if (ev.keyCode === 27 && showPopup) {
      // escape to close
      setShowPopup(false);
    }
  }

  return (
    <>
      {showPopup ? (
        <div className="popup-overlay">
          <div
            className="popup-background"
            onClick={ (e) => setShowPopup(!showPopup) }
            onKeyDown={ (e) => handleKeyDown(e, showPopup, setShowPopup) }
            tabIndex={0}
            aria-label="Toggle Popup"
            role="button"
          ></div>
          <div className="popup-inner">
            <X
              className="popup-close"
              onClick={ (e) => setShowPopup(!showPopup) }
              onKeyDown={ (e) => handleKeyDown(e, showPopup, setShowPopup) }
              tabIndex={0}
              aria-label="Toggle Popup"
              role="button"
            />
            {children}
          </div>
        </div>
      ) : null}
    </>
  )
}
export default Popup
