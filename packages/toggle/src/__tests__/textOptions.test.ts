/**
 * Unit tests for textOptions module (Single Responsibility).
 * Pure functions: no React, no DOM; easy to extend for new textOpt values (Open/Closed).
 */
import { getOnText, getOffText } from '../textOptions';

describe('textOptions (Single Responsibility)', () => {
  describe('getOnText', () => {
    it('returns "Yes" for Yes/No', () => {
      expect(getOnText('Yes/No')).toBe('Yes');
    });

    it('returns "On" for On/Off', () => {
      expect(getOnText('On/Off')).toBe('On');
    });

    it('returns "True" for True/False', () => {
      expect(getOnText('True/False')).toBe('True');
    });

    it('returns null for Blank', () => {
      expect(getOnText('Blank')).toBeNull();
    });
  });

  describe('getOffText', () => {
    it('returns "No" for Yes/No', () => {
      expect(getOffText('Yes/No')).toBe('No');
    });

    it('returns "Off" for On/Off', () => {
      expect(getOffText('On/Off')).toBe('Off');
    });

    it('returns "False" for True/False', () => {
      expect(getOffText('True/False')).toBe('False');
    });

    it('returns null for Blank', () => {
      expect(getOffText('Blank')).toBeNull();
    });
  });
});
