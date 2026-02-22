import styles from './empty-constructor.module.css';

export const EmptyConstructor = (): React.JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <p className="text text_type_main-medium">Выберите булки и ингредиенты</p>
    </div>
  );
};
