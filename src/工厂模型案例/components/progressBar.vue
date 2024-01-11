<template>
  <div class="progress-bar-wrap" v-if="isShow">
    <div class="line">
      <div class="progress-bar">
        <div class="bar" :style="{ width: modelValue * 300 + 'px' }"></div>
      </div>
      <div class="text">{{ Math.floor(modelValue * 100) + "%" }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
const isShow = ref(false);

watch(
  () => props.modelValue,
  (newV, oldV) => {
    console.log(newV, oldV);
    if (newV === 1) {
      setTimeout(() => {
        isShow.value = false;
      }, 1000);
    } else {
      isShow.value = true;
    }
  }
);
</script>

<style lang="scss" scoped>
.progress-bar-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #a4d3ee, #b2dfee);
  .line {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    .progress-bar {
      width: 300px;
      height: 20px;
      background-color: #009999;
      border-radius: 10px;
      overflow: hidden;
      .bar {
        width: 100px;
        height: 100%;
        background-color: #00ffff;
        border-radius: 10px;
      }
    }
    .text {
      color: #fff;
    }
  }
}
</style>
