<template>
  <!-- 多维表格编辑插件 -->
  <div class="base-markdown-editor">
    <div class="editor-container">
      <Editor ref="editor" v-model:model-value="markdownText" @base:last="lastLine" @base:save="save"
        @base:next="nextLine" @base:left="leftColumn" @base:right="rightColumn"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Editor from '@/components/widgets/CherryMarkdownEditor.vue';
import { BaseTableBridgeService } from '@/services/BaseTableBridgeService';
import { baseTableServices } from '@/services/BaseTableServices';
import { on } from 'events';
import { ElMessage } from 'element-plus';

const editor = ref();
const baseTableBridgeService = new BaseTableBridgeService();
const selectValue = baseTableBridgeService.getCurrentCellValue()
const markdownText = ref("");
const onSelectChange = (v, s) => {
  // console.log('监听选中单元格的值:', v);
  markdownText.value = v;
}
// 光标移动方法
const init = () => {
  baseTableBridgeService.initListener()
  baseTableBridgeService.onSelectChange(onSelectChange)
}
const leftColumn = () => {
  console.log('左一列');
  baseTableBridgeService.selectLeftColumn() 
}
const rightColumn = () => {
  console.log('右一列');
  baseTableBridgeService.selectRightColumn() 
}
const nextLine = () => {
  console.log('下一行');
  baseTableBridgeService.selectNextLineRecord()
}
const lastLine = () => {
  console.log('上一行');
  baseTableBridgeService.selectLastLineRecord()
}
const save = () => {
  console.log('保存');
  baseTableBridgeService.saveToCurrentSelect(markdownText.value).then((index:number[]) => {
    ElMessage.success(`保存成功`)
  }).catch((err:any) => {
    ElMessage.error('保存失败')
  })
}
onMounted(() => {
  init()
});

defineExpose({

});
</script>

<style scoped>
.editor-container {
  height: 90vh;
}
</style>