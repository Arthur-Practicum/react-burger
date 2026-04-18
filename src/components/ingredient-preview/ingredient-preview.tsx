import type { FC } from 'react';

import styles from './ingredient-preview.module.css';

type IngredientPreviewProps = {
  image: string;
  name: string;
  count?: number;
};

export const IngredientPreview: FC<IngredientPreviewProps> = ({
  image,
  name,
  count,
}): React.JSX.Element => {
  return (
    <div className={styles.container} aria-label={name}>
      <img src={image} alt={name} className={styles.image} />

      {count ? <div className={styles.overlay}>+{count}</div> : null}
    </div>
  );
};
