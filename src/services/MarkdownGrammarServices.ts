export class MarkdownGrammarServices {
    /**
     * 将文本转换为一级标题
     * @param text 要转换的文本
     * @returns 一级标题格式的文本
     */
    public static h1(text: string): string {
        return `# ${text}`;
    }

    /**
     * 将文本转换为二级标题
     * @param text 要转换的文本
     * @returns 二级标题格式的文本
     */
    public static h2(text: string): string {
        return `## ${text}`;
    }

    /**
     * 将文本转换为三级标题
     * @param text 要转换的文本
     * @returns 三级标题格式的文本
     */
    public static h3(text: string): string {
        return `### ${text}`;
    }

    /**
     * 将文本转换为加粗格式
     * @param text 要转换的文本
     * @returns 加粗格式的文本
     */
    public static bold(text: string): string {
        return `**${text}**`;
    }

    /**
     * 将文本转换为下划线格式
     * @param text 要转换的文本
     * @returns 下划线格式的文本
     */
    public static underline(text: string): string {
        return `<u>${text}</u>`;
    }

    /**
     * 将文本转换为斜体格式
     * @param text 要转换的文本
     * @returns 斜体格式的文本
     */
    public static italic(text: string): string {
        return `*${text}*`;
    }

    /**
     * 将文本转换为删除线格式
     * @param text 要转换的文本
     * @returns 删除线格式的文本
     */
    public static strikethrough(text: string): string {
        return `~~${text}~~`;
    }

    /**
     * 将文本转换为引用格式
     * @param text 要转换的文本
     * @returns 引用格式的文本
     */
    public static quote(text: string): string {
        // 处理多行文本，确保每行都有引用符号
        return text.split('\n').map(line => `> ${line}`).join('\n');
    }

    /**
     * 将文本转换为行内代码格式
     * @param text 要转换的文本
     * @returns 行内代码格式的文本
     */
    public static inlineCode(text: string): string {
        return `\`${text}\``;
    }

    /**
     * 将文本转换为代码块格式
     * @param text 要转换的文本
     * @param language 代码语言（可选）
     * @returns 代码块格式的文本
     */
    public static codeBlock(text: string, language: string = ''): string {
        return `\`\`\`${language}\n${text}\n\`\`\``;
    }

    /**
     * 创建链接
     * @param text 链接文本
     * @param url 链接URL
     * @returns 链接格式的文本
     */
    public static link(text: string, url: string): string {
        return `[${text}](${url})`;
    }

    /**
     * 创建图片
     * @param altText 图片替代文本
     * @param url 图片URL
     * @param title 图片标题（可选）
     * @returns 图片格式的文本
     */
    public static image(altText: string, url: string, title?: string): string {
        return title
            ? `![${altText}](${url} "${title}")`
            : `![${altText}](${url})`;
    }

    /**
     * 创建无序列表项
     * @param items 列表项数组
     * @returns 无序列表格式的文本
     */
    public static unorderedList(items: string[]): string {
        return items.map(item => `- ${item}`).join('\n');
    }

    /**
     * 创建有序列表项
     * @param items 列表项数组
     * @returns 有序列表格式的文本
     */
    public static orderedList(items: string[]): string {
        return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
    }

    /**
     * 创建水平分割线
     * @returns 水平分割线格式的文本
     */
    public static horizontalRule(): string {
        return '---';
    }

    /**
     * 创建表格
     * @param headers 表头数组
     * @param rows 表格行数据二维数组
     * @returns 表格格式的文本
     */
    public static table(headers: string[], rows: string[][]): string {
        const headerRow = `| ${headers.join(' | ')} |`;
        const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
        const dataRows = rows.map(row => `| ${row.join(' | ')} |`);

        return [headerRow, separatorRow, ...dataRows].join('\n');
    }

    /**
     * 创建任务列表
     * @param items 任务项数组，每项包含文本和完成状态
     * @returns 任务列表格式的文本
     */
    public static taskList(items: Array<{ text: string, completed: boolean }>): string {
        return items.map(item => {
            const checkbox = item.completed ? '[x]' : '[ ]';
            return `- ${checkbox} ${item.text}`;
        }).join('\n');
    }
}