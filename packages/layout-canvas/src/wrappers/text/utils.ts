/**
 * Utility functions for TextWrapper
 */

/**
 * Strips HTML tags and extracts text content
 */
export function stripHtml(html: string): string {
  const tempDivElement = document.createElement('div');
  let innerHtmlVal = '';
  tempDivElement.innerHTML = html;

  if (tempDivElement.childElementCount > 0) {
    for (let i = 0; i < tempDivElement.childElementCount; i++) {
      const element = tempDivElement.children[i];
      if (element) {
        innerHtmlVal = `${innerHtmlVal} ${element.innerHTML.trim()}`;
      }
    }
  }

  return innerHtmlVal || tempDivElement.textContent || tempDivElement.innerText || '';
}

/**
 * Formats newlines in text content to HTML breaks
 */
export function formatNewlines(text: string | number | null | undefined): string {
  if (text === null || text === undefined || text === '') {
    return '';
  }

  if (typeof text === 'string') {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  return String(text);
}
