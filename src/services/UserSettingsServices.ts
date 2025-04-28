
// 定义编辑器设置接口
export interface EditorSettings {
    defaultModel: string;
}

// 定义工具栏设置接口
export interface ToolbarsSettings {
    // 顶部工具类型
    toolbar: string[];
    // 提示框工具栏
    bubble?: string[] | boolean;
    // 侧边栏工具栏
    sidebar: string[];
    // 顶部右侧工具栏
    toolbarRight: string[];
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
        ],
        // bubble: [
        //     "bold",
        //     "italic",
        //     "underline",
        //     "strikethrough",
        //     "sub",
        //     "sup",
        //     "quote",
        //     "|",
        //     "size",
        //     "color",
        //     "table",
        // ],
        sidebar: [],
        // 定义顶部右侧工具栏，默认为空
        toolbarRight: [],
        bubble: false, // 是否显示提示框工具栏，默认为false
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
        console.log("加载设置", this.settings);
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
        console.log("保存设置", this.settings);
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
        } catch (error) {
            console.error('保存用户设置失败:', error);
        }
    }

    // 获取所有设置
    public getSettings(): UserSettings {
        console.log("获取设置", this.settings);
        return this.settings;
    }

    // 更新设置
    public updateSettings(newSettings: Partial<UserSettings>): void {
        this.settings = { ...this.settings, ...newSettings };
        console.log("更新设置", this.settings);
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

export const availableTools = [
    // 多维表格控制类
    { label: "保存", value: "save", description: "保存文档", category: "control", categoryLabel: "控制类" },
    { label: "上一页", value: "last", description: "上一页", category: "control", categoryLabel: "控制类" },
    { label: "下一页", value: "next", description: "下一页", category: "control", categoryLabel: "控制类" },
    { label: "左移", value: "left", description: "左移", category: "control", categoryLabel: "控制类" },
    { label: "右移", value: "right", description: "右移", category: "control", categoryLabel: "控制类" },
    { label: "用户设置", value: "userSettings", description: "用户设置插件弹窗", category: "control", categoryLabel: "控制类" },
    { label: "用户赞赏", value: "favor", description: "用户赞赏弹窗", category: "control", categoryLabel: "控制类" },

    // 辅助类
    { label: "分隔符", value: "|", description: "单纯的分割工具栏，无任何作用", category: "auxiliary", categoryLabel: "辅助类" },
    { label: "插入占位", value: "insert", description: "单纯的占位，点击没有任何效果，用来配置二级菜单", category: "auxiliary", categoryLabel: "辅助类" },

    // 字体样式类
    { label: "加粗", value: "bold", description: "文字加粗", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "斜体", value: "italic", description: "文字斜体", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "下划线", value: "underline", description: "文字下划线", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "删除线", value: "strikethrough", description: "文字删除线", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "下标", value: "sub", description: "文字下标", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "上标", value: "sup", description: "文字上标", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "拼音注释", value: "ruby", description: "实现类似给文字加拼音的效果", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "文字尺寸", value: "size", description: "文字尺寸，自带二级菜单，可选小、中、大、特大", category: "fontStyle", categoryLabel: "字体样式类" },
    { label: "文字颜色", value: "color", description: "文字颜色，自带二级菜单，可选文字颜色、文字背景色", category: "fontStyle", categoryLabel: "字体样式类" },

    // 段落属性类
    { label: "引用", value: "quote", description: "引用文本", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "手风琴", value: "detail", description: "可展开收起的内容区域", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "一级标题", value: "h1", description: "一级标题", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "二级标题", value: "h2", description: "二级标题", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "三级标题", value: "h3", description: "三级标题", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "标题菜单", value: "header", description: "标题菜单，自带二级菜单，可选1~5级标题", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "无序列表", value: "ul", description: "无序列表", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "有序列表", value: "ol", description: "有序列表", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "任务清单", value: "checklist", description: "可勾选的任务清单", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "列表菜单", value: "list", description: "列表菜单，自带二级菜单，可选有序列表、无序列表、任务清单", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "对齐方式", value: "justify", description: "对齐方式，自带二级菜单，可选左对齐、居中、右对齐", category: "paragraph", categoryLabel: "段落属性类" },
    { label: "信息面板", value: "panel", description: "信息面板，自带二级菜单，可选tips、info、warning、danger、success", category: "paragraph", categoryLabel: "段落属性类" },

    // 插入类
    { label: "插入图片", value: "image", description: "插入图片", category: "insert", categoryLabel: "插入类" },
    { label: "插入音频", value: "audio", description: "插入音频", category: "insert", categoryLabel: "插入类" },
    { label: "插入视频", value: "video", description: "插入视频", category: "insert", categoryLabel: "插入类" },
    { label: "插入PDF", value: "pdf", description: "插入PDF文档", category: "insert", categoryLabel: "插入类" },
    { label: "插入Word", value: "word", description: "插入Word文档", category: "insert", categoryLabel: "插入类" },
    { label: "插入文件", value: "file", description: "插入普通文件", category: "insert", categoryLabel: "插入类" },
    { label: "插入链接", value: "link", description: "插入超链接", category: "insert", categoryLabel: "插入类" },
    { label: "水平分割线", value: "hr", description: "插入水平分割线", category: "insert", categoryLabel: "插入类" },
    { label: "插入新行", value: "br", description: "插入新行", category: "insert", categoryLabel: "插入类" },
    { label: "代码块", value: "code", description: "插入代码块", category: "insert", categoryLabel: "插入类" },
    { label: "数学公式", value: "formula", description: "插入数学公式", category: "insert", categoryLabel: "插入类" },
    { label: "目录", value: "toc", description: "插入目录", category: "insert", categoryLabel: "插入类" },
    { label: "表格", value: "table", description: "插入表格", category: "insert", categoryLabel: "插入类" },
    { label: "Draw.io", value: "drawIo", description: "插入draw.io画图，点击后会出现draw.io画图面板", category: "insert", categoryLabel: "插入类" },
    { label: "图表", value: "graph", description: "插入画图，自带二级菜单，可选流程图、时序图、状态图、类图、饼图、甘特图", category: "insert", categoryLabel: "插入类" },

    // 功能类
    { label: "撤销", value: "undo", description: "回撤操作", category: "function", categoryLabel: "功能类" },
    { label: "重做", value: "redo", description: "恢复最近回撤的操作", category: "function", categoryLabel: "功能类" },
    { label: "主题", value: "theme", description: "切换主题，自带二级菜单", category: "function", categoryLabel: "功能类" },
    { label: "代码主题", value: "codeTheme", description: "切换代码块的主题，自带二级菜单", category: "function", categoryLabel: "功能类" },
    { label: "移动预览", value: "mobilePreview", description: "把预览区域变成h5模式", category: "function", categoryLabel: "功能类" },
    { label: "切换预览", value: "togglePreview", description: "打开/关闭预览区(用于左右分栏模式)", category: "function", categoryLabel: "功能类" },
    { label: "切换模式", value: "switchModel", description: "切换编辑/预览模式(用于单栏编辑模式)", category: "function", categoryLabel: "功能类" },
    { label: "复制HTML", value: "copy", description: "复制预览区域的html内容到剪贴板", category: "function", categoryLabel: "功能类" },
    { label: "导出", value: "export", description: "导出，自带二级菜单，可选导出PDF、导出长图、导出markdown、导出html", category: "function", categoryLabel: "功能类" },
    { label: "全屏", value: "fullScreen", description: "全屏/取消全屏", category: "function", categoryLabel: "功能类" },
    { label: "设置", value: "settings", description: "设置，自带二级菜单，可选常规换行/经典换行切换、关闭/打开预览、隐藏工具栏", category: "function", categoryLabel: "功能类" },
];