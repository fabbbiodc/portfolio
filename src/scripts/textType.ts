interface TextTypeConfig {
  text: string | string[];
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

class TextTypeAnimation {
  private container: HTMLElement;
  private displayEl: HTMLElement;
  private cursorEl: HTMLElement | null;
  private config: Required<
    Omit<TextTypeConfig, 'onSentenceComplete' | 'variableSpeed'>
  > & {
    onSentenceComplete?: (sentence: string, index: number) => void;
    variableSpeed?: { min: number; max: number };
  };

  private textArray: string[];
  private currentTextIndex = 0;
  private currentCharIndex = 0;
  private displayedText = '';
  private isDeleting = false;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private observer: IntersectionObserver | null = null;
  private isVisible: boolean;
  private destroyed = false;

  constructor(container: HTMLElement, config: TextTypeConfig) {
    this.container = container;

    const displayEl = container.querySelector<HTMLElement>(
      '[data-text-type-display]',
    );
    if (!displayEl)
      throw new Error('TextType: display element not found');
    this.displayEl = displayEl;

    this.cursorEl = container.querySelector<HTMLElement>(
      '[data-text-type-cursor]',
    );

    this.isVisible = !config.startOnVisible;

    this.config = {
      text: config.text,
      typingSpeed: config.typingSpeed ?? 50,
      initialDelay: config.initialDelay ?? 0,
      pauseDuration: config.pauseDuration ?? 2000,
      deletingSpeed: config.deletingSpeed ?? 30,
      loop: config.loop ?? true,
      showCursor: config.showCursor ?? true,
      hideCursorWhileTyping: config.hideCursorWhileTyping ?? false,
      cursorCharacter: config.cursorCharacter ?? '|',
      cursorBlinkDuration: config.cursorBlinkDuration ?? 0.5,
      cursorClassName: config.cursorClassName ?? '',
      textColors: config.textColors ?? [],
      variableSpeed: config.variableSpeed,
      onSentenceComplete: config.onSentenceComplete,
      startOnVisible: config.startOnVisible ?? false,
      reverseMode: config.reverseMode ?? false,
    };

    this.textArray = Array.isArray(this.config.text)
      ? this.config.text
      : [this.config.text];

    this.setupCursor();
    this.setupVisibilityObserver();

    if (this.isVisible) {
      this.timeout = setTimeout(
        () => this.step(),
        this.config.initialDelay,
      );
    }
  }

  private getRandomSpeed(): number {
    if (!this.config.variableSpeed) return this.config.typingSpeed;
    const { min, max } = this.config.variableSpeed;
    return Math.random() * (max - min) + min;
  }

  private getCurrentTextColor(): string {
    if (this.config.textColors.length === 0) return '';
    return this.config.textColors[
      this.currentTextIndex % this.config.textColors.length
    ];
  }

  private setupCursor(): void {
    if (!this.cursorEl || !this.config.showCursor) return;
    this.cursorEl.style.animationDuration = `${this.config.cursorBlinkDuration}s`;
    if (this.config.cursorClassName) {
      this.cursorEl.classList.add(this.config.cursorClassName);
    }
  }

  private setupVisibilityObserver(): void {
    if (!this.config.startOnVisible) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.observer?.disconnect();
            if (!this.destroyed) {
              this.timeout = setTimeout(
                () => this.step(),
                this.config.initialDelay,
              );
            }
          }
        }
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.container);
  }

  private step(): void {
    if (this.destroyed || !this.isVisible) return;

    const currentText = this.textArray[this.currentTextIndex];
    const processedText = this.config.reverseMode
      ? currentText.split('').reverse().join('')
      : currentText;

    if (this.isDeleting) {
      if (this.displayedText === '') {
        this.isDeleting = false;

        if (
          this.currentTextIndex === this.textArray.length - 1 &&
          !this.config.loop
        )
          return;

        if (this.config.onSentenceComplete) {
          this.config.onSentenceComplete(
            this.textArray[this.currentTextIndex],
            this.currentTextIndex,
          );
        }

        this.currentTextIndex =
          (this.currentTextIndex + 1) % this.textArray.length;
        this.currentCharIndex = 0;

        this.timeout = setTimeout(
          () => this.step(),
          this.config.initialDelay,
        );
        return;
      }

      this.displayedText = this.displayedText.slice(0, -1);
      this.updateDisplay();
      this.timeout = setTimeout(
        () => this.step(),
        this.config.deletingSpeed,
      );
      return;
    }

    if (this.currentCharIndex < processedText.length) {
      this.displayedText += processedText[this.currentCharIndex];
      this.currentCharIndex++;
      this.updateDisplay();
      this.timeout = setTimeout(
        () => this.step(),
        this.getRandomSpeed(),
      );
      return;
    }

    if (this.textArray.length >= 1) {
      if (
        !this.config.loop &&
        this.currentTextIndex === this.textArray.length - 1
      )
        return;
      this.isDeleting = true;
      this.timeout = setTimeout(
        () => this.step(),
        this.config.pauseDuration,
      );
    }
  }

  private updateDisplay(): void {
    this.displayEl.textContent = this.displayedText;
    const color = this.getCurrentTextColor();
    this.displayEl.style.color = color || '';
  }

  destroy(): void {
    this.destroyed = true;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.observer?.disconnect();
  }
}

function initTextTypes(): void {
  document
    .querySelectorAll<HTMLElement>('[data-text-type]')
    .forEach((el) => {
      try {
        const textAttr = el.getAttribute('data-text');
        if (!textAttr) return;

        const config: TextTypeConfig = {
          text: JSON.parse(textAttr),
        };

        const numProps: [string, keyof TextTypeConfig][] = [
          ['data-typing-speed', 'typingSpeed'],
          ['data-initial-delay', 'initialDelay'],
          ['data-pause-duration', 'pauseDuration'],
          ['data-deleting-speed', 'deletingSpeed'],
          ['data-cursor-blink-duration', 'cursorBlinkDuration'],
        ];

        for (const [attr, key] of numProps) {
          const val = el.getAttribute(attr);
          if (val !== null) {
            (config as Record<string, unknown>)[key] = Number(val);
          }
        }

        const boolProps: [string, keyof TextTypeConfig][] = [
          ['data-loop', 'loop'],
          ['data-show-cursor', 'showCursor'],
          [
            'data-hide-cursor-while-typing',
            'hideCursorWhileTyping',
          ],
          ['data-start-on-visible', 'startOnVisible'],
          ['data-reverse-mode', 'reverseMode'],
        ];

        for (const [attr, key] of boolProps) {
          const val = el.getAttribute(attr);
          if (val !== null) {
            (config as Record<string, unknown>)[key] =
              val === 'true';
          }
        }

        const strAttr = el.getAttribute('data-cursor-character');
        if (strAttr !== null) {
          config.cursorCharacter = strAttr;
        }

        const colorsAttr = el.getAttribute('data-text-colors');
        if (colorsAttr) {
          try {
            config.textColors = JSON.parse(colorsAttr);
          } catch {
            /* ignore */
          }
        }

        const speedAttr = el.getAttribute('data-variable-speed');
        if (speedAttr) {
          try {
            config.variableSpeed = JSON.parse(speedAttr);
          } catch {
            /* ignore */
          }
        }

        new TextTypeAnimation(el, config);
      } catch (e) {
        console.error('TextType: failed to initialize', e);
      }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextTypes);
} else {
  initTextTypes();
}
