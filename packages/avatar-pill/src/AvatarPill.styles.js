import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// Token lookup that survives a missing shade — graceful in case a palette
// family (e.g. `teal`) is missing a `lighter`/`lightest` tier.
const tone = (family, shade, fallback) => {
  const palette = colors[family];
  if (!palette) return fallback;
  return palette[shade] || palette.light || fallback;
};

// Pill background by colorScheme + variant.
//   - subtle: lighter shade (cool, low-emphasis chip — default)
//   - solid:  light shade   (slightly more saturated, higher-emphasis)
// Text color stays grey.darker for legibility in both variants, matching
// the original MethodUI AvatarPill treatment.
const bgFor = (colorScheme, variant) => {
  if (variant === 'solid') return tone(colorScheme, 'light', '#B3E5FF');
  return tone(colorScheme, 'lighter', '#E5F7FF');
};

// Size table — three tiers. `md` matches MethodUI's "regular" desktop size
// (16px height, 12px text). `sm` matches "narrow" (compact density). `lg`
// is new — gives mobile/touch contexts a chunkier hit target.
const SIZES = {
  sm: {
    height: 20,
    paddingX: 6,
    radius: 10,
    avatarSize: 14,
    iconSize: 12,
    fontSize: 11,
    lineHeight: 14,
    gap: 4,
  },
  md: {
    height: 24,
    paddingX: 8,
    radius: 12,
    avatarSize: 18,
    iconSize: 14,
    fontSize: 12,
    lineHeight: 16,
    gap: 6,
  },
  lg: {
    height: 32,
    paddingX: 10,
    radius: 16,
    avatarSize: 24,
    iconSize: 16,
    fontSize: 14,
    lineHeight: 18,
    gap: 8,
  },
};

export const getSize = (size) => SIZES[size] || SIZES.md;

export const Wrapper = styled.span((props) => {
  const sz = getSize(props.size);
  const bg = bgFor(props.colorScheme, props.variant);
  return {
    display: 'inline-flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    boxSizing: 'border-box',
    height: sz.height,
    padding: `0 ${sz.paddingX}px`,
    borderRadius: sz.radius,
    background: bg,
    color: colors.grey.dark || '#2A394A',
    maxWidth: props.maxWidth || '100%',
    fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
    gap: sz.gap,
    cursor: props.hasClick ? 'pointer' : 'default',
    border: 'none',
    outline: 'none',
    verticalAlign: 'middle',
    transition: 'background 120ms ease',
    ':focus-visible': props.hasClick
      ? {
          boxShadow: `0 0 0 2px ${colors.blue.base || '#0D71C8'}`,
        }
      : undefined,
    ':hover': props.hasClick
      ? {
          background: tone(props.colorScheme, 'light', bg),
        }
      : undefined,
  };
});

export const Avatar = styled.span((props) => {
  const sz = getSize(props.size);
  const palette = colors[props.colorScheme] || colors.blue;
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: sz.avatarSize,
    height: sz.avatarSize,
    borderRadius: '50%',
    overflow: 'hidden',
    background: palette.base || '#0D71C8',
    color: colors.white || '#FFFFFF',
    fontSize: Math.max(8, Math.floor(sz.avatarSize * 0.45)),
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'uppercase',
    userSelect: 'none',
  };
});

export const AvatarImg = styled.img({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const IconSlot = styled.span((props) => {
  const sz = getSize(props.size);
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: sz.iconSize,
    height: sz.iconSize,
    color: 'currentColor',
  };
});

export const TrailButton = styled.button((props) => {
  const sz = getSize(props.size);
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: sz.iconSize + 4,
    height: sz.iconSize + 4,
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'transparent',
    borderRadius: '50%',
    color: 'currentColor',
    cursor: 'pointer',
    lineHeight: 0,
    ':hover': {
      background: 'rgba(0, 0, 0, 0.08)',
    },
    ':focus-visible': {
      outline: `2px solid ${colors.blue.base || '#0D71C8'}`,
      outlineOffset: 1,
    },
  };
});

export const Label = styled.span((props) => {
  const sz = getSize(props.size);
  return {
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 0,
    fontSize: sz.fontSize,
    lineHeight: `${sz.lineHeight}px`,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
});
