import { MonacoEditorServices } from "./MonacoEditorServices";

export class AppContext {
    editor: MonacoEditorServices = null;
    constructor() {

    }
    setEditor(editor: MonacoEditorServices) {
        this.editor = editor;
    }
    getEditor(): MonacoEditorServices {
        return this.editor;
    }
}