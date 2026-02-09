import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const ModalOverlay = ({
  children,
  onClose,
}: ModalOverlayProps): React.JSX.Element => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      {children}
    </div>
  );
};
