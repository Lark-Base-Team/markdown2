<template>
  <!-- <el-text>{{ selectValue }}</el-text> -->
  <!-- <el-text>{{ selectCellValue }}</el-text> -->
  <div class="md-render-container">
    <el-row class="md-render-row preview-row">
      <el-col :span="24" class="preview-area">
        <div class="markdown-preview" v-html="renderedHtml"></div>
      </el-col>
    </el-row>

    <!-- 新增操作栏 -->
    <el-row class="action-row">
      <el-col :span="24" class="action-area">
        <el-button
          type="primary"
          size="small"
          @click="saveToTable"
          :disabled="!canSave"
        >
          保存到多维表格
        </el-button>
        <el-tag v-if="saveStatus" :type="saveStatus.type" size="small">{{
          saveStatus.message
        }}</el-tag>
        <el-button
          type="primary"
          class="sponsor-button"
          @click="sponsorDialogVisible = true"
        >
          <el-icon class="heart-icon" style="margin-right: 4px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
              />
            </svg>
          </el-icon>
          <span style="color: #020"> {{ $t("preview.sponsor.me") }} </span>
        </el-button>
      </el-col>
    </el-row>

    <el-row class="md-render-row input-row">
      <el-col :span="24" class="input-area">
        <el-input
          type="textarea"
          v-model="markdownText"
          placeholder="请输入 Markdown 文本..."
          class="markdown-textarea"
        />
      </el-col>
    </el-row>
  </div>
  <el-dialog v-model="sponsorDialogVisible" title="💗赞助我" width="95%">
    <div class="sponsor-content">
      <p>{{ $t("preview.sponsor.tip1") }} ☕️</p>
      <p>{{ $t("preview.sponsor.tip2") }}️</p>
      <p>{{ $t("preview.sponsor.tip3") }}️</p>
      <div class="qr-placeholder">
        <img src="../assets/wx.jpg" alt="" />
        <img src="../assets/zfb.jpg" alt="" />
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import {
  bitable,
  Selection,
  IWidgetTable,
  IFieldMeta,
  FieldType,
  IWidgetField,
} from "@base-open/web-api";
import { ref, onMounted, computed } from "vue";
const selectValue = ref({
  baseId: "",
  tableId: "",
  viewId: "",
  fieldId: "",
  recordId: "",
});
import { mdEngine } from "@/services/MarkDownEngine";
import "highlight.js/styles/github.css";
// 赞助我弹窗控制
const sponsorDialogVisible = ref(false);
// 定义 Markdown 文本和渲染后的 HTML
const markdownText = ref("");
const originalText = ref(""); // 用于存储原始文本，以便比较是否有修改

// 计算属性：将 Markdown 转换为 HTML
const renderedHtml = computed(() => {
  return mdEngine.render(markdownText.value);
});

// 判断是否可以保存（有选中单元格且内容有修改）
const canSave = computed(() => {
  return (
    selectValue.value.tableId &&
    selectValue.value.recordId &&
    selectValue.value.fieldId &&
    markdownText.value !== originalText.value
  );
});

// 保存状态提示
const saveStatus = ref<{ type: string; message: string } | null>(null);

// 保存到多维表格的方法
const saveToTable = async () => {
  if (!canSave.value) return;

  try {
    saveStatus.value = { type: "info", message: "保存中..." };

    const table = await bitable.base.getTableById(selectValue.value.tableId);
    await table.setCellValue(
      selectValue.value.fieldId,
      selectValue.value.recordId,
      markdownText.value
    );

    originalText.value = markdownText.value; // 更新原始文本
    saveStatus.value = { type: "success", message: "保存成功" };

    // 3秒后清除状态提示
    setTimeout(() => {
      saveStatus.value = null;
    }, 3000);
  } catch (error) {
    console.error("保存失败:", error);
    saveStatus.value = { type: "danger", message: "保存失败" };
  }
};

// 组件挂载时的初始化逻辑
// onMounted(() => {
//   console.log("Markdown 渲染器已加载");
// });
const counter = ref(0);
const selectCellValue = ref("");
const selectChange = (select: any) => {
  bitable.base.getTableById(select.tableId).then((table: IWidgetTable) => {
    table.getFieldMetaById(select.fieldId).then((m: IFieldMeta) => {
      // console.log(m);
      if (m.type == FieldType.Text) {
        // console.log("选中的的是文本字段", m);
        table.getFieldById(select.fieldId).then((field: IWidgetField) => {
          field.getCellString(select.recordId).then((v: string) => {
            // selectCellValue.value = v;
            markdownText.value = v;
            originalText.value = v; // 存储原始文本
            saveStatus.value = null; // 清除之前的保存状态
            // table.setCellValue(
            //   select.fieldId,
            //   select.recordId,
            //   v + counter.value++
            // );
          });
        });
      }
    });
  });
};
const initListener = async () => {
  try {
    bitable.base.onSelectionChange((e) => {
      selectValue.value = e.data;
      selectChange(selectValue.value);
    });
  } catch (error) {
    console.error("初始化监听时出错:", error);
  }
};
onMounted(() => {
  initListener();
});
</script>
<style scoped>
.md-render-container {
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.md-render-row {
  margin-bottom: 0;
  flex: 1;
  height: 45%; /* 调整高度以适应新增的操作栏 */
}

/* 新增操作栏样式 */
.action-row {
  padding: 8px 10px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
}

.action-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-row,
.input-row {
  display: flex;
  overflow: hidden;
}

.input-area,
.preview-area {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: auto;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  font-family: "Courier New", Courier, monospace;
}

/* 确保textarea填满整个区域 */
:deep(.el-textarea) {
  height: 100%;
}

:deep(.el-textarea__inner) {
  height: 100% !important;
  resize: none;
}

.markdown-preview {
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  height: calc(100% - 32px);
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

.sponsor-content {
  text-align: center;
}

.sponsor-content p {
  margin-bottom: 1rem;
}

.qr-placeholder {
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.qr-placeholder img {
  width: 175px;
  height: 185px;
}

.qr-placeholder img:first-child {
  margin-right: 30px;
}
.sponsor-button {
  width: 90px;
  margin-right: -5px;
  color: #ec5f59 !important;
  transition: transform 0.2s ease;
  background: linear-gradient(to right, #ffd75e, #ffcd38) !important;
  border-color: #f8d76e !important;
}

.sponsor-button:hover {
  transform: scale(1.1);
  background: linear-gradient(to right, #ffd75e, #ffcd38) !important;
  border-color: #f8d76e !important;
}
</style>
