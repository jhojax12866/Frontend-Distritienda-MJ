import React from "react";
import SoftAlert from "components/SoftAlert"; // Asume que tienes un componente SoftAlert

// eslint-disable-next-line react/prop-types
const AlertMessage = ({ message, onClose }) => {
  return (
    <SoftAlert
      severity="error"
      isOpen={!!message}
      message={message}
      onClose={onClose}
    />
  );
};

export default AlertMessage;