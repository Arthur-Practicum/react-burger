import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '@components/modal/modal-overlay/modal-overlay.tsx';

import styles from './modal.module.css';

type ModalProps = {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({
  isOpen,
  children,
  onClose,
  title,
}: ModalProps): React.JSX.Element | null => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClose={onClose}>
      <div className={`${styles.modal} custom-scroll`}>
        <div className={styles.header}>
          {title && <h2 className={'text text_type_main-medium'}>{title}</h2>}

          <CloseIcon className={styles.icon} type={'primary'} onClick={onClose} />
        </div>

        {children}
      </div>
    </ModalOverlay>,
    document.getElementById('modals')!
  );
};
