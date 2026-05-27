import AddCircleV4 from './AddCircleV4';
import AIAssistant from './AIAssistant';
import AlignCenter from './AlignCenter';
import AlignLeft from './AlignLeft';
import AlignRight from './AlignRight';
import ArrowDownV4 from './ArrowDownV4';
import ArrowElbow from './ArrowElbow';
import ArrowLeftAltRounded from './ArrowLeftAltRounded';
import ArrowRightAltRounded from './ArrowRightAltRounded';
import ArrowUpDown from './ArrowUpDown';
import ArrowUpV4 from './ArrowUpV4';
import ArrowUpCircle from './ArrowUpCircle';
import BackIcon from './BackIcon';
import CheckCircle from './CheckCircle';
import CheckCircleFilled from './CheckCircleFilled';
import CloseCircleV4 from './CloseCircleV4';
import CompareIcon from './CompareIcon';
import CountOfIcon from './CountOfIcon';
import CustomDashboardIconLight from './CustomDashboardIconLight';
import DesktopHidden from './DesktopHidden';
import DesktopVisible from './DesktopVisible';
import DeviceDesktop from './DeviceDesktop';
import DeviceMobile from './DeviceMobile';
import DeviceTablet from './DeviceTablet';
import DragV4 from './DragV4';
import EditPen from './EditPen';
import EditV4 from './EditV4';
import ExpandV4 from './ExpandV4';
import EyeClosed from './EyeClosed';
import EyeOpen from './EyeOpen';
import FillColor from './FillColor';
import FilterGroup from './FilterGroup';
import FilterV4 from './FilterV4';
import FontColor from './FontColor';
import FontWeightBold from './FontWeightBold';
import FontWeightRegular from './FontWeightRegular';
import FontWeightXBold from './FontWeightXBold';
import GridV4 from './GridV4';
import Horizontal from './Horizontal';
import LandscapeImage from './LandscapeImage';
import Link2 from './Link2';
import PeopleIcon from './PeopleIcon';
import MobileHidden from './MobileHidden';
import MobileVisible from './MobileVisible';
import MissionGraphic from './MissionGraphic';
import PlusV4 from './PlusV4';
import PortraitCircle from './PortraitCircle';
import PortraitImage from './PortraitImage';
import ResetV4 from './ResetV4';
import ScreensV4 from './ScreensV4';
import ScreenV4 from './ScreenV4';
import SettingsIcon from './SettingsIcon';
import SettingsIcon2 from './SettingsIcon2';
import SettingsIcon3 from './SettingsIcon3';
import SettingsLightIcon from './SettingsLightIcon';
import SkyscrapersIcon from './SkyscrapersIcon';
import StartEmptyV4 from './StarEmptyV4';
import StarFilledV4 from './StarFilledV4';
import Tabs from './Tabs';
import TabsCondensed from './TabsCondensed';
import TargetV4 from './TargetV4';
import TextAlignCenter from './TextAlignCenter';
import TextAlignJustify from './TextAlignJustify';
import TextAlignLeft from './TextAlignLeft';
import TextAlignRight from './TextAlignRight';
import TrashV4 from './TrashV4';
import Vertical from './Vertical';
import WarningV4 from './WarningV4';
import MoveIcon from './MoveIcon';
import XIcon from './XIcon';
import DuplicateIcon from './DuplicateIcon';
import Palette from './Palette';
import Book from './Book';
import FilesFolder from './FilesFolder';
import AiIcon from './AiIcon';
import AiGradientIcon from './AiGradientIcon';
import HomeIcon from './HomeIcon';
import Pages from './Pages';
import AiChat from './AiChat';
import AlertCircle from './AlertCircle';
import BoxRounded from './BoxRounded';
import { CloseCompact } from './icons';

// Define the widget icon map first to ensure type consistency
export const v4IconMap = {
  'count-of': CountOfIcon,
  settings: SettingsIcon,
  settings2: SettingsIcon2,
  settings3: SettingsIcon3,
  'filter-group': FilterGroup,
  'expand-V4': ExpandV4,
  'circle-plus-V4': AddCircleV4,
  'arrow-right-alt': ArrowRightAltRounded,
  'arrow-left-alt': ArrowLeftAltRounded,
  compare: CompareIcon,
  'check-circle': CheckCircle,
  'check-circle-filled': CheckCircleFilled,
  'grid-V4': GridV4,
  'arrow-up-down': ArrowUpDown,
  'arrow-up-V4': ArrowUpV4,
  'arrow-up-circle': ArrowUpCircle,
  'arrow-down-V4': ArrowDownV4,
  back: BackIcon,
  'drag-V4': DragV4,
  'filter-V4': FilterV4,
  'eye-open-V4': EyeOpen,
  'eye-closed-V4': EyeClosed,
  'tabs-V4': Tabs,
  'tabs-condensed-V4': TabsCondensed,
  'font-color': FontColor,
  'alert-circle': AlertCircle,
  'align-left': AlignLeft,
  'align-center': AlignCenter,
  'align-right': AlignRight,
  'text-align-left': TextAlignLeft,
  'text-align-center': TextAlignCenter,
  'text-align-right': TextAlignRight,
  'font-weight-regular': FontWeightRegular,
  'font-weight-bold': FontWeightBold,
  'font-weight-xbold': FontWeightXBold,
  'trash-V4': TrashV4,
  'edit-V4': EditV4,
  'edit-pen': EditPen,
  'reset-V4': ResetV4,
  settingsLight: SettingsLightIcon,
  'fill-color': FillColor,
  'ai-assistant': AIAssistant,
  'star-filled-V4': StarFilledV4,
  'star-empty-V4': StartEmptyV4,
  'arrow-elbow': ArrowElbow,
  'screens-V4': ScreensV4,
  'plus-V4': PlusV4,
  'screen-V4': ScreenV4,
  'portrait-circle': PortraitCircle,
  'portrait-image': PortraitImage,
  'landscape-image': LandscapeImage,
  'link-2': Link2,
  'mission-graphic': MissionGraphic,
  horizontal: Horizontal,
  vertical: Vertical,
  'circle-close-V4': CloseCircleV4,
  'close-compact': CloseCompact,
  'target-V4': TargetV4,
  'warning-V4': WarningV4,
  'desktop-visible': DesktopVisible,
  'desktop-hidden': DesktopHidden,
  'mobile-visible': MobileVisible,
  'mobile-hidden': MobileHidden,
  'device-desktop': DeviceDesktop,
  'device-tablet': DeviceTablet,
  'device-mobile': DeviceMobile,
  'text-align-justify': TextAlignJustify,
  'custom-dashboard-light': CustomDashboardIconLight,
  skyscrapers: SkyscrapersIcon,
  people: PeopleIcon,
  'move-icon': MoveIcon,
  'x-icon': XIcon,
  'duplicate-icon': DuplicateIcon,
  palette: Palette,
  book: Book,
  'files-folder': FilesFolder,
  'ai-icon': AiIcon,
  'ai-gradient-icon': AiGradientIcon,
  home: HomeIcon,
  pages: Pages,
  'ai-chat': AiChat,
  'box-rounded': BoxRounded,
} as const;

// Extract the type from the keys of the actual map to ensure they stay in sync
export type V4IconNames = keyof typeof v4IconMap;

// Type for the widget components themselves
export type V4IconComponents = (typeof v4IconMap)[V4IconNames];
