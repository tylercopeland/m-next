import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const MigrationBanner = styled.div(() => [
  {
    display: 'flex',
    padding: '8px 16px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    width: '100%',
    minWidth: '100%',
    boxSizing: 'border-box',
    borderRadius: 2,
    background: colors['blue-lighter'],
    flexShrink: 0,
    flexGrow: 0,
    position: 'relative',
  },
]);

export const BannerContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 12,
  },
]);

export const IconFrame = styled.div(() => [
  {
    display: 'flex',
    padding: 8,
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 100,
    background: colors.blue,
    flexShrink: 0,
  },
]);

export const BannerTextWrapper = styled.div(() => [
  {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
]);

export const BannerTitle = styled.span(() => [
  {
    color: colors['grey-dark'],
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: '"Source Sans Pro"',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '16px',
    flexShrink: 0,
  },
]);

export const BannerText = styled.span(() => [
  {
    color: colors['grey-dark'],
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: '"Source Sans Pro"',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
  },
]);
