<template>
  <div class="toolbar-settings">
    <h2>工具类设置</h2>

    <div class="settings-section">
      <h3>顶部工具栏</h3>
      <el-checkbox-group v-model="topToolbars">
        <el-checkbox v-for="item in availableTools" :key="item.value" :label="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="settings-section">
      <h3>悬浮菜单栏</h3>
      <el-checkbox-group v-model="floatToolbars">
        <el-checkbox v-for="item in availableTools" :key="item.value" :label="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="button-group">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="success" @click="cancel">取消</el-button>
    </div>
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

// 工具栏设置
const topToolbars = ref<string[]>([]);
const floatToolbars = ref<string[]>([]);

// 可用的工具选项
const availableTools = ref([
  { label: "加粗", value: "bold" },
  { label: "斜体", value: "italic" },
  { label: "下划线", value: "underline" },
  { label: "删除线", value: "strikethrough" },
  { label: "标题", value: "heading" },
  { label: "链接", value: "link" },
  { label: "图片", value: "image" },
  { label: "代码块", value: "codeblock" },
  { label: "引用", value: "quote" },
  { label: "列表", value: "list" },
  { label: "表格", value: "table" },
]);

const emits = defineEmits(["setttingUserSettings:saved", "setttingUserSettings:cancel"]);

const save = () => {
  // 保存用户设置
  const userSettings = props.ctx?.userSettings;
  if (userSettings) {
    userSettings.updateSettings({
      toolbars: {
        toolbar: topToolbars.value,
        bubble: floatToolbars.value,
      },
    });

    ElMessage.success("工具栏设置已保存");
    emits("setttingUserSettings:saved");
  } else {
    ElMessage.error("无法保存设置，请检查上下文！");
  }
};

const cancel = () => {
  // 取消设置
  emits("setttingUserSettings:cancel");
};

onMounted(() => {
  nextTick(() => {
    // 获取用户设置的默认值
    const settings = props.ctx?.userSettings.getSettings();

    // 顶部工具栏设置
    topToolbars.value =
      settings?.toolbars?.toolbar || defaultUserSettings.toolbars.toolbar;

    // 悬浮工具栏设置
    floatToolbars.value =
      settings?.toolbars?.bubble || defaultUserSettings.toolbars.bubble;
  });
});
</script>

<style scoped>
.toolbar-settings {
  padding: 16px;
}

.settings-section {
  margin-bottom: 24px;
}

.settings-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #606266;
}

.button-group {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
