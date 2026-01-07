/**
 * Reading Mode - A distraction-free reading experience
 * Extracts main article content and displays it in a clean overlay
 */

const READING_MODE_ID = 'dark-mode-reading-overlay';

interface ReadingModeState {
    active: boolean;
}

let readingModeState: ReadingModeState = {
    active: false,
};

/**
 * Extract the main content from the page using heuristics
 */
function extractMainContent(): { title: string; content: string; siteName: string } {
    // Try to get the title
    let title = '';
    const h1 = document.querySelector('h1');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');

    if (ogTitle) {
        title = ogTitle.getAttribute('content') || '';
    } else if (twitterTitle) {
        title = twitterTitle.getAttribute('content') || '';
    } else if (h1) {
        title = h1.textContent || '';
    } else {
        title = document.title;
    }

    // Get site name
    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    const siteName = ogSiteName?.getAttribute('content') || window.location.hostname;

    // Try to find the main content area
    const contentSelectors = [
        'article',
        '[role="article"]',
        'main',
        '[role="main"]',
        '.post-content',
        '.article-content',
        '.entry-content',
        '.content',
        '#content',
        '.post',
        '.article',
    ];

    let contentElement: Element | null = null;

    for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim().length > 500) {
            contentElement = element;
            break;
        }
    }

    // Fallback: find the largest text block
    if (!contentElement) {
        const allElements = document.querySelectorAll('div, section');
        let maxLength = 0;

        for (const el of allElements) {
            const text = el.textContent || '';
            if (text.length > maxLength && text.length > 500) {
                maxLength = text.length;
                contentElement = el;
            }
        }
    }

    // Extract paragraphs and images
    let content = '';
    if (contentElement) {
        const paragraphs = contentElement.querySelectorAll('p, h2, h3, h4, h5, h6, img, blockquote, pre, code, ul, ol');

        for (const el of paragraphs) {
            if (el.tagName === 'IMG') {
                const img = el as HTMLImageElement;
                const alt = img.alt || 'Image';
                const src = img.src;
                if (src && !src.includes('data:')) {
                    content += `<figure><img src="${src}" alt="${alt}" loading="lazy" /><figcaption>${alt}</figcaption></figure>`;
                }
            } else if (el.tagName === 'BLOCKQUOTE') {
                content += `<blockquote>${el.innerHTML}</blockquote>`;
            } else if (el.tagName === 'PRE' || el.tagName === 'CODE') {
                content += `<pre><code>${el.textContent}</code></pre>`;
            } else if (el.tagName === 'UL' || el.tagName === 'OL') {
                content += el.outerHTML;
            } else if (el.tagName.startsWith('H')) {
                content += `<${el.tagName.toLowerCase()}>${el.textContent}</${el.tagName.toLowerCase()}>`;
            } else {
                const text = el.textContent?.trim();
                if (text && text.length > 20) {
                    content += `<p>${el.innerHTML}</p>`;
                }
            }
        }
    }

    // Fallback: just get all paragraphs
    if (!content) {
        const allParagraphs = document.querySelectorAll('p');
        for (const p of allParagraphs) {
            const text = p.textContent?.trim();
            if (text && text.length > 20) {
                content += `<p>${p.innerHTML}</p>`;
            }
        }
    }

    return { title, content, siteName };
}

/**
 * Get reading mode CSS styles
 */
function getReadingModeCSS(): string {
    return `
    #${READING_MODE_ID} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2147483647;
      background: #1a1a1a;
      overflow-y: auto;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      animation: reading-fade-in 0.3s ease;
    }

    @keyframes reading-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    #${READING_MODE_ID} .reading-container {
      max-width: 680px;
      margin: 0 auto;
      padding: 60px 24px 120px;
    }

    #${READING_MODE_ID} .reading-header {
      margin-bottom: 48px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    #${READING_MODE_ID} .reading-site {
      font-size: 14px;
      color: #f97316;
      font-weight: 500;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    #${READING_MODE_ID} .reading-title {
      font-size: 36px;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
      margin: 0;
    }

    #${READING_MODE_ID} .reading-content {
      color: #e5e5e5;
      font-size: 18px;
      line-height: 1.8;
    }

    #${READING_MODE_ID} .reading-content p {
      margin: 0 0 24px;
    }

    #${READING_MODE_ID} .reading-content h2,
    #${READING_MODE_ID} .reading-content h3,
    #${READING_MODE_ID} .reading-content h4,
    #${READING_MODE_ID} .reading-content h5,
    #${READING_MODE_ID} .reading-content h6 {
      color: #fff;
      margin: 48px 0 16px;
      font-weight: 600;
    }

    #${READING_MODE_ID} .reading-content h2 { font-size: 28px; }
    #${READING_MODE_ID} .reading-content h3 { font-size: 24px; }
    #${READING_MODE_ID} .reading-content h4 { font-size: 20px; }

    #${READING_MODE_ID} .reading-content a {
      color: #f97316;
      text-decoration: underline;
    }

    #${READING_MODE_ID} .reading-content a:hover {
      color: #fb923c;
    }

    #${READING_MODE_ID} .reading-content figure {
      margin: 32px 0;
      text-align: center;
    }

    #${READING_MODE_ID} .reading-content figure img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    #${READING_MODE_ID} .reading-content figcaption {
      font-size: 14px;
      color: #888;
      margin-top: 8px;
    }

    #${READING_MODE_ID} .reading-content blockquote {
      border-left: 4px solid #f97316;
      padding-left: 20px;
      margin: 24px 0;
      font-style: italic;
      color: #aaa;
    }

    #${READING_MODE_ID} .reading-content pre {
      background: #2a2a2a;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 24px 0;
    }

    #${READING_MODE_ID} .reading-content code {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
      font-size: 14px;
      color: #f97316;
    }

    #${READING_MODE_ID} .reading-content pre code {
      color: #e5e5e5;
    }

    #${READING_MODE_ID} .reading-content ul,
    #${READING_MODE_ID} .reading-content ol {
      margin: 24px 0;
      padding-left: 24px;
    }

    #${READING_MODE_ID} .reading-content li {
      margin-bottom: 8px;
    }

    #${READING_MODE_ID} .reading-close {
      position: fixed;
      top: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
      transition: all 0.3s ease;
      z-index: 2147483648;
    }

    #${READING_MODE_ID} .reading-close:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(249, 115, 22, 0.5);
    }

    #${READING_MODE_ID} .reading-close svg {
      width: 20px;
      height: 20px;
      color: white;
    }

    #${READING_MODE_ID} .reading-empty {
      text-align: center;
      padding: 48px;
      color: #888;
    }

    #${READING_MODE_ID} .reading-empty svg {
      width: 64px;
      height: 64px;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    #${READING_MODE_ID} .reading-empty h3 {
      font-size: 24px;
      color: #fff;
      margin-bottom: 12px;
    }
  `;
}

/**
 * Enable reading mode
 */
export function enableReadingMode(): boolean {
    if (readingModeState.active) {
        return true;
    }

    try {
        const { title, content, siteName } = extractMainContent();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = READING_MODE_ID;

        // Add styles
        const style = document.createElement('style');
        style.textContent = getReadingModeCSS();
        overlay.appendChild(style);

        // Create content
        const isEmpty = !content || content.trim().length < 100;

        overlay.innerHTML += `
      <button class="reading-close" title="Exit Reading Mode (Esc)">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="reading-container">
        ${isEmpty ? `
          <div class="reading-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>No readable content found</h3>
            <p>This page doesn't appear to have article content suitable for reading mode.</p>
          </div>
        ` : `
          <header class="reading-header">
            <div class="reading-site">${siteName}</div>
            <h1 class="reading-title">${title}</h1>
          </header>
          <div class="reading-content">
            ${content}
          </div>
        `}
      </div>
    `;

        document.body.appendChild(overlay);

        // Add close button handler
        const closeBtn = overlay.querySelector('.reading-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', disableReadingMode);
        }

        // Add escape key handler
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                disableReadingMode();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        readingModeState.active = true;
        console.log('Reading mode enabled');
        return true;
    } catch (error) {
        console.error('Failed to enable reading mode:', error);
        return false;
    }
}

/**
 * Disable reading mode
 */
export function disableReadingMode(): void {
    const overlay = document.getElementById(READING_MODE_ID);
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = '';
    readingModeState.active = false;
    console.log('Reading mode disabled');
}

/**
 * Toggle reading mode
 */
export function toggleReadingMode(): boolean {
    if (readingModeState.active) {
        disableReadingMode();
        return false;
    } else {
        return enableReadingMode();
    }
}

/**
 * Check if reading mode is active
 */
export function isReadingModeActive(): boolean {
    return readingModeState.active;
}
