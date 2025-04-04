import { MarkDownEngine } from '../MarkDownEngine'
import { describe, it, expect } from 'vitest';
describe('parseMarkdown', () => {
  it('should parse simple markdown to html', () => {
    let en = new MarkDownEngine()
    const markdown = '# Hello World';
    const html = en.render(markdown);
    console.log(html)
    expect(html).toContain('<h1>Hello World</h1>');
  });
});