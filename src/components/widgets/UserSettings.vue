<template>
  <div class="user-settings-container">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          class="settings-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="general">
            <el-icon>
              <Setting />
            </el-icon>
            <span>通用设置</span>
          </el-menu-item>
          <el-menu-item index="menu">
            <el-icon>
              <Menu />
            </el-icon>
            <span>菜单设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <div v-if="activeMenu === 'general'" class="settings-panel">
          <GeneralSettings
            :ctx="ctx"
            @settting-user-settings:saved="emits('setttingUserSettings:saved')"
            @settting-user-settings:cancel="emits('setttingUserSettings:cancel')"
          ></GeneralSettings>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { User, Setting, Menu, Plus } from "@element-plus/icons-vue";
import GeneralSettings from "./settings/GeneralSettings.vue";
import { ElMessage } from "element-plus";
import { AppContext } from "@/services/AppContext";
const props = defineProps({
  ctx: {
    type: Object as () => AppContext,
  },
});

// 当前激活的菜单项
const activeMenu = ref("general");

const emits = defineEmits(["setttingUserSettings:saved", "setttingUserSettings:cancel"]);

// 通用设置
const generalSettings = ref({
  language: "zh-CN",
  theme: "light",
  fontSize: 14,
});

// 处理菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index;
};
</script>

<style scoped>
.user-settings-container {
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.settings-menu {
  height: 100%;
  border-right: solid 1px #e6e6e6;
}

.settings-panel {
  padding: 20px;
}

.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
