import { useCallback, useEffect, useRef } from 'react';
import { KEYS } from '../domain/constants/keys';

const useOnClickOutside = (onClose: () => void) => {
  const ref = useRef(null);
  const escapeListener = useCallback((e: KeyboardEvent) => {
    if (e.key === KEYS.ESC) {
      onClose();
    }
  }, []);
  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (!(ref.current! as any).contains(e.target)) {
        onClose?.();
      }
    },
    [ref.current]
  );
  useEffect(() => {
    document.addEventListener('click', clickListener);
    document.addEventListener('keyup', escapeListener);
    return () => {
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keyup', escapeListener);
    };
  }, []);
  return ref;
};

export default useOnClickOutside;
