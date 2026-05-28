/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Reference Playwright spec for @m-next/button. Pattern:
//   - One screenshot per story (visual regression baselines committed).
//   - One axe-core pass per story (filtered to serious + critical).
//   - One behavioral test per cleaned-up concern (forwardRef API, soft-shim
//     deprecation warnings, keyboard activation).
//
// Future component specs follow this shape. Each cleaned package gets its
// own spec file under tests-e2e/ once this pattern is locked.

const STORY_PREFIX = 'm-next-components-action-button';

const VISUAL_STORIES = [
  'variants',
  'sizes',
  'with-icons',
  'states',
  'full-width',
  'accessibility',
  'real-world-row',
];

const openStory = async (page, slug) => {
  // Storybook keeps the HMR socket open — networkidle never fires.
  // Wait for DOM + the storybook-root container to be present and non-empty.
  await page.goto(`/iframe.html?id=${STORY_PREFIX}--${slug}&viewMode=story`, {
    waitUntil: 'domcontentloaded',
  });
  await page.locator('#storybook-root').waitFor({ state: 'visible' });
  // Wait for the storybook-root to have actual rendered content
  // (Storybook renders progressively after DOMContentLoaded).
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#storybook-root');
      return root && root.children.length > 0;
    },
    { timeout: 10000 },
  );
  // Brief settle for fonts + Emotion-injected styles.
  await page.waitForTimeout(250);
};

test.describe('@m-next/button — visual regression', () => {
  for (const slug of VISUAL_STORIES) {
    test(`renders consistently — ${slug}`, async ({ page }) => {
      await openStory(page, slug);
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `button-${slug}.png`,
      );
    });
  }
});

test.describe('@m-next/button — accessibility', () => {
  for (const slug of VISUAL_STORIES) {
    test(`no serious / critical violations — ${slug}`, async ({ page }) => {
      await openStory(page, slug);
      const results = await new AxeBuilder({ page })
        .include('#storybook-root')
        .options({ resultTypes: ['violations'] })
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      if (blocking.length) {
        // Print the short version so the failure message is readable.
        // eslint-disable-next-line no-console
        console.log(
          'axe violations:',
          blocking.map((v) => ({ id: v.id, impact: v.impact, help: v.help })),
        );
      }
      expect(blocking).toEqual([]);
    });
  }
});

test.describe('@m-next/button — behavioral', () => {
  test('LegacyAPI shim fires the documented deprecation warnings', async ({
    page,
  }) => {
    const warns = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' || msg.type() === 'warn') {
        warns.push(msg.text());
      }
    });

    await openStory(page, 'legacy-api-still-works');

    // The story renders 4 deprecated patterns; each should emit a one-time warn.
    const expectedSubstrings = [
      '`value` prop is deprecated',
      '`buttonStyle` is deprecated',
      'size="medium" is deprecated',
      '`icon={{', // the icon-object → leftIcon/rightIcon warn
    ];

    for (const expected of expectedSubstrings) {
      const found = warns.some((w) => w.includes(expected));
      expect(
        found,
        `expected a console.warn containing: ${expected}\n\nactual warns:\n${warns.join('\n')}`,
      ).toBe(true);
    }
  });

  test('primary button is keyboard-focusable and activates on Enter', async ({
    page,
  }) => {
    await openStory(page, 'variants');
    // Scope to the story root so we don't pick up Storybook chrome buttons.
    const primaryButton = page.locator('#storybook-root button').first();
    await primaryButton.focus();
    await expect(primaryButton).toBeFocused();
    // Pressing Enter shouldn't throw; we don't assert behavior since the
    // story has no onClick wired — just that focus + activation work.
    await primaryButton.press('Enter');
  });

  test('disabled button sets aria-disabled', async ({ page }) => {
    await openStory(page, 'states');
    // Scope to story root. The States story renders disabled primary /
    // secondary / ghost. aria-disabled should mirror disabled attribute.
    const disabled = page.locator('#storybook-root button[disabled]').first();
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  });
});
