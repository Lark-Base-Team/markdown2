<template>
  <div>
    <h2>通用设置</h2>
    <el-form label-width="120px">
      <el-form-item label="编辑器初始化">
        <el-radio-group v-model="selectedOption">
          <el-radio value="editOnly">编辑</el-radio>
          <el-radio value="previewOnly">预览</el-radio>
          <el-radio value="edit&preview">编辑+预览</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="save">保存</el-button>
    <el-button type="success" @click="cancel">取消</el-button>
    <el-tooltip class="item" effect="dark" content="初始化所有配置" placement="top-end">
      <el-button type="danger" @click="reset">重置</el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { AppContext } from "@/services/AppContext";
import { defaultUserSettings } from "@/services/UserSettingsServices";
const props = defineProps({
  ctx: {
    type: Object as () => AppContext,
  },
});
const selectedOption = ref("");
const emits = defineEmits(["setttingUserSettings:saved", "setttingUserSettings:cancel"]);
const options = [
  { label: "编辑", value: "editOnly" },
  { label: "预览", value: "previewOnly" },
  { label: "编辑+预览", value: "edit&preview" },
];
const save = () => {
  // 保存用户设置
  const userSettings = props.ctx?.userSettings;
  if (userSettings) {
    userSettings.updateSettings({
      editor: {
        defaultModel: selectedOption.value,
      },
    });
    console.log("重设编辑器模式:", selectedOption.value);
    if (selectedOption.value === "previewOnly") {
      props.ctx?.currentEditor.previewer.previewOnly();
    } else {
      props.ctx?.currentEditor.switchModel(selectedOption.value, true);
    }
    emits("setttingUserSettings:saved");
  } else {
    ElMessage.error("无法保存设置，请检查上下文！");
  }
};
const reset = () => {
  // 重置设置
  const userSettings = props.ctx.userSettings;
  userSettings.updateSettings(defaultUserSettings);
  if (userSettings) {
    selectedOption.value = "editOnly";
    console.log("重置编辑器模式为默认值");
  } else {
    ElMessage.error("无法重置设置，请检查上下文！");
  }
};
const cancel = () => {
  // 取消设置
  emits("setttingUserSettings:cancel");
};
onMounted(() => {
  nextTick(() => {
    // 这里可以获取用户设置的默认值
    const defaultModel =
      props.ctx?.userSettings.getSettings().editor.defaultModel || "editOnly";
    selectedOption.value = defaultModel;
  });
});

// const editorSetting =
</script>

<style scoped></style>
