import React from 'react';

export const decorators = [
  (Story) => {
    const link = document.createElement('link');
    link.href = 'https://method.method.me/apps/public/styles/styles.min.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'screen,print';

    document.getElementsByTagName('head')[0].appendChild(link);
    
    // Override the body overflow hidden from external CSS
    const style = document.createElement('style');
    style.textContent = `
      body.sb-show-main.sb-main-centered {
        overflow: scroll !important;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
    
    return <Story />;
  },
];
export const tags = ['autodocs'];
