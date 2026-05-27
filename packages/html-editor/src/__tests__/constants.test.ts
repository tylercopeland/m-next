import { keys, LG, MD, SM, XS, ToolbarConfig, ToolbarButtonGroup } from '../constants';

describe('Constants', () => {
  describe('keys', () => {
    test('should have the correct keys', () => {
      expect(keys).toHaveProperty('v_2_8_orBelow');
      expect(keys).toHaveProperty('v_2_8_orAbove');
      expect(keys).toHaveProperty('v3');
    });

    test('keys should be strings', () => {
      expect(typeof keys.v_2_8_orBelow).toBe('string');
      expect(typeof keys.v_2_8_orAbove).toBe('string');
      expect(typeof keys.v3).toBe('string');
    });
  });

  describe('toolbar configurations', () => {
    test('LG configuration should have all button groups', () => {
      expect(LG).toHaveProperty('moreText');
      expect(LG).toHaveProperty('moreParagraph');
      expect(LG).toHaveProperty('moreRich');
      expect(LG).toHaveProperty('moreMisc');
    });

    test('LG moreText should have correct buttons and visibility', () => {
      expect(LG.moreText.buttons).toContain('bold');
      expect(LG.moreText.buttons).toContain('italic');
      expect(LG.moreText.buttons).toContain('underline');
      expect(LG.moreText.buttonsVisible).toBe(7);
    });

    test('LG moreParagraph should have correct buttons and visibility', () => {
      expect(LG.moreParagraph.buttons).toContain('formatOL');
      expect(LG.moreParagraph.buttons).toContain('formatUL');
      expect(LG.moreParagraph.buttonsVisible).toBe(9);
    });

    test('LG moreRich should have correct buttons and visibility', () => {
      expect(LG.moreRich.buttons).toContain('insertImage');
      expect(LG.moreRich.buttons).toContain('insertTable');
      expect(LG.moreRich.buttonsVisible).toBe(5);
    });

    test('LG moreMisc should have correct buttons, alignment and visibility', () => {
      expect(LG.moreMisc.buttons).toContain('undo');
      expect(LG.moreMisc.buttons).toContain('redo');
      expect(LG.moreMisc.align).toBe('right');
      expect(LG.moreMisc.buttonsVisible).toBe(2);
    });

    test('MD configuration should inherit from LG with specific overrides', () => {
      // MD should inherit most properties from LG
      expect(MD.moreText).toEqual(LG.moreText);
      expect(MD.moreParagraph).toEqual(LG.moreParagraph);
      expect(MD.moreMisc).toEqual(LG.moreMisc);

      // MD should override moreRich
      expect(MD.moreRich.buttons).toEqual(LG.moreRich.buttons);
      expect(MD.moreRich.buttonsVisible).toBe(0);
    });

    test('SM configuration should inherit from MD with specific overrides', () => {
      // SM should inherit most properties from MD
      expect(SM.moreText).toEqual(MD.moreText);
      expect(SM.moreRich).toEqual(MD.moreRich);
      expect(SM.moreMisc).toEqual(MD.moreMisc);

      // SM should override moreParagraph
      expect(SM.moreParagraph.buttons).toEqual(MD.moreParagraph.buttons);
      expect(SM.moreParagraph.buttonsVisible).toBe(0);
    });

    test('XS configuration should inherit from SM with specific overrides', () => {
      // XS should inherit most properties from SM
      expect(XS.moreRich).toEqual(SM.moreRich);
      expect(XS.moreParagraph).toEqual(SM.moreParagraph);
      expect(XS.moreMisc).toEqual(SM.moreMisc);

      // XS should override moreText
      expect(XS.moreText.buttons).toEqual(SM.moreText.buttons);
      expect(XS.moreText.buttonsVisible).toBe(0);
    });
  });

  describe('type definitions', () => {
    test('ToolbarButtonGroup interface should be correctly implemented', () => {
      const testGroup: ToolbarButtonGroup = {
        buttons: ['test1', 'test2'],
        buttonsVisible: 2,
        align: 'left',
      };

      expect(testGroup.buttons).toHaveLength(2);
      expect(testGroup.buttonsVisible).toBe(2);
      expect(testGroup.align).toBe('left');
    });

    test('ToolbarConfig interface should be correctly implemented', () => {
      const testConfig: ToolbarConfig = {
        moreText: {
          buttons: ['test1', 'test2'],
          buttonsVisible: 2,
        },
        moreParagraph: {
          buttons: ['test3', 'test4'],
          buttonsVisible: 2,
        },
        moreRich: {
          buttons: ['test5', 'test6'],
          buttonsVisible: 2,
        },
        moreMisc: {
          buttons: ['test7', 'test8'],
          buttonsVisible: 2,
          align: 'right',
        },
      };

      expect(testConfig.moreText.buttons).toHaveLength(2);
      expect(testConfig.moreParagraph.buttons).toHaveLength(2);
      expect(testConfig.moreRich.buttons).toHaveLength(2);
      expect(testConfig.moreMisc.buttons).toHaveLength(2);
      expect(testConfig.moreMisc.align).toBe('right');
    });
  });
});
