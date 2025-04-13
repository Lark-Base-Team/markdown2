<template>
    <div class="editor-container">
        <BaseMarkdownEditor></BaseMarkdownEditor>
    </div>
</template>
<script setup lang="ts">

import Cherry from "cherry-markdown";
import { ref, onMounted, computed } from "vue";
import BaseMarkdownEditor from "@/components/BaseMarkdownEditor.vue";
const markdownText = ref("");

onMounted(() => {
});
</script>
<style scoped>
</style>