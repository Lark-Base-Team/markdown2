<template>
  <div ref="editorContainer" class="editor-container">
    <div v-show="showFloatingToolbar" ref="floatingToolbar" class="floating-toolbar">
      <button @click="applyFormat('bold')"><strong>B</strong></button>
      <button @click="applyFormat('italic')"><em>I</em></button>
      <button @click="applyFormat('underline')"><u>U</u></button>
      <button @click="applyFormat('link')">🔗</button>
      <button @click="applyFormat('code')">&#60;/&#62;</button>
      <button @click="applyFormat('color')">A</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as monaco from "monaco-editor";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "javascript",
  },
  theme: {
    type: String,
    default: "vs-dark",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorContainer = ref(null);
let editor: monaco.editor.IStandaloneCodeEditor = null;
let resizeObserver = null;
const showFloatingToolbar = ref(false);
const floatingToolbar = ref(null);
let selectionChangeDisposable = null;

// 初始化编辑器
onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true, // 自动布局
    minimap: {
      enabled: false, // 关闭迷你地图
    },
    scrollbar: {
      // 自定义滚动条配置
      useShadows: false, // 禁用滚动阴影
      verticalScrollbarSize: 8, // 垂直滚动条宽度
      horizontalScrollbarSize: 8, // 水平滚动条高度
      verticalHasArrows: false, // 禁用垂直箭头
      horizontalHasArrows: false, // 禁用水平箭头
      vertical: 'visible', // 垂直滚动条始终可见
      horizontal: 'visible', // 水平滚动条始终可见
      verticalSliderSize: 8, // 垂直滑块大小
      horizontalSliderSize: 8, // 水平滑块大小
    },
  });

  // 内容变化事件
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    emit("update:modelValue", value);
  });

  // 监听选择变化事件
  selectionChangeDisposable = editor.onDidChangeCursorSelection(handleSelectionChange);

  // 创建 ResizeObserver 监听容器大小变化
  resizeObserver = new ResizeObserver(() => {
    if (editor) {
      editor.layout();
    }
  });

  // 开始监听容器大小变化
  if (editorContainer.value) {
    resizeObserver.observe(editorContainer.value);
  }
});

// 处理选择变化
const handleSelectionChange = (e) => {
  const selection = editor.getSelection();

  // 检查是否有文本被选中
  if (selection && !selection.isEmpty()) {
    showFloatingToolbar.value = true;

    // 获取选中文本的坐标
    const startPos = editor.getScrolledVisiblePosition(selection.getStartPosition());
    const endPos = editor.getScrolledVisiblePosition(selection.getEndPosition());

    // 计算工具栏位置
    if (floatingToolbar.value && startPos && endPos) {
      // 设置工具栏位置在选中文本上方
      const toolbarWidth = floatingToolbar.value.offsetWidth;
      const toolbarHeight = floatingToolbar.value.offsetHeight;
      const centerX = (startPos.left + endPos.left) / 2;

      floatingToolbar.value.style.left = `${centerX - toolbarWidth / 2}px`;
      floatingToolbar.value.style.top = `${startPos.top - toolbarHeight - 5}px`;
    }
  } else {
    showFloatingToolbar.value = false;
  }
};

// 应用格式化
const applyFormat = (type) => {
  if (!editor) return;

  const selection = editor.getSelection();
  if (selection.isEmpty()) return;

  const selectedText = editor.getModel().getValueInRange(selection);
  let newText = '';

  switch (type) {
    case 'bold':
      newText = `**${selectedText}**`;
      break;
    case 'italic':
      newText = `*${selectedText}*`;
      break;
    case 'underline':
      newText = `<u>${selectedText}</u>`;
      break;
    case 'link':
      newText = `[${selectedText}](url)`;
      break;
    case 'code':
      newText = `\`${selectedText}\``;
      break;
    case 'color':
      newText = `<font color="color">${selectedText}</font>`;
      break;
    default:
      newText = selectedText;
  }

  // 替换选中文本
  editor.executeEdits('', [
    { range: selection, text: newText }
  ]);
};

// 组件销毁时释放资源
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }

  if (selectionChangeDisposable) {
    selectionChangeDisposable.dispose();
  }

  // 停止监听大小变化
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getValue()) {
      editor.setValue(newValue);
    }
  }
);

// 监听主题变化
watch(
  () => props.theme,
  (newTheme) => {
    if (editor) {
      monaco.editor.setTheme(newTheme);
    }
  }
);
const getEditor = () => {
  return editor;
}

defineExpose({
  getEditor,
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  /* 修改为100%，使编辑器高度跟随父元素 */
  border: 1px solid #333;
  border-radius: 4px;
  position: relative;
}

.floating-toolbar {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 8px;
  display: flex;
  gap: 8px;
  z-index: 10000;
}

.floating-toolbar button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-toolbar button:hover {
  background-color: #f0f0f0;
}

/* 自定义编辑器滚动条样式 */
:deep(.monaco-scrollable-element > .scrollbar > .slider) {
  background: rgba(100, 100, 100, 0.4) !important;
  border-radius: 10px !important;
  transition: background 0.2s ease;
}

:deep(.monaco-scrollable-element > .scrollbar > .slider:hover) {
  background: rgba(100, 100, 100, 0.7) !important;
}

:deep(.monaco-scrollable-element > .scrollbar) {
  background-color: transparent !important;
}
</style>