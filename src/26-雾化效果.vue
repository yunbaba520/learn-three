<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// 场景
const scene = new THREE.Scene();
// 模型
for (let i = 0; i < 3; i++) {
  const geometry = new THREE.BoxGeometry(40, 40, 40);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(i * 70, 0, 0);
  scene.add(mesh);
}
// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight,
  0.1,
  3000
);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

// 坐标辅助对象
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);

// 动画渲染循环
function animate() {
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
animate();
// 相机轨道控制器
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致
cameraControls.maxPolarAngle = Math.PI / 2; // 相机不能进入地下

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  .canvas-wrap {
  }
  .btns {
    position: absolute;
    top: 0;
    left: 50%;
  }
}
</style>
