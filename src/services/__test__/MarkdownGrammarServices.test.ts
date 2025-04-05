import { MarkdownGrammarServices } from '../MarkdownGrammarServices';
import { describe, it, expect } from 'vitest';
describe('MarkdownGrammarServices', () => {
  // 标题相关测试
  describe('标题格式化', () => {
    it('h1 应该正确格式化一级标题', () => {
      expect(MarkdownGrammarServices.h1('标题')).toBe('# 标题');
    });

    it('h2 应该正确格式化二级标题', () => {
      expect(MarkdownGrammarServices.h2('标题')).toBe('## 标题');
    });

    it('h3 应该正确格式化三级标题', () => {
      expect(MarkdownGrammarServices.h3('标题')).toBe('### 标题');
    });
  });

  // 文本格式化测试
  describe('文本格式化', () => {
    it('bold 应该正确格式化加粗文本', () => {
      expect(MarkdownGrammarServices.bold('加粗文本')).toBe('**加粗文本**');
    });

    it('underline 应该正确格式化下划线文本', () => {
      expect(MarkdownGrammarServices.underline('下划线文本')).toBe('<u>下划线文本</u>');
    });

    it('italic 应该正确格式化斜体文本', () => {
      expect(MarkdownGrammarServices.italic('斜体文本')).toBe('*斜体文本*');
    });

    it('strikethrough 应该正确格式化删除线文本', () => {
      expect(MarkdownGrammarServices.strikethrough('删除线文本')).toBe('~~删除线文本~~');
    });
  });

  // 引用和代码测试
  describe('引用和代码', () => {
    it('quote 应该正确格式化单行引用', () => {
      expect(MarkdownGrammarServices.quote('引用文本')).toBe('> 引用文本');
    });

    it('quote 应该正确格式化多行引用', () => {
      expect(MarkdownGrammarServices.quote('第一行\n第二行')).toBe('> 第一行\n> 第二行');
    });

    it('inlineCode 应该正确格式化行内代码', () => {
      expect(MarkdownGrammarServices.inlineCode('code')).toBe('`code`');
    });

    it('codeBlock 应该正确格式化无语言代码块', () => {
      expect(MarkdownGrammarServices.codeBlock('const a = 1;')).toBe('```\nconst a = 1;\n```');
    });

    it('codeBlock 应该正确格式化有语言代码块', () => {
      expect(MarkdownGrammarServices.codeBlock('const a = 1;', 'javascript')).toBe('```javascript\nconst a = 1;\n```');
    });
  });

  // 链接和图片测试
  describe('链接和图片', () => {
    it('link 应该正确格式化链接', () => {
      expect(MarkdownGrammarServices.link('飞书', 'https://feishu.cn')).toBe('[飞书](https://feishu.cn)');
    });

    it('image 应该正确格式化无标题图片', () => {
      expect(MarkdownGrammarServices.image('图片', 'https://example.com/image.png')).toBe('![图片](https://example.com/image.png)');
    });

    it('image 应该正确格式化有标题图片', () => {
      expect(MarkdownGrammarServices.image('图片', 'https://example.com/image.png', '示例图片')).toBe('![图片](https://example.com/image.png "示例图片")');
    });
  });

  // 列表测试
  describe('列表', () => {
    it('unorderedList 应该正确格式化无序列表', () => {
      expect(MarkdownGrammarServices.unorderedList(['项目1', '项目2', '项目3'])).toBe('- 项目1\n- 项目2\n- 项目3');
    });

    it('orderedList 应该正确格式化有序列表', () => {
      expect(MarkdownGrammarServices.orderedList(['项目1', '项目2', '项目3'])).toBe('1. 项目1\n2. 项目2\n3. 项目3');
    });

    it('taskList 应该正确格式化任务列表', () => {
      const tasks = [
        { text: '已完成任务', completed: true },
        { text: '未完成任务', completed: false }
      ];
      expect(MarkdownGrammarServices.taskList(tasks)).toBe('- [x] 已完成任务\n- [ ] 未完成任务');
    });
  });

  // 其他元素测试
  describe('其他元素', () => {
    it('horizontalRule 应该正确创建水平分割线', () => {
      expect(MarkdownGrammarServices.horizontalRule()).toBe('---');
    });

    it('table 应该正确格式化表格', () => {
      const headers = ['姓名', '年龄', '职业'];
      const rows = [
        ['张三', '25', '工程师'],
        ['李四', '30', '设计师']
      ];
      const expected =
        '| 姓名 | 年龄 | 职业 |\n' +
        '| --- | --- | --- |\n' +
        '| 张三 | 25 | 工程师 |\n' +
        '| 李四 | 30 | 设计师 |';
      expect(MarkdownGrammarServices.table(headers, rows)).toBe(expected);
    });
  });
});