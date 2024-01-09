<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const canvesRef = ref(null);
const canvasWidth = 800;
const canvasHeight = 600;
// 场景
const scene = new THREE.Scene();
// 长方体模型
const geometry = new THREE.BoxGeometry(100, 100, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);

scene.add(mesh);
console.log(mesh);
// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight,
  0.1,
  3000
);
camera.position.set(200, 200, 200);
// camera.lookAt(mesh.position);
// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.decay = 0.0; //光源光照强度不随距离改变衰减

pointLight.position.set(220, 110, 110);
scene.add(pointLight);
console.log(pointLight);
// 坐标辅助对象
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);
// 渲染帧率
const stats = new Stats();
document.body.appendChild(stats.domElement);
// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
// 动画渲染循环
function animate() {
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
// 相机轨道控制器
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener("change", function () {
  renderer.render(scene, camera); //执行渲染操作
});

// 可视化控制器
const gui = new GUI();
const positionFolder = gui.addFolder("位置");
const lightFolder = gui.addFolder("点光源");
positionFolder
  .add(mesh.position, "x", -200, 200)
  .name("x轴")
  .onChange((value) => {
    mesh.position.x = value;
  });
positionFolder
  .add(mesh.position, "y", -200, 200)
  .name("y轴")
  .onChange((value) => {
    mesh.position.y = value;
  });
positionFolder
  .add(mesh.position, "z", -200, 200)
  .name("z轴")
  .onChange((value) => {
    mesh.position.z = value;
  });
lightFolder
  .add(pointLight.position, "x", -200, 200)
  .name("x轴")
  .onChange((value) => {
    pointLight.position.x = value;
  });
lightFolder
  .add(pointLight.position, "y", -200, 200)
  .name("y轴")
  .onChange((value) => {
    pointLight.position.y = value;
  });
lightFolder
  .add(pointLight.position, "z", -200, 200)
  .name("z轴")
  .onChange((value) => {
    pointLight.position.z = value;
  });
lightFolder
  .addColor(pointLight, "color")
  .name("颜色")
  .onChange((value) => {
    console.log(value);
  });
onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
.app {
  .canvas-wrap {
  }
}
</style>
