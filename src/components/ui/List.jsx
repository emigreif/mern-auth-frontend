// src/components/ui/List.jsx
import React from "react";
import styles from "../styles/components/List.module.css";

export default function List({ items = [], renderItem }) {
  if (!items.length) return <p className={styles.noData}>Lista vacía</p>;

  return <ul className={styles.list}>{items.map(renderItem)}</ul>;
}
