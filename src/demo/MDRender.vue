<template>
  <div class="md-render-container">
    <el-row :gutter="20" class="md-render-row">
      <el-col :span="12" class="input-area">
        <el-input
          type="textarea"
          v-model="markdownText"
          placeholder="请输入 Markdown 文本..."
          :autosize="{ minRows: 20 }"
          class="markdown-textarea"
        />
      </el-col>
      <el-col :span="12" class="preview-area">
        <div class="markdown-preview" v-html="renderedHtml"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted } from "vue";
import { mdEngine } from "@/services/MarkDownEngine";
import "highlight.js/styles/github.css";

// 定义 Markdown 文本和渲染后的 HTML
const markdownText = ref(
  '# Markdown 预览\n\n这是一个 **Markdown** 编辑器示例。\n\n## 代码示例\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```\n\n## 列表示例\n\n- 项目 1\n- 项目 2\n  - 子项目 A\n  - 子项目 B\n\n## 表格示例\n\n| 名称 | 描述 |\n| --- | --- |\n| Markdown | 轻量级标记语言 |\n| Vue | 渐进式 JavaScript 框架 |'
);

// 计算属性：将 Markdown 转换为 HTML
const renderedHtml = computed(() => {
  return mdEngine.render(markdownText.value);
});

// 组件挂载时的初始化逻辑
onMounted(() => {
  console.log("Markdown 渲染器已加载");
});
</script>

<style scoped>
.md-render-container {
  padding: 20px;
  height: 100%;
}

.md-render-row {
  height: 100%;
}

.input-area,
.preview-area {
  height: 100%;
  padding: 10px;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  font-family: "Courier New", Courier, monospace;
}

.markdown-preview {
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  min-height: 400px;
  overflow-y: auto;
  line-height: 1.6;
}

/* 覆盖 scoped 样式限制，使 markdown 内容样式生效 */
:deep(.markdown-preview h1) {
  font-size: 2em;
  margin-bottom: 0.5em;
}

:deep(.markdown-preview h2) {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

:deep(.markdown-preview pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
}

:deep(.markdown-preview code) {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.markdown-preview table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

:deep(.markdown-preview th),
:deep(.markdown-preview td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

:deep(.markdown-preview th) {
  background-color: #f2f2f2;
}
</style>