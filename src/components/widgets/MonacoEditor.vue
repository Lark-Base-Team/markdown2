<template>
  <div ref="editorContainer" class="editor-container"></div>
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

// 组件销毁时释放资源
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
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