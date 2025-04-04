import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
// @ts-ignore
import taskLists from 'markdown-it-task-lists';
import githubAlerts from 'markdown-it-github-alerts';

export class MarkDownEngine {

    md: MarkdownIt
    constructor() {
        this.md = this.newEngine()
    }


    getEngine(): MarkdownIt {
        return this.md;
    }

    render(text: string) {
        return this.md.render(text)
    }

    newEngine(): MarkdownIt {
        let md = new MarkdownIt({
            html: true,
            highlight: (str: string, lang?: string) => {
                if (lang && (lang = this.normalizeHighlightLang(lang)) && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
                    } catch { }
                }
                return ""; // Signal to markdown-it itself to handle it.
            }
        })
        this.extendMarkdownIt(md)
        return md;
    }

    normalizeHighlightLang(lang: string): string {
        switch (lang && lang.toLowerCase()) {
            case 'tsx':
            case 'typescriptreact':
                return 'jsx';
            case 'json5':
            case 'jsonc':
                return 'json';
            case 'c#':
            case 'csharp':
                return 'cs';
            default:
                return lang;
        }
    }
    extendMarkdownIt(md: MarkdownIt): MarkdownIt {
        // 使用插件
        md.use(taskLists, { enabled: true });
        md.use(githubAlerts, { matchCaseSensitive: false });

        // if (configManager.get("math.enabled")) {
        //     // We need side effects. (#521)
        //     require("katex/contrib/mhchem");

        //     // Deep copy, as KaTeX needs a normal mutable object. <https://katex.org/docs/options.html>
        //     const macros: KatexOptions["macros"] = JSON.parse(JSON.stringify(configManager.get("katex.macros")));

        //     if (Object.keys(macros).length === 0) {
        //         delete katexOptions["macros"];
        //     } else {
        //         katexOptions["macros"] = macros;
        //     }

        //     md.use(require("@neilsustc/markdown-it-katex"), katexOptions);
        // }

        return md;
    }
}

export const mdEngine = new MarkDownEngine()