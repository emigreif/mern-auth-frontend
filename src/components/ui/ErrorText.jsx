// src/components/ui/ErrorText.jsx
import React from "react";
import styles from "../../styles/pages/GlobalStylePages.module.css"; // Usa .error global

const ErrorText = ({ children }) => {
  if (!children) return null;
  return <p >{children}</p>;
};

export default ErrorText;
