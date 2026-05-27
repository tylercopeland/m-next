interface IconPath {
  icon: {
    paths: string[];
    attrs: any[];
    width?: number;
    isMulticolor?: boolean;
    isMulticolor2?: boolean;
    grid?: number;
    tags?: string[];
    colorPermutations?: Record<string, any[]>;
  };
  attrs: any[];
  properties: {
    order: number;
    id: number;
    name: string;
    prevSize?: number;
    code?: number;
    codes?: number[];
  };
  setIdx: number;
  setId: number;
  iconIdx: number;
}

interface IconPathsData {
  IcoMoonType: string;
  icons: IconPath[];
  height: number;
  preferences: {
    showGlyphs: boolean;
    showCodes: boolean;
    showQuickUse: boolean;
    showQuickUse2: boolean;
    showSVGs: boolean;
    fontPref: Record<string, any>;
    imagePref: Record<string, any>;
    historySize: number;
    gridSize: number;
    showLiga: boolean;
    showGrid: boolean;
  };
}

declare const iconPaths: IconPathsData;

export default iconPaths;
