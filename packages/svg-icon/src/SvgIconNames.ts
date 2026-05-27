// This file defines all valid icon names that can be used with the SvgIcon component
// It provides type safety and autocompletion for the name property

import { v4IconMap, V4IconNames } from './icons';
import { widgetIconMap, WidgetIconNames } from './icons/widget-icons';
import { RuntimeSvgIconName, validRuntimeIconNames } from './LegacyIcons';
import AlignCenter from './icons/AlignCenter';
import AlignLeft from './icons/AlignLeft';
import AlignRight from './icons/AlignRight';
import ArrowDownV4 from './icons/ArrowDownV4';
import ArrowElbow from './icons/ArrowElbow';
import ArrowLeftAltRounded from './icons/ArrowLeftAltRounded';
import ArrowRightAltRounded from './icons/ArrowRightAltRounded';
import ArrowUpDown from './icons/ArrowUpDown';
import ArrowUpV4 from './icons/ArrowUpV4';
import CheckCircle from './icons/CheckCircle';
import CheckCircleFilled from './icons/CheckCircleFilled';
import CompareIcon from './icons/CompareIcon';
import CountOfIcon from './icons/CountOfIcon';
import DragV4 from './icons/DragV4';
import EditV4 from './icons/EditV4';
import ExpandV4 from './icons/ExpandV4';
import EyeClosed from './icons/EyeClosed';
import EyeOpen from './icons/EyeOpen';
import FillColor from './icons/FillColor';
import FilterGroup from './icons/FilterGroup';
import FilterV4 from './icons/FilterV4';
import FontColor from './icons/FontColor';
import FontWeightBold from './icons/FontWeightBold';
import FontWeightRegular from './icons/FontWeightRegular';
import FontWeightXBold from './icons/FontWeightXBold';
import GridV4 from './icons/GridV4';
import Horizontal from './icons/Horizontal';
import LandscapeImage from './icons/LandscapeImage';
import Link2 from './icons/Link2';
import PlusV4 from './icons/PlusV4';
import PortraitImage from './icons/PortraitImage';
import ResetV4 from './icons/ResetV4';
import ScreensV4 from './icons/ScreensV4';
import ScreenV4 from './icons/ScreenV4';
import SettingsIcon from './icons/SettingsIcon';
import SettingsIcon2 from './icons/SettingsIcon2';
import SettingsIcon3 from './icons/SettingsIcon3';
import StartEmptyV4 from './icons/StarEmptyV4';
import StarFilledV4 from './icons/StarFilledV4';
import Tabs from './icons/Tabs';
import TabsCondensed from './icons/TabsCondensed';
import TextAlignCenter from './icons/TextAlignCenter';
import TextAlignLeft from './icons/TextAlignLeft';
import TextAlignRight from './icons/TextAlignRight';
import TrashV4 from './icons/TrashV4';
import SettingsLightIcon from './icons/SettingsLightIcon';
import CustomDashboardIconLight from './icons/CustomDashboardIconLight';
import SkyscrapersIcon from './icons/SkyscrapersIcon';
import PeopleIcon from './icons/PeopleIcon';
import ThumbsUpIcon from './icons/ThumbsUp';
import ThumbsDownIcon from './icons/ThumbsDown';
import ArrowUpCircle from './icons/ArrowUpCircle';
import XIcon from './icons/XIcon';
import DuplicateIcon from './icons/DuplicateIcon';
import Palette from './icons/Palette';
import Pages from './icons/Pages';
import AiChat from './icons/AiChat';
import DesktopVisible from './icons/DesktopVisible';
import DesktopHidden from './icons/DesktopHidden';
import MobileVisible from './icons/MobileVisible';
import MobileHidden from './icons/MobileHidden';

/**
 * Union type of all valid icon names that can be used with the SvgIcon component.
 * This includes:
 * 1. Custom component icons from iconComponentMap
 * 2. SVG path icons from icon-paths.js (including all comma-separated alternatives)
 */

export const v4Icons = [
  'count-of',
  'settings',
  'settings2',
  'settings3',
  'settingsLight',
  'filter-group',
  'expand-V4',
  'circle-plus-V4',
  'arrow-right-alt',
  'arrow-left-alt',
  'compare',
  'check-circle',
  'check-circle-filled',
  'grid-V4',
  'arrow-up-down',
  'arrow-up-circle',
  'arrow-up-V4',
  'arrow-down-V4',
  'drag-V4',
  'filter-V4',
  'eye-open-V4',
  'eye-closed-V4',
  'tabs-V4',
  'tabs-condensed-V4',
  'font-color',
  'align-left',
  'align-center',
  'align-right',
  'text-align-left',
  'text-align-center',
  'text-align-right',
  'text-align-justify',
  'font-weight-regular',
  'font-weight-bold',
  'font-weight-xbold',
  'trash-V4',
  'edit-V4',
  'reset-V4',
  'fill-color',
  'ai-assistant',
  'star-filled-V4',
  'star-empty-V4',
  'arrow-elbow',
  'screens-V4',
  'link-2',
  'plus-V4',
  'screen-V4',
  'portrait-circle',
  'portrait-image',
  'landscape-image',
  'horizontal',
  'vertical',
  'custom-dashboard-light',
  'skyscrapers',
  'people',
  'thumbs-up',
  'thumbs-down',
  'x-icon',
  'duplicate-icon',
  'palette',
] as const;

export type V4IconDict = {
  [k in V4IconNames]:
    | React.ComponentType
    | typeof AlignCenter
    | typeof AlignLeft
    | typeof AlignRight
    | typeof ArrowDownV4
    | typeof ArrowElbow
    | typeof ArrowLeftAltRounded
    | typeof ArrowRightAltRounded
    | typeof ArrowUpDown
    | typeof ArrowUpCircle
    | typeof ArrowUpV4
    | typeof CheckCircle
    | typeof CheckCircleFilled
    | typeof CompareIcon
    | typeof CountOfIcon
    | typeof DragV4
    | typeof EditV4
    | typeof ExpandV4
    | typeof EyeClosed
    | typeof EyeOpen
    | typeof FillColor
    | typeof FilterGroup
    | typeof FilterV4
    | typeof FontColor
    | typeof FontWeightBold
    | typeof FontWeightRegular
    | typeof FontWeightXBold
    | typeof GridV4
    | typeof Horizontal
    | typeof LandscapeImage
    | typeof Link2
    | typeof PlusV4
    | typeof PortraitImage
    | typeof ResetV4
    | typeof ScreensV4
    | typeof ScreenV4
    | typeof SettingsIcon
    | typeof SettingsIcon2
    | typeof SettingsIcon3
    | typeof SettingsLightIcon
    | typeof StartEmptyV4
    | typeof StarFilledV4
    | typeof Tabs
    | typeof TabsCondensed
    | typeof TextAlignCenter
    | typeof TextAlignLeft
    | typeof TextAlignRight
    | typeof TrashV4
    | typeof CustomDashboardIconLight
    | typeof SkyscrapersIcon
    | typeof PeopleIcon
    | typeof SettingsLightIcon
    | typeof ThumbsUpIcon
    | typeof ThumbsDownIcon
    | typeof XIcon
    | typeof DuplicateIcon
    | typeof ThumbsDownIcon
    | typeof Palette
    | typeof Pages
    | typeof AiChat
    | typeof DesktopVisible
    | typeof DesktopHidden
    | typeof MobileVisible
    | typeof MobileHidden;
};

export const methodOnlySvgIcons = [
  'count-of',
  'settings',
  'settings2',
  'filter-group',
  'expand-V4',
  'circle-plus-V4',
  'arrow-right-alt',
  'arrow-left-alt',
  'compare',
  'check-circle',
  'check-circle-filled',
  'grid-V4',
  'arrow-up-down',
  'arrow-up-V4',
  'arrow-up-circle',
  'arrow-down-V4',
  'drag-V4',
  'filter-V4',
  'eye-open-V4',
  'eye-closed-V4',
  'tabs-V4',
  'tabs-condensed-V4',
  'plus-V4',
  'screens-V4',
  'screen-V4',
  'font-color',
  'align-left',
  'align-center',
  'align-right',
  'text-align-left',
  'text-align-center',
  'text-align-right',
  'font-weight-regular',
  'font-weight-bold',
  'font-weight-xbold',
  'trash-V4',
  'edit-V4',
  'reset-V4',
  'fill-color',
  'ai-assistant',
  'star-filled-V4',
  'star-empty-V4',
  'arrow-elbow',
  'common-file-empty-alternate-v4',
  'warning-sign',
  'desktop-visible',
  'desktop-hidden',
  'mobile-visible',
  'mobile-hidden',
  'device-desktop',
  'device-tablet',
  'device-mobile',
  'x-icon',
  'duplicate-icon',
  'ai-icon',
  'home',
  'pages',
  'ai-chat',
  'close-V4',
  'conversation-chat',
  'close-compact',
  'ai-gradient-icon',
  'box-rounded',
] as const;

export type MethodOnlySvgIconName = (typeof methodOnlySvgIcons)[number];

export const SvgIconNames = (validRuntimeIconNames as unknown as string[]).concat(
  methodOnlySvgIcons as unknown as string[],
  Object.keys(v4IconMap) as string[],
  Object.keys(widgetIconMap) as string[],
) as SvgIconName[];

export const combinedIconNames = Object.keys(v4IconMap).concat(Object.keys(widgetIconMap) as string[]) as SvgIconName[];

export const combinedIconMap = {
  ...v4IconMap,
  ...widgetIconMap,
};

/**
 * Type guard function to validate if a string is a valid icon name.
 * This is useful for runtime validation.
 *
 * @param name - The string to validate
 * @returns True if the string is a valid icon name, false otherwise
 */
export function isValidIconName(name: string): name is SvgIconName {
  return (SvgIconNames as string[]).includes(name);
}

export type SvgIconName = RuntimeSvgIconName | MethodOnlySvgIconName | WidgetIconNames | V4IconNames;
