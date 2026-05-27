// Type definitions for toolbar button configurations
export interface ToolbarButtonGroup {
  buttons: string[];
  buttonsVisible: number;
  align?: string;
}

export interface ToolbarConfig {
  moreText: ToolbarButtonGroup;
  moreParagraph: ToolbarButtonGroup;
  moreRich: ToolbarButtonGroup;
  moreMisc: ToolbarButtonGroup;
}

export const keys = {
  v_2_8_orBelow: '4Wa1WDPTf1ZNRGb1OG1g1==',
  v_2_8_orAbove: '4A6D5F5F6A4E3I3cA5A4D4A1E4C2D2E3D1A3vDIG1QCYRWa1GPId1f1I1==',
  v3: '4NC5fB4C3G3B3D3B6A4D-13TMIBDIa2NTMNZFFPFZe2a1Id1f1I1fA8D6C4D5G3H3E2A18A16A6==',
};

// Display different sets of buttons depending on column/parent width
// ≥ 1152px
export const LG: ToolbarConfig = {
  moreText: {
    buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor'],
    buttonsVisible: 7,
  },
  moreParagraph: {
    buttons: [
      'formatOL',
      'formatUL',
      'alignLeft',
      'alignCenter',
      'alignRight',
      'alignJustify',
      'outdent',
      'indent',
      'lineHeight',
    ],
    buttonsVisible: 9,
  },
  moreRich: {
    buttons: ['insertImage', 'insertTable', 'insertLink', 'insertVideo', 'insertHR'],
    buttonsVisible: 5,
  },
  moreMisc: {
    buttons: ['undo', 'redo', 'clearFormatting', 'html', 'fullscreen', 'print', 'selectAll'],
    align: 'right',
    buttonsVisible: 2,
  },
};

// ≥ 992px
export const MD: ToolbarConfig = {
  ...LG,
  moreRich: {
    ...LG.moreRich,
    buttonsVisible: 0,
  },
};

// ≥ 768px
export const SM: ToolbarConfig = {
  ...MD,
  moreParagraph: {
    ...MD.moreParagraph,
    buttonsVisible: 0,
  },
};

// < 768px
export const XS: ToolbarConfig = {
  ...SM,
  moreText: {
    ...SM.moreText,
    buttonsVisible: 0,
  },
};
