<template>
  <!-- 多维表格编辑插件 -->
  <div class="base-markdown-editor">
    <div class="editor-container">
      <Editor
        ref="editor"
        v-model:model-value="markdownText"
        @base:last="lastLine"
        @base:save="save"
        @base:next="nextLine"
        @base:left="leftColumn"
        @base:right="rightColumn"
        @base:userSettings="userSettings"
        @base:favor="userFavor"
        :ctx="ctx"
      />
    </div>

    <!-- 用户设置对话框 -->
    <el-dialog
      v-model="settingsDialogVisible"
      title="用户设置"
      width="100%"
      :before-close="handleCloseSettings"
    >
      <UserSettings
        @settting-user-settings:saved="saveUserSettings"
        @settting-user-settings:cancel="cancelUserSettings"
        :ctx="ctx"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Editor from "@/components/widgets/CherryMarkdownEditor.vue";
import { BaseTableBridgeService } from "@/services/BaseTableBridgeService";
import { baseTableServices } from "@/services/BaseTableServices";
import { ElMessage } from "element-plus";
import UserSettings from "@/components/widgets/UserSettings.vue";
import { AppContext } from "../services/AppContext";
import { UserSettingsServices } from "../services/UserSettingsServices";

const editor = ref();
const baseTableBridgeService = new BaseTableBridgeService();
const ctx: AppContext = new AppContext();
ctx.setUserSettingsService(new UserSettingsServices());
const selectValue = baseTableBridgeService.getCurrentCellValue();
const markdownText = ref("");
const onSelectChange = (v: string, s: string) => {
  // console.log('监听选中单元格的值:', v);
  markdownText.value = v;
};
// 光标移动方法
const init = () => {
  baseTableBridgeService.initListener();
  baseTableBridgeService.onSelectChange(onSelectChange);
};
const leftColumn = () => {
  console.log("左一列");
  baseTableBridgeService.selectLeftColumn();
};
const rightColumn = () => {
  console.log("右一列");
  baseTableBridgeService.selectRightColumn();
};
const nextLine = () => {
  console.log("下一行");
  baseTableBridgeService.selectNextLineRecord();
};
const lastLine = () => {
  console.log("上一行");
  baseTableBridgeService.selectLastLineRecord();
};
const save = () => {
  console.log("保存");
  baseTableBridgeService
    .saveToCurrentSelect(markdownText.value)
    .then((index: number[]) => {
      ElMessage.success(`保存成功`);
    })
    .catch((err: any) => {
      ElMessage.error("保存失败");
    });
};
const userSettingsData = ref({});
const settingsDialogVisible = ref(false);
const userSettings = (settings: any) => {
  console.log("用户设置", settings);
  userSettingsData.value = settings || {};
  settingsDialogVisible.value = true;
};

const userFavor = ()=>{
  console.log("用户收藏");
}

// 处理关闭设置对话框
const handleCloseSettings = () => {
  settingsDialogVisible.value = false;
};

// 保存用户设置
const saveUserSettings = (settings: any) => {
  // console.log("保存用户设置", settings);
  // // 这里可以添加保存设置的逻辑
  // ElMessage.success("设置已保存");
  settingsDialogVisible.value = false;
};

// 取消用户设置
const cancelUserSettings = () => {
  settingsDialogVisible.value = false;
};

onMounted(() => {
  init();
});

defineExpose({});
</script>

<style scoped>
.editor-container {
  height: 90vh;
}
</style>
