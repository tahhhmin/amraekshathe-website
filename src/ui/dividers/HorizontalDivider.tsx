// components/HorizontalDivider.tsx

import Styles from './Divider.module.css';

interface DividerProps {
    backgroundColor?: string; // Optional prop
}

export default function HorizontalDivider({ backgroundColor }: DividerProps) {
  return (
    <div
      className={Styles.horizontalDivider}
      style={{ backgroundColor }} // Inline override
    ></div>
  );
}
