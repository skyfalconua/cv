// dump simple markdown renderer

const rules: [RegExp, string][] = [
  // Code blocks (must be before inline code)
  [/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>'],
  // Headers
  [/^### (.*$)/gim, '<h3>$1</h3>'],
  [/^## (.*$)/gim, '<h2>$1</h2>'],
  [/^# (.*$)/gim, '<h1>$1</h1>'],
  // Bold
  [/\*\*(.+?)\*\*/g, '<strong>$1</strong>'],
  [/__(.+?)__/g, '<strong>$1</strong>'],
  // Italic
  [/\*(.+?)\*/g, '<em>$1</em>'],
  [/_(.+?)_/g, '<em>$1</em>'],
  // Strikethrough
  [/~~(.+?)~~/g, '<del>$1</del>'],
  // Inline code
  [/`(.+?)`/g, '<code>$1</code>'],
  // Images (must be before links)
  [/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />'],
  // Links
  [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'],
  // Unordered lists
  [/^\* (.+)$/gim, '<li>$1</li>'],
  [/^\- (.+)$/gim, '<li>$1</li>'],
  [/(<li>.*<\/li>)/s, '<ul>$1</ul>'],
];

const replaceAll = (chunk: string): string => {
  let html = chunk;
  for (const [pattern, replacement] of rules)
    html = html.replace(pattern, replacement);
  return `<p>${html.trim()}</p>`;
};

const renderMarkdown = (markdown: string): string =>
  markdown.split(/\n\n/gim).map(replaceAll).join('\n');

export default renderMarkdown;

// -- Tests -- -- --

if (import.meta.main) {
  function test(name: string, input: string, expected: string): void {
    const result = renderMarkdown(input);
    const expectedP = `<p>${expected}</p>`;
    const passed = result === expectedP;
    console.log(`${passed ? '✓' : '✗'} ${name}`);
    if (!passed) {
      console.log(`  Expected: ${expectedP}`);
      console.log(`  Got:      ${result}`);
    }
  }

  console.log('--- Running Tests ---');
  test('Header 1', '# Title', '<h1>Title</h1>');
  test('Header 2', '## Subtitle', '<h2>Subtitle</h2>');
  test('Header 3', '### Small', '<h3>Small</h3>');
  test('Bold with **', '**bold text**', '<strong>bold text</strong>');
  test('Bold with __', '__bold text__', '<strong>bold text</strong>');
  test('Italic with *', '*italic text*', '<em>italic text</em>');
  test('Italic with _', '_italic text_', '<em>italic text</em>');
  test('Strikethrough', '~~deleted~~', '<del>deleted</del>');
  test('Inline code', '`const x = 5`', '<code>const x = 5</code>');
  test('Link', '[Google](https://google.com)', '<a href="https://google.com">Google</a>');
  test('Image', '![Alt](image.png)', '<img src="image.png" alt="Alt" />');
  test('Code block', '```\ncode here\n```', '<pre><code>code here\n</code></pre>');
  test('Unordered list', '* Item 1\n* Item 2', '<ul><li>Item 1</li>\n<li>Item 2</li></ul>');
  test('Bold and italic', '***bold and italic***', '<strong><em>bold and italic</strong></em>');
  console.log('--- Tests Complete ---');
}
