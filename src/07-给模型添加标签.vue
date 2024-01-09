<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

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

// 1.使用矩形平面实现标签
const planeGeometry = new THREE.PlaneGeometry(40, 20);
const texLoader = new THREE.TextureLoader();
const tex = texLoader.load("../src/assets/img/icon.png");
const planeMaterial = new THREE.MeshBasicMaterial({
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: tex, //map表示材质的颜色贴图属性
  side: THREE.DoubleSide,
});
const meshP = new THREE.Mesh(planeGeometry, planeMaterial);
meshP.position.set(0, 60, 0);
scene.add(meshP);
// 2.使用精灵图
const spriteMaterial = new THREE.SpriteMaterial({
  color: 0x00ff00, //设置颜色
  map: tex,
});
const sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(70, 60, 0);
sprite.scale.set(40, 20, 1);
scene.add(sprite);

// 3.CSS2DObject
const textDiv = document.createElement("div");
textDiv.className = "label";
textDiv.textContent = "Earth";
textDiv.style.backgroundColor = "transparent";
textDiv.style.color = "#fff";

const textLabel = new CSS2DObject(textDiv);
textLabel.position.set(140, 60, 0);
scene.add(textLabel);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
console.log(labelRenderer.domElement);
document.body.appendChild(labelRenderer.domElement);

// 动画渲染循环
function animate() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  requestAnimationFrame(animate);
}
animate();
// 相机轨道控制器
const cameraControls = new OrbitControls(camera, labelRenderer.domElement);
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
