import React from 'react';
import * as s from './Toolbar.styles';
import SvgIcon, { SvgIconName } from '@m-next/svg-icon';
import { Tooltip } from 'react-tooltip';
import { colors } from '@m-next/styles';
import { Z_POPUP } from '@m-next/layout-canvas';

interface ToolbarButton {
  id: string;
  icon: SvgIconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  isHighlighted?: boolean;
}

interface AIButtonConfig {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

interface ToolbarProps {
  topButtons?: ToolbarButton[];
  bottomButtons?: ToolbarButton[];
  aiButtonConfig?: AIButtonConfig;
}

function getAiButton(aiButtonConfig?: AIButtonConfig) {
  if(!aiButtonConfig) return null;

  if(aiButtonConfig.isActive){
    return (
      <s.ToolbarButton
        onClick={aiButtonConfig.onClick}
        disabled={aiButtonConfig.disabled}
        isActive={aiButtonConfig.isActive}
        data-tooltip-id="toolbar-tooltip"
        data-tooltip-content="Close chat"
      >
        <s.ButtonIcon>
          <SvgIcon name="ai-gradient-icon" size={20} />
        </s.ButtonIcon>
      </s.ToolbarButton>
    );
  }

  return(
    <s.AIButton
      onClick={aiButtonConfig.onClick}
      disabled={aiButtonConfig.disabled}
      data-tooltip-id="toolbar-tooltip"
      data-tooltip-content={aiButtonConfig.disabled ? "AI-powered editing coming soon" : "Open chat"}
    >
      <SvgIcon name="ai-icon" size={16}/>
    </s.AIButton>
  );
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  topButtons = [],
  bottomButtons = [],
  aiButtonConfig
}) => {

  return (
    <s.ToolbarContainer>
      <s.ButtonGroup>
        {topButtons.map((button) => (
          <s.ToolbarButton
            key={button.id}
            onClick={button.onClick}
            disabled={button.disabled}
            title={button.label}
            aria-label={button.label}
            isActive={button.isActive}
            highlighted={button.isHighlighted}
            data-tooltip-id="toolbar-tooltip"
            data-tooltip-content={button.label}
          >
            <s.ButtonIcon>
                <SvgIcon name={button.icon} size={20} />
            </s.ButtonIcon>
          </s.ToolbarButton>
        ))}
      </s.ButtonGroup>
      
      <s.ButtonGroup>
        {bottomButtons.map((button) => (
          <s.ToolbarButton
            key={button.id}
            onClick={button.onClick}
            disabled={button.disabled}
            title={button.label}
            aria-label={button.label}
            isActive={button.isActive}
            highlighted={button.isHighlighted}
            data-tooltip-id="toolbar-tooltip"
            data-tooltip-content={button.label}
          >
            <s.ButtonIcon>
                <SvgIcon name={button.icon} size={20} />
            </s.ButtonIcon>
          </s.ToolbarButton>
        ))}

        {getAiButton(aiButtonConfig)}
      </s.ButtonGroup>

      <Tooltip
        id="toolbar-tooltip"
        place="right"
        style={{
          backgroundColor: colors['grey-darkest'],
          borderRadius: '2px',
          padding: '4px 8px',
          fontSize: '12px',
          zIndex: Z_POPUP.TOOLTIP
        }}
      />
    </s.ToolbarContainer>
  );
};

export default Toolbar;
