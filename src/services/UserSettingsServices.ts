
// 定义编辑器设置接口
export interface EditorSettings {
    defaultModel: string;
}

// 定义工具栏设置接口
export interface ToolbarsSettings {
    toolbar: string[];
}

// 定义用户设置接口
export interface UserSettings {
    editor: EditorSettings;
    toolbars: ToolbarsSettings;
}
export const defaultUserSettings: UserSettings = {
    editor: {
        defaultModel: "editOnly"
    },
    toolbars: {
        toolbar: [
            "save",
            "left",
            "last",
            "next",
            "right",
            "bold",
            "italic",
            "strikethrough",
            "link",
            "|",
            "color",
            "header",
            "code",
            "formula",
            "toc",
            "copy",
            "ruby",
            "|",
            "list",
            "table",
            "checklist",
            "justify",
            "panel",
            "detail",
            "togglePreview",
            "switchModel",
            "export",
            "userSettings",
            "favor"
        ]
    }
};

// 本地存储的键名
const SETTINGS_STORAGE_KEY = 'feishu-markdown-user-settings';

export class UserSettingsServices {
    private settings: UserSettings = defaultUserSettings;

    constructor() {
        // 从本地存储加载设置，如果没有则使用默认设置
        this.loadSettings();
    }

    // 从本地存储加载设置
    private loadSettings(): void {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (storedSettings) {
                this.settings = JSON.parse(storedSettings);
            } else {
                this.settings = defaultUserSettings;
            }
        } catch (error) {
            console.error('加载用户设置失败:', error);
            this.settings = defaultUserSettings;
        }
    }

    // 保存设置到本地存储
    private saveSettings(): void {
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
        } catch (error) {
            console.error('保存用户设置失败:', error);
        }
    }

    // 获取所有设置
    public getSettings(): UserSettings {
        return this.settings;
    }

    // 更新设置
    public updateSettings(newSettings: Partial<UserSettings>): void {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    // 获取编辑器设置
    public getEditorSettings(): EditorSettings {
        return this.settings.editor;
    }

    // 更新编辑器设置
    public updateEditorSettings(editorSettings: Partial<EditorSettings>): void {
        this.settings.editor = { ...this.settings.editor, ...editorSettings };
        this.saveSettings();
    }

    // 获取工具栏设置
    public getToolbarsSettings(): ToolbarsSettings {
        return this.settings.toolbars;
    }

    // 更新工具栏设置
    public updateToolbarsSettings(toolbarsSettings: Partial<ToolbarsSettings>): void {
        this.settings.toolbars = { ...this.settings.toolbars, ...toolbarsSettings };
        this.saveSettings();
    }
}