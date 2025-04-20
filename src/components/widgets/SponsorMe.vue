<template>
  <div class="sponsor-content">
    <p>{{ $t("preview.sponsor.tip1") }} ☕️</p>
    <p>{{ $t("preview.sponsor.tip2") }}️</p>
    <p>{{ $t("preview.sponsor.tip3") }}️</p>
    <div class="qr-placeholder">
      <div class="img-container">
        <img src="../../assets/wx.jpg" alt="" />
      </div>
      <div class="img-container">
        <img src="../../assets/zfb.jpg" alt="" />
      </div>
    </div>
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
  gap: 30px;
}

.img-container {
  overflow: hidden;
  width: 175px;
  height: 185px;
  transition: all 0.3s ease;
}

.img-container:hover {
  transform: scale(1.2);
  z-index: 10;
}

.qr-placeholder img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.qr-placeholder img:hover {
  transform: scale(1.5);
}

/* 删除这个选择器，因为我们现在使用gap属性来控制间距 */
/* .qr-placeholder img:first-child {
  margin-right: 30px;
} */

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
