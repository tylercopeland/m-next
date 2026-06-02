import React from 'react';

export const decorators = [
  (Story) => {
    const link = document.createElement('link');
    link.href = 'https://method.method.me/apps/public/styles/styles.min.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'screen,print';

    document.getElementsByTagName('head')[0].appendChild(link);
    
    // Override body/html overflow rules from the injected legacy Method CSS
    // (styles.min.css has multiple `body { overflow: hidden; height: 100% }`
    // rules that lock out scrolling in both story view and docs view).
    //
    // Storybook's body classes:
    //   .sb-show-main + .sb-main-centered → story preview
    //   .sb-show-main                     → story preview (non-centered)
    //   .sb-show-main + (no -centered)    → docs page
    // The bare `body` selector below covers all cases. We also reset html
    // because some of the injected rules anchor on `html`.
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        overflow: auto !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        height: auto !important;
        min-height: 100% !important;
        position: static !important;
      }
      /* Storybook's docs container — make sure it can grow + scroll. */
      .sb-show-main:not(.sb-main-centered) #storybook-docs,
      .sb-show-main:not(.sb-main-centered) .sbdocs.sbdocs-wrapper {
        overflow: auto !important;
        height: auto !important;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
    
    return <Story />;
  },
];
export const tags = ['autodocs'];
