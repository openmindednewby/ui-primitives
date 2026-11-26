import { useEffect, type RefObject } from 'react';

import { Platform } from 'react-native';

const ESCAPE_KEY = 'Escape';

/** Closes an open tip on Escape or on a pointer press outside `rootRef` (web only). */
export function useInfoTipDismiss(open: boolean, rootRef: RefObject<unknown>, onDismiss: () => void): void {
  useEffect(() => {
    if (!open || Platform.OS !== 'web' || typeof document === 'undefined') {return undefined;}
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) {onDismiss();}
    };
    const onPointer = (event: Event): void => {
      const root = rootRef.current as Node | null;
      if (root !== null && event.target instanceof Node && root.contains(event.target)) {return;}
      onDismiss();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return (): void => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, rootRef, onDismiss]);
}
