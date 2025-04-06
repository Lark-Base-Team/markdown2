<template>
    <div class="floating-toolbar" :style="position" @mousedown="startDrag" v-if="isVisible">
        <div class="toolbar-header">
            <span>编辑工具</span>
            <el-button @click="toggleToolbar" size="small">
                <el-icon>
                    <Close />
                </el-icon>
            </el-button>
        </div>
        <div class="toolbar-content">
            <el-button size="small" @click="applyFormat('bold')">加粗</el-button>
            <el-button size="small" @click="applyFormat('italic')">斜体</el-button>
            <el-button size="small" @click="applyFormat('strikethrough')">删除线</el-button>
            <el-button size="small" @click="applyFormat('code')">代码</el-button>
            <el-button size="small" @click="applyFormat('link')">链接</el-button>
            <el-button size="small" @click="applyFormat('image')">图片</el-button>
            <el-button size="small" @click="applyFormat('heading')">标题</el-button>
            <el-button size="small" @click="applyFormat('orderedList')">有序有效</el-button>
            <el-button size="small" @click="applyFormat('unorderedList')">无序列表</el-button>
        </div>
    </div>
    <el-tooltip content="编辑工具" placement="top" :hide-after="1000">
        <el-button circle size="small" @click="toggleToolbar">
            <el-icon>
                <Tools />
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Close, Tools } from '@element-plus/icons-vue';
import { MonacoEditorServices } from '@/services/MonacoEditorServices';
import { MarkdownGrammarServices } from '@/services/MarkdownGrammarServices';
import { split } from 'lodash-es';
import { AppContext } from '@/services/AppContext';

const props = defineProps({
    initialPosition: {
        type: Object,
        default: () => ({ top: '100px', left: '100px' })
    },
    ctx: {
        type: Object as () => AppContext,
        default: () => ({})
    }
});

const emit = defineEmits(['close']);

const position = ref(props.initialPosition);
const isVisible = ref(false); // 默认不显示工具面板
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// 切换工具面板显示状态
const toggleToolbar = () => {
    isVisible.value = !isVisible.value;
    // if (!isVisible.value) {
    //     emit('close');
    // }
};

// 开始拖拽
const startDrag = (e) => {
    // 只有点击工具栏头部才能拖动
    if (e.target.closest('.toolbar-header')) {
        isDragging = true;
        dragOffsetX = e.clientX - parseInt(position.value.left);
        dragOffsetY = e.clientY - parseInt(position.value.top);

        // 添加全局事件监听
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }
};

// 拖拽中
const onDrag = (e) => {
    if (isDragging) {
        position.value = {
            top: `${e.clientY - dragOffsetY}px`,
            left: `${e.clientX - dragOffsetX}px`
        };
    }
};

// 停止拖拽
const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
};

// 应用格式化
const applyFormat = (type) => {
    if (!props.ctx) return;

    const editor = props.ctx.getEditor();
    if (!editor) return;
    let selectedText = editor.getSelectedOrCurrentLineText();

    let newText = '';

    switch (type) {
        case 'bold':
            newText = MarkdownGrammarServices.bold(selectedText);
            break;
        case 'italic':
            newText = MarkdownGrammarServices.italic(selectedText);
            break;
        case 'strikethrough':
            newText = MarkdownGrammarServices.strikethrough(selectedText);
            break;
        case 'code':
            newText = MarkdownGrammarServices.codeBlock(selectedText);
            break;
        case 'link':
            newText = MarkdownGrammarServices.link('link-url', selectedText);
            break;
        case 'image':
            newText = MarkdownGrammarServices.image('image-url', selectedText);
            break;
        case 'heading':
            newText = MarkdownGrammarServices.h(1, selectedText);
            break;
        case 'orderedList':
            newText = MarkdownGrammarServices.orderedList(split(selectedText, '\n'));
            break;
        case 'unorderedList':
            newText = MarkdownGrammarServices.unorderedList(split(selectedText, '\n'));
            break;
    }
    console.log(`selectedText: ${selectedText}`);
    console.log(`newText: ${newText}`);
    editor.replaceSelectedText(newText);
    // 聚焦回编辑器
};
</script>

<style scoped>
.floating-toolbar {
    position: fixed;
    z-index: 1000;
    background-color: white;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* width: 300px; */
    user-select: none;
}

.toolbar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    cursor: move;
}

.toolbar-content {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>