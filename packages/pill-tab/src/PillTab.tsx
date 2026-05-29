import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  KeyboardEvent,
} from 'react';
import { PillTabOption, PillTabProps, PillTabSize } from './types';
import { PillTabContainer, PillTabButton, PillTabLink } from './PillTab.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/toggle / @m-next/input.
const warnOnce = (() => {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

// Legacy size aliases — soft-shimmed (`narrow` → `sm`, `regular` → `md`),
// mirroring the @m-next/pill cleanup precedent.
const LEGACY_SIZE_MAP: Record<string, PillTabSize> = {
  narrow: 'sm',
  regular: 'md',
};

/**
 * SegmentedControl (legacy name: PillTab).
 *
 * A horizontal toggle between a small set of mutually-exclusive options.
 * Same surface as an iOS-style segmented control. Internally renders a
 * `role="radiogroup"` with each option as `role="radio"`. Arrow keys
 * move focus + selection between options.
 */
function PillTabInner<T = string>(
  props: PillTabProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    id: idProp,
    options: optionsProp,
    value: valueProp,
    onChange,
    className,
    style,
    size = 'md',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'data-testid': dataTestId = 'pill-tab',

    // Soft-shimmed legacy props
    items: legacyItems,
    selected: legacySelected,
    legacySize,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,
    displayAuto: _displayAuto,
  } = props;

  // ============ Auto-generate id if not provided ============
  const internalIdRef = useRef<string | null>(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-segmented-control-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let options = optionsProp;
  if (!options && legacyItems) {
    warnOnce(
      'pill-tab-items',
      '@m-next/pill-tab: `items` is deprecated. Use `options`.',
    );
    options = legacyItems;
  }
  const resolvedOptions = options ?? [];

  let value = valueProp;
  if (value === undefined && legacySelected !== undefined) {
    warnOnce(
      'pill-tab-selected',
      '@m-next/pill-tab: `selected` is deprecated. Use `value`.',
    );
    value = legacySelected;
  }

  let resolvedSize: PillTabSize = size;
  const legacyMapped = legacySize != null ? LEGACY_SIZE_MAP[String(legacySize)] : undefined;
  if (legacyMapped) {
    warnOnce(
      'pill-tab-legacy-size',
      `@m-next/pill-tab: size "${legacySize}" is deprecated. Use "${legacyMapped}".`,
    );
    resolvedSize = legacyMapped;
  } else if (size && !(['sm', 'md'] as string[]).includes(size)) {
    // Allow size="narrow" / "regular" to be passed through `size` itself.
    const mapped = LEGACY_SIZE_MAP[String(size)];
    if (mapped) {
      warnOnce(
        'pill-tab-size-narrow-regular',
        `@m-next/pill-tab: size "${size}" is deprecated. Use "${mapped}".`,
      );
      resolvedSize = mapped;
    }
  }

  if (legacyForwardRef) {
    warnOnce(
      'pill-tab-forwardRef-prop',
      '@m-next/pill-tab: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Refs ============

  const containerRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);
  useEffect(() => {
    if (!legacyForwardRef) return;
    if (typeof legacyForwardRef === 'function') {
      legacyForwardRef(containerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      (legacyForwardRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current;
    }
  }, [legacyForwardRef]);

  // ============ Handlers ============

  const handleTabClick = (option: PillTabOption<T>) => {
    if (option.disabled) return;
    // For links, let the browser handle navigation.
    if (option.href) return;
    onChange?.(option.value);
  };

  // Arrow-key navigation: move selection + focus between enabled options.
  const moveSelection = (currentIndex: number, direction: 1 | -1) => {
    const total = resolvedOptions.length;
    if (total === 0) return;
    let next = currentIndex;
    for (let step = 0; step < total; step += 1) {
      next = (next + direction + total) % total;
      const opt = resolvedOptions[next];
      if (opt && !opt.disabled) {
        if (!opt.href) onChange?.(opt.value);
        // Focus the new option's interactive element.
        const root = containerRef.current;
        if (root) {
          const focusable = root.querySelectorAll<HTMLElement>(
            '[data-pill-tab-option]',
          );
          focusable[next]?.focus();
        }
        return;
      }
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLElement>,
    index: number,
    option: PillTabOption<T>,
  ) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        moveSelection(index, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        moveSelection(index, -1);
        break;
      case ' ':
      case 'Enter':
        if (!option.href) {
          e.preventDefault();
          handleTabClick(option);
        }
        break;
      default:
        break;
    }
  };

  // ============ Render ============

  // Roving tabindex fallback — if no option matches `value`, the first enabled
  // option becomes the tab stop so the radiogroup is keyboard-reachable.
  const hasSelection = resolvedOptions.some((o) => o.value === value && !o.disabled);
  const firstEnabledIndex = resolvedOptions.findIndex((o) => !o.disabled);

  return (
    <PillTabContainer
      ref={containerRef}
      id={id}
      className={className}
      style={style}
      data-testid={dataTestId}
      sizeVariant={resolvedSize}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {resolvedOptions.map((option, index) => {
        const isSelected = option.value === value;
        const isFallbackTabStop = !hasSelection && index === firstEnabledIndex;
        const commonProps = {
          key: String(option.value),
          isSelected,
          disabled: option.disabled,
          sizeVariant: resolvedSize,
          onClick: () => handleTabClick(option),
          onKeyDown: (e: KeyboardEvent<HTMLElement>) =>
            handleKeyDown(e, index, option),
          'aria-checked': isSelected,
          'aria-disabled': option.disabled,
          // Roving tabindex: selected option (or first enabled fallback) is tabbable.
          tabIndex: isSelected || isFallbackTabStop ? 0 : -1,
          role: 'radio',
          'data-pill-tab-option': '',
          'data-testid': `pill-tab-option-${String(option.value)}`,
        };

        // Render as link if href is provided.
        if (option.href) {
          return (
            <PillTabLink
              {...commonProps}
              as="a"
              href={option.href}
              target={option.target}
              rel={option.rel}
            >
              {option.label}
            </PillTabLink>
          );
        }

        // Render as button.
        return (
          <PillTabButton {...commonProps} type="button">
            {option.label}
          </PillTabButton>
        );
      })}
    </PillTabContainer>
  );
}

// forwardRef + generic-friendly wrapper. Cast preserves the generic call signature.
const PillTab = forwardRef(PillTabInner) as <T = string>(
  // eslint-disable-next-line no-unused-vars
  props: PillTabProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof PillTabInner>;

(PillTab as unknown as { displayName: string }).displayName = 'PillTab';

export default PillTab;
/** Canonical name. PillTab is kept as the legacy default export. */
export const SegmentedControl = PillTab;
