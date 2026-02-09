import styles from './error.module.css';

type ErrorProps = {
  onRetry: () => void;
};

export const Error = ({ onRetry }: ErrorProps): React.JSX.Element => {
  return (
    <div className={styles.error_container}>
      <div className={styles.error_icon}>⚠️</div>

      <h3 className="text text_type_main-medium mt-4">Произошла ошибка</h3>

      {onRetry && (
        <button
          className={`${styles.retry_button} text text_type_main-default mt-6`}
          onClick={onRetry}
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
};
