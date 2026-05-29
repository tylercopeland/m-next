import SvgIcon from './SvgIcon';
import { SvgIconName, MethodOnlySvgIconName } from './SvgIconNames';
import { RuntimeSvgIconName, iconComponentMap } from './LegacyIcons';
import iconList, { IconOption } from './icon-list';

// Primary named export uses the cleaned API name.
// SvgIcon remains the default export for backwards compatibility — many
// already-cleaned packages import it as `import SvgIcon from '@m-next/svg-icon'`.
const Icon = SvgIcon;

export default SvgIcon;
export { Icon, SvgIcon };
export type { SvgIconProps } from './SvgIcon';
export type { SvgIconProps as IconProps } from './SvgIcon';
export type { IconOption, SvgIconName, MethodOnlySvgIconName, RuntimeSvgIconName };
export type { WidgetIconNames } from './icons/widget-icons';
export { isValidIconName } from './SvgIconNames';

export { iconList, iconComponentMap };
export {
  CustomDashboardIcon,
  CountOfIcon,
  SettingsIcon,
  FilterGroup,
  EmptyFilterIcon,
  ExpandV4,
  AddCircleV4,
  ArrowRightAltRounded,
  ArrowLeftAltRounded,
  CheckCircle,
  CheckCircleFilled,
} from './icons/icons';
