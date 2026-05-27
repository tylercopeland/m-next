import SvgIcon from './SvgIcon';
import { SvgIconName, MethodOnlySvgIconName } from './SvgIconNames';
import { RuntimeSvgIconName, iconComponentMap } from './LegacyIcons';
import iconList, { IconOption } from './icon-list';

export default SvgIcon;
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
