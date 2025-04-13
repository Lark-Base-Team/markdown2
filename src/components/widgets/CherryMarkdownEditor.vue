<template>
    <div class="md-editor" ref="mdEditor">
    </div>
</template>
<script setup lang="ts">

import { ref, onMounted, computed, watch } from "vue";
import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown';
import { i } from "vite/dist/node/types.d-aGj9QkWt";
import { on } from "events";
const cherryInstance = ref({})
const mdEditor = ref(null)
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    }
});
const emit = defineEmits(['update:modelValue', 'base:save', 'base:last', 'base:next']);
const afterChange = (text, html) => {
    // console.log(text, html);
    emit('update:modelValue', text);
}

// 监听 modelValue 的变化
watch(() => props.modelValue, (newValue, oldValue) => {
    // 确保 cherryInstance 已初始化且新值与旧值不同
    if (cherryInstance.value && cherryInstance.value.getValue && newValue !== oldValue) {
        // 获取当前编辑器的值
        const currentValue = cherryInstance.value.getValue();
        // 只有当编辑器当前值与新值不同时才更新，避免循环更新
        if (currentValue !== newValue) {
            // cherryInstance.value.setValue(newValue);
            createNewCherry(newValue);
        }
    }
});
const customMenu = ref({})
const createCustomMunu = () => {
    let ret = {
        save: Cherry.createMenuHook('保存到多维表格', {
            title: '保存到多维表格',
            icon: {
                type: 'svg',
                content: '<svg t="1744423732130" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4313" width="200" height="200"><path d="M906.666667 298.666667L725.333333 117.333333c-14.933333-14.933333-32-21.333333-53.333333-21.333333H170.666667C130.133333 96 96 130.133333 96 170.666667v682.666666c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667V349.866667c0-19.2-8.533333-38.4-21.333333-51.2zM652.8 864H371.2V648.533333h281.6v215.466667z m211.2-10.666667c0 6.4-4.266667 10.666667-10.666667 10.666667h-140.8V618.666667c0-17.066667-12.8-29.866667-29.866666-29.866667H341.333333c-17.066667 0-29.866667 12.8-29.866666 29.866667v245.333333H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h140.8V320c0 17.066667 12.8 29.866667 29.866666 29.866667h277.333334c17.066667 0 29.866667-12.8 29.866666-29.866667s-12.8-29.866667-29.866666-29.866667H371.2V160h302.933333c2.133333 0 6.4 2.133333 8.533334 2.133333l179.2 179.2c2.133333 2.133333 2.133333 4.266667 2.133333 8.533334V853.333333z" fill="#666666" p-id="4314"></path></svg>',
                iconStyle: 'width: 15px; height: 15px; vertical-align: middle;',
            },
            onClick: (select) => {
                // 点击事件
                console.log('点击了保存', select);
                emit('base:save', select);
            },
        }),
        last: Cherry.createMenuHook('上一行', {
            title: '上一行',
            icon: {
                type: 'svg',
                content: '<svg t="1744426053497" class="icon" viewBox="0 0 1048 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9093" width="200" height="200"><path d="M565.514 273.221c0.393 0.394 0.491 0.935 0.861 1.326l431.062 392.233c23.201 23.692 23.471 61.883 0.566 85.254-22.906 23.374-60.284 23.126-83.511-0.589l-390.168-355.025-390.933 355.739c-23.224 23.691-60.826 23.716-84.025 0.049-23.174-23.692-23.151-62.079 0.049-85.795l432.096-393.168c23.199-23.692 60.827-23.716 84.001-0.024z" fill="#272536" p-id="9094"></path></svg>',
                iconStyle: 'width: 15px; height: 15px; vertical-align: middle;',
            },
            onClick: (select) => {
                // 点击事件
                // console.log('点击了上一行', select);
                emit('base:last', select);
            },
        }),
        next: Cherry.createMenuHook('下一行', {
            title: '下一行',
            icon: {
                type: 'svg',
                content: '<svg t="1744425697761" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8122" width="200" height="200"><path d="M548.352 730.624l394.24-360.96c21.504-19.456 23.04-53.248 3.072-74.24-19.456-21.504-53.248-23.04-74.24-3.072l-358.912 328.704L153.088 291.84c-21.504-19.456-54.784-17.92-74.24 3.584-19.456 21.504-17.92 54.784 3.584 74.24l394.752 360.448c1.024 0.512 1.536 1.536 2.56 2.048 19.456 16.896 49.152 16.384 68.608-1.536z" p-id="8123"></path></svg>',
                iconStyle: 'width: 15px; height: 15px; vertical-align: middle;',
            },
            onClick: (select) => {
                // 点击事件
                // console.log('点击了下一行', select);
                emit('base:next', select);
            },
        }),
    }
    console.log(ret)
    return ret
}

const createNewCherry = (text: string) => {
    if (cherryInstance && cherryInstance.value && cherryInstance.value.destroy) {
        console.log('销毁实例')
        cherryInstance.value.destroy()
    }
    // console.log(mdEditor.value)
    cherryInstance.value = new Cherry({
        el: mdEditor.value,
        value: text,
        toolbars: {
            // 定义顶部工具栏
            // toolbar: ['bold', 'italic', 'strikethrough', '|', 'color', 'header', 'ruby', '|', 'list', 'panel', 'detail', 'export', 'togglePreview', 'switchModel'],
            toolbar: ['save', 'last', 'next', 'bold', 'italic', 'strikethrough', '|', 'color', 'header', 'formula','ruby', '|', 'list', 'table', 'panel', 'detail', 'togglePreview', 'switchModel', 'export'],
            // 定义侧边栏，默认为空
            sidebar: [],
            // 定义顶部右侧工具栏，默认为空
            toolbarRight: [],
            // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
            bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color', 'table'],
            // bubble: false,
            // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
            float: false,
            customMenu: createCustomMunu(),
        },

    });
    function onPaste(clipboardData) {
        return false;
    }
    cherryInstance.value.on('afterChange', afterChange);
}

onMounted(() => {
    // initCustomIcon();
    createNewCherry(props.modelValue);
});
</script>
<style scoped>
/* 其余样式保持不变 */
</style>