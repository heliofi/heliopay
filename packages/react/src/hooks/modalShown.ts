import { useCallback, useState } from 'react';

export const useModal = () => {
  const [isModalShown, setModalShown] = useState(false);
  const toggleModal = () => {
    if (isModalShown) {
      document.body.style.overflow = 'unset';
      setModalShown(false);
    } else {
      document.body.style.overflow = 'hidden';
      setModalShown(true);
    }
  };

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setModalShown(true);
  };

  const closeModal = useCallback(() => {
    document.body.style.overflow = 'unset';
    setModalShown(false);
  }, []);

  return {
    isModalShown,
    toggleModal,
    openModal,
    closeModal,
  };
};
