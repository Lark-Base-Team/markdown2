<template>
    <div class="md-editor" ref="mdEditor">
    </div>
</template>
<script setup lang="ts">

import { ref, onMounted, computed, watch } from "vue";
import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown';
const cherryInstance = ref({})
const mdEditor = ref(null)
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    }
});
const emit = defineEmits(['update:modelValue', 'base:save', 'base:last', 'base:next','base:left','base:right','base:userSettings']);
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
        left: Cherry.createMenuHook('左一列', {
            title: '左一列',
            icon: {
                type: 'svg',
                content: '<svg t="1745061009629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6722" width="200" height="200"><path d="M740.352 849.919l-57.225 59.008-399.479-396.929 399.476-396.924 57.228 59.004-335.872 337.92z" fill="#272636" p-id="6723"></path></svg>',
                iconStyle: 'width: 15px; height: 15px; vertical-align: middle;',
            },
            onClick: (select) => {
                // 点击事件
                // console.log('点击了上一行', select);
                emit('base:left', select);
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
        right: Cherry.createMenuHook('右一列', {
            title: '右一列',
            icon: {
                type: 'svg',
                content: '<svg t="1745061048311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6869" width="200" height="200"><path d="M283.648 174.081l57.225-59.008 399.479 396.929-399.476 396.924-57.228-59.004 335.872-337.92z" fill="#272636" p-id="6870"></path></svg>',
                iconStyle: 'width: 15px; height: 15px; vertical-align: middle;',
            },
            onClick: (select) => {
                // 点击事件
                // console.log('点击了下一行', select);
                emit('base:right', select);
            },
        }),
        userSettings: Cherry.createMenuHook('用户设置', {
            title: '用户设置',
            icon: {
                type: 'svg',
                content: '<svg t="1745069342159" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7903" width="200" height="200"><path d="M387.3 560.8c-64.7 0-125.6-26.1-171.3-73.6-45.5-47.3-70.6-110-70.6-176.8 0-66.7 25.1-129.5 70.6-176.8C261.8 86.2 322.6 60 387.3 60s125.6 26.1 171.3 73.6c45.5 47.3 70.6 110 70.6 176.8 0 66.7-25.1 129.5-70.6 176.8-45.7 47.4-106.5 73.6-171.3 73.6z m0-460.8c-111.3 0-201.8 94.4-201.8 210.4S276 520.8 387.3 520.8s201.8-94.4 201.8-210.4S498.6 100 387.3 100zM710.1 964H64.5C42.7 964 25 946.2 25 924.4V798.6c0-62.9 24.5-122 69-166.5s103.6-69 166.5-69h253.8c12.6 0 25.3 1 37.7 3 10.9 1.8 18.3 12 16.6 22.9-1.8 10.9-12 18.3-22.9 16.6-10.3-1.7-20.8-2.5-31.3-2.5h-254C152.6 603.2 65 690.8 65 798.6V924h644.9c6.7-8.6 19.2-10.2 27.9-3.6 8.8 6.7 10.5 19.3 3.7 28-7.5 9.9-19 15.6-31.4 15.6z" fill="#1C1C1C" p-id="7904"></path><path d="M742.8 884.4c-7.3 0-14.5-1.9-20.9-5.6l-47.8-27.4c-20.1-11.5-27-37.2-15.5-57.3l7.9-13.7c-3.6-5.4-6.9-11-9.8-16.8h-15.8-0.1c-23.1 0-41.9-18.8-42-41.8l-0.2-55.1c0-11.2 4.3-21.8 12.2-29.7 7.9-8 18.4-12.3 29.6-12.4h15.8c1.5-3 3-5.9 4.5-8.6s3.3-5.5 5.2-8.3L658 594c-5.6-9.7-7.2-21-4.3-31.8 2.9-10.8 9.8-19.9 19.5-25.5l47.6-27.7c6.4-3.7 13.7-5.7 21.1-5.7 14.9 0 28.8 8 36.3 20.9l7.9 13.7c6.5-0.4 13-0.4 19.5 0l7.9-13.7c7.5-13 21.4-21.1 36.4-21.1 7.3 0 14.5 1.9 20.9 5.6l47.8 27.4c9.7 5.6 16.7 14.6 19.6 25.4s1.5 22.1-4.1 31.9l-7.9 13.7c3.6 5.4 6.9 11 9.8 16.8h15.9c23.1 0 41.9 18.8 42 41.8l0.2 55.1c0 11.2-4.3 21.8-12.2 29.7-7.9 8-18.4 12.3-29.6 12.4h-15.8c-1.5 3-3 5.9-4.5 8.6-1.6 2.7-3.3 5.5-5.2 8.3l7.9 13.6c5.6 9.7 7.2 21 4.3 31.8-2.9 10.8-9.8 19.9-19.5 25.5l-47.6 27.7c-6.4 3.7-13.7 5.7-21.1 5.7-14.9 0-28.8-8-36.3-20.9l-7.9-13.7c-6.5 0.4-13 0.4-19.5 0l-7.9 13.7c-7.5 13.1-21.4 21.2-36.4 21.2z m-73.2-160.9c8.2 0 15.6 5 18.6 12.7 4.3 10.9 10.2 21.1 17.6 30.3 5.2 6.4 5.9 15.3 1.8 22.5l-14.3 25c-0.5 0.9-0.2 2.1 0.7 2.7l47.8 27.4c0.3 0.2 0.6 0.3 1 0.3 0.3 0 1.2-0.1 1.7-1l14.3-25c4.1-7.1 12.2-11.1 20.3-9.8 11.7 1.7 23.6 1.7 35.1-0.1 8.1-1.3 16.2 2.6 20.4 9.7l14.5 24.9c0.5 0.9 1.5 1 1.7 1 0.3 0 0.7-0.1 1-0.3l47.6-27.7c0.5-0.3 0.8-0.7 0.9-1.2s0.1-1-0.2-1.5l-14.5-25c-4.1-7.1-3.5-16 1.6-22.5 4.2-5.3 7.4-9.9 10-14.5 2.6-4.6 5-9.6 7.4-15.9 3-7.7 10.4-12.7 18.6-12.8l28.9-0.1c0.5 0 1-0.2 1.4-0.6s0.6-0.9 0.6-1.4l-0.2-55.1c0-1.1-0.9-2-2-2l-28.8 0.1h-0.1c-8.2 0-15.6-5-18.6-12.7-4.3-10.9-10.2-21.1-17.6-30.3-5.2-6.4-5.9-15.3-1.8-22.5l14.3-25c0.3-0.5 0.3-1 0.2-1.5s-0.5-0.9-0.9-1.2L850.8 543c-0.3-0.2-0.6-0.3-1-0.3-0.3 0-1.2 0.1-1.7 1l-14.3 25c-4.1 7.1-12.2 11-20.3 9.8-11.7-1.7-23.6-1.7-35.1 0.1-8.1 1.3-16.2-2.6-20.4-9.7L743.5 544c-0.5-0.9-1.5-1-1.7-1-0.3 0-0.7 0.1-1 0.3L693.2 571c-0.5 0.3-0.8 0.7-0.9 1.2-0.1 0.5-0.1 1 0.2 1.5l14.5 25c4.1 7.1 3.5 16-1.6 22.5-4.2 5.3-7.4 9.9-10 14.5-2.6 4.6-5 9.6-7.4 15.9-3 7.7-10.4 12.7-18.6 12.8l-28.9 0.1c-0.5 0-1 0.2-1.4 0.6s-0.6 0.9-0.6 1.4l0.2 55.1c0 1.1 0.9 2 2 2l28.9-0.1z" fill="#1C1C1C" p-id="7905"></path><path d="M796.3 752.7c-10.3 0-20.4-2.7-29.3-7.8-13.7-7.8-23.5-20.5-27.6-35.7-4.1-15.2-2.1-31.1 5.8-44.8 10.5-18.3 30.1-29.7 51.2-29.7 10.3 0 20.4 2.7 29.3 7.8 13.7 7.8 23.5 20.5 27.6 35.7s2.1 31.1-5.8 44.8c-10.5 18.3-30.1 29.7-51.2 29.7z m0.1-78c-6.8 0-13.1 3.7-16.5 9.6-2.5 4.4-3.2 9.5-1.9 14.4 1.3 4.9 4.5 9 8.9 11.5 2.9 1.7 6.1 2.5 9.4 2.5 6.8 0 13.1-3.7 16.5-9.6 2.5-4.4 3.2-9.5 1.9-14.4-1.3-4.9-4.5-9-8.9-11.5-2.9-1.7-6.1-2.5-9.4-2.5z" fill="#1C1C1C" p-id="7906"></path></svg>',
                iconStyle: 'width: 15px; height: 15px; vertical-align: middle;',
            },
            onClick: (select) => {
                // 点击事件
                // console.log('点击了下一行', select);
                emit('base:userSettings', select);
            },
        })
    }
    // console.log(ret)
    return ret
}

const createNewCherry = (text: string) => {
    let model = ''
    if (cherryInstance && cherryInstance.value && cherryInstance.value.destroy) {
        // console.log('销毁实例')
        // console.log(cherryInstance.value)
        // model  = cherryInstance.value.getModel()
        cherryInstance.value.destroy()
    }
    // console.log(mdEditor.value)
    cherryInstance.value = new Cherry({
        el: mdEditor.value,
        value: text,
        editor:{
            defaultModel: 'editOnly',
        },
        toolbars: {
            showToolbar: true, 
            // 定义顶部工具栏
            // toolbar: ['bold', 'italic', 'strikethrough', '|', 'color', 'header', 'ruby', '|', 'list', 'panel', 'detail', 'export', 'togglePreview', 'switchModel'],
            toolbar: ['save','left', 'last', 'next', 'right','bold', 'italic', 'strikethrough', 'link','|', 'color', 'header', 'code','formula','toc','copy','ruby', '|', 'list', 'table','checklist','justify', 'panel', 'detail', 'togglePreview', 'switchModel', 'export','userSettings'],
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