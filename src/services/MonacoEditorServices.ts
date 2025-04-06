import * as monaco from "monaco-editor";
export class MonacoEditorServices {
    editor: monaco.editor.IStandaloneCodeEditor
    constructor(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editor;
    }

    getCurrentLineNumber(): number {
        return this.editor.getPosition().lineNumber;
    }

    getCurrentColumnNumber(): number {
        return this.editor.getPosition().column;
    }

    getCurrentLineText(): string {
        return this.editor.getModel().getLineContent(this.getCurrentLineNumber());
    }

    /**
     * 设置当前光标所在行的文本内容
     * @param text 要设置的新文本内容
     * @param cursorAtEnd 是否将光标放置在替换后文本的末尾，默认为false
     */
    setCurrentLineText(text: string, cursorAtEnd: boolean = false): void {
        const lineNumber = this.getCurrentLineNumber();
        this.editor.getModel().pushEditOperations([], [{
            range: new monaco.Range(lineNumber, 1, lineNumber, this.getCurrentLineText().length + 1),
            text: text
        }], () => {
            if (!cursorAtEnd) {
                return [];
            }

            // 计算替换后文本末尾的位置
            const lines = text.split('\n');
            const endLineNumber = lineNumber + lines.length - 1;
            const endColumn = lines.length === 1
                ? text.length + 1
                : lines[lines.length - 1].length + 1;

            // 返回一个新的选择范围，将光标放在文本末尾
            return [new monaco.Selection(endLineNumber, endColumn, endLineNumber, endColumn)];
        });
    }

    /**
     * 替换编辑器中选中的文本，如果没有选中文本则替换当前行
     * @param text 要替换成的新文本内容
     * @param cursorAtEnd 是否将光标放置在替换后文本的末尾，默认为false
     */
    replaceSelectedText(text: string, cursorAtEnd: boolean = false): void {
        const selection = this.editor.getSelection();

        // 如果没有选中文本，则替换当前行
        if (selection.isEmpty()) {
            this.setCurrentLineText(text, cursorAtEnd);
            return;
        }

        // 替换选中的文本范围
        this.editor.getModel().pushEditOperations([], [{
            range: selection,
            text: text
        }], () => {
            if (!cursorAtEnd) {
                return [];
            }

            // 计算替换后文本末尾的位置
            const startLineNumber = selection.startLineNumber;
            const startColumn = selection.startColumn;

            // 计算新文本的行数和最后一行的长度
            const lines = text.split('\n');
            const endLineNumber = startLineNumber + lines.length - 1;
            const endColumn = lines.length === 1
                ? startColumn + text.length
                : lines[lines.length - 1].length + 1;

            // 返回一个新的选择范围，将光标放在文本末尾
            return [new monaco.Selection(endLineNumber, endColumn, endLineNumber, endColumn)];
        });
    }


    /**
     * 获取当前选中范围的文本，如果没有选中范围，则获取当前光标所在行的文本
     * @returns 选中的文本或当前行的文本
     */
    getSelectedOrCurrentLineText(): string {
        const selection = this.editor.getSelection();

        // 如果没有选中文本，则返回当前行文本
        if (selection.isEmpty()) {
            return this.getCurrentLineText();
        }

        // 返回选中的文本
        return this.editor.getModel().getValueInRange(selection);
    }

}