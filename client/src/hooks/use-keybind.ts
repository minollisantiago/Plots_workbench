import { useEffect } from "react";

type KeybindConfig = {
  keybind: string;
  action: () => void;
}

interface UseKeybindOptions {
  preventDefault?: boolean;
}

// Map of special keys to their event.code values
const SPECIAL_KEYS: Record<string, string> = {
  'del': 'Delete',
  'backspace': 'Backspace',
  'enter': 'Enter',
  'space': 'Space',
  'tab': 'Tab',
  'esc': 'Escape',
  'up': 'ArrowUp',
  'down': 'ArrowDown',
  'left': 'ArrowLeft',
  'right': 'ArrowRight',
};

export const useKeybind = (keybinds: KeybindConfig[], options: UseKeybindOptions = { preventDefault: true }) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlKey = event.ctrlKey;
      const keyPressed = event.key.toLowerCase();
      const keyCode = event.code;

      keybinds.forEach(({ keybind, action }) => {
        if (!keybind) return;

        const normalizedKeybind = keybind.toLowerCase();

        if (normalizedKeybind.includes('+')) {
          const [modifier, targetKey] = normalizedKeybind.split('+');

          if (modifier === 'ctrl' && isCtrlKey) {
            // handle ctrl+number cases
            if (targetKey.match(/[1-9]/)) {
              const numberPressed = event.code.replace('Digit', '');
              if (numberPressed === targetKey) {
                if (options.preventDefault) event.preventDefault();
                action();
                return;
              }
            }
            // handle ctrl+special key cases
            else if (SPECIAL_KEYS[targetKey] && keyCode === SPECIAL_KEYS[targetKey]) {
              if (options.preventDefault) event.preventDefault();
              action();
              return;
            }
            // handle other ctrl+ cases
            else if (keyPressed === targetKey) {
              if (options.preventDefault) event.preventDefault();
              action();
              return;
            }
          }
        } else if (SPECIAL_KEYS[normalizedKeybind] && keyCode === SPECIAL_KEYS[normalizedKeybind]) {
          // handle special key cases
          if (options.preventDefault) event.preventDefault();
          action();
        } else if (keyPressed === normalizedKeybind) {
          // handle simple keybinds
          if (options.preventDefault) event.preventDefault();
          action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keybinds, options.preventDefault]);
};
