<template>
    <div class="editor-container">
        <div class="markdown-editor">
            <CherryMarkdownEditor @update:model-value="updateMarkdownText" v-model:model-value="markdownText"></CherryMarkdownEditor>
        </div>
        <div class="text-area">
            <el-input type="textarea" v-model="markdownText" placeholder="请输入Markdown文本"></el-input>
        </div>
    </div>
</template>
<script setup lang="ts">

import Cherry from "cherry-markdown";
import { ref, onMounted, computed } from "vue";
import CherryMarkdownEditor from "@/components/widgets/CherryMarkdownEditor.vue";
const markdownText = ref("");
const updateMarkdownText = (text) => {
    // console.log('dd',text);
};
onMounted(() => {
});
</script>
<style scoped>
.editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.markdown-editor {
    flex: 1;
    margin-bottom: 10px;
}

.text-area {
    height: 150px;
}

.text-area textarea {
    width: 100%;
    height: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
}

/* 其余样式保持不变 */
</style>