<template>
  <div id="info-box" class="info-box" ref="infoBoxRef" v-show="isShow">
    <div class="colse" @click="close"></div>
    <div class="content">
      <div class="row1">
        <span class="name">设备A</span>
        <span class="status">异常</span>
      </div>
      <div class="num">958691L</div>
      <div class="row">
        <span class="label">管理</span>
        <span class="value">小孔</span>
      </div>
      <div class="row">
        <span class="label">工号</span>
        <span class="value">123456</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const emits = defineEmits(["close"]);

const isShow = ref(false);
const infoBoxRef = ref();
function openBox() {
  isShow.value = true;
}
function getDom() {
  return infoBoxRef.value;
}
function close() {
  isShow.value = false;
  emits("close");
}

defineExpose({
  openBox,
  getDom,
});
</script>

<style lang="scss" scoped>
.info-box {
  position: absolute;
  top: -115px;
  // top: 50px;
  // left: 50px;
  width: 230px;
  height: 185px;
  background: url("../assets/img/信息背景.png");
  background-size: 100% 100%;
  z-index: 99;
  .colse {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: url("../assets/img/关闭.png");
    background-size: 100% 100%;
    cursor: pointer;
    pointer-events: auto; //解决不能点击
  }
  .content {
    width: 100%;
    box-sizing: border-box;
    padding: 20px 30px;
    .row1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        color: #fff;
      }
      .status {
        width: 50px;
        color: #f00;
        font-size: 12px;
      }
    }
    .num {
      margin: 18px 0 10px 50px;
      color: #0ff;
      font-size: 22px;
    }
    .row {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .label {
        color: #999;
        margin-right: 20px;
        font-size: 12px;
      }
      .value {
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>
