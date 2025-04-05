<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 赞助我弹窗控制
const sponsorDialogVisible = ref(false);
</script>

<style scoped>
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