<template>
  <div class="app">
    <div class="btns">
      <button @click="btnStart">开始移动</button>
      <button @click="btnStop">暂停</button>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "@tweenjs/tween.js";

const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const isPlay = ref(false);
let stopPoint = new THREE.Vector3(0, 40, 300);

let scene;
let camera;
let renderer;
let axesHelper;
let cameraControls;
// 相机路线
const points = [
  new THREE.Vector3(0, 40, 300),
  new THREE.Vector3(50, 40, 300),
  new THREE.Vector3(50, 40, 50),
  new THREE.Vector3(150, 40, 50),
  new THREE.Vector3(150, 40, 0),
];
// 路径曲线
const pathPoints = [
  new THREE.Vector3(0, 0, 300),
  new THREE.Vector3(50, 0, 300),
  new THREE.Vector3(50, 0, 50),
  new THREE.Vector3(150, 0, 50),
  new THREE.Vector3(150, 0, 0),
];
// 三维样条曲线
const path = new THREE.CatmullRomCurve3(points);
// 从曲线上等间距获取一定数量点坐标,点越多，相机运动越慢
const pointsArr = path.getSpacedPoints(2500);
// 场景
scene = new THREE.Scene();
// 模型
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const geometry = new THREE.BoxGeometry(40, 80, 40);
    const material = new THREE.MeshBasicMaterial({
      color: getRandomColor(),
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i * 100, 40, j * 100);
    scene.add(mesh);
  }
}
renderPath();
// 相机
camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 3000);
camera.position.set(400, 400, 400);
camera.lookAt(0, 0, 0);

// 坐标辅助对象
axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 渲染器
renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);

// 动画渲染循环
let i = 0;
function animate() {
  if (isPlay.value && i < pointsArr.length - 1) {
    // 相机位置设置在当前点位置
    camera.position.copy(pointsArr[i]);
    // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
    // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
    camera.lookAt(pointsArr[i + 1]);
    i += 1; //调节速度
  }
  if (i === pointsArr.length - 1) {
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
  TWEEN.update();

  requestAnimationFrame(animate);
}
animate();
// 相机轨道控制器
cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致
cameraControls.maxPolarAngle = Math.PI / 2; // 相机不能进入地下

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
// 随机色16进制
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// 开始
function btnStart() {
  console.log("开始");
  // 相机动画
  new TWEEN.Tween(camera.position)
    .to(stopPoint, 2000)
    .onUpdate(function () {
      // camera.lookAt(0, 0, 0);
      camera.lookAt(stopPoint.x, stopPoint.y, stopPoint.z);
    })
    .onComplete(function () {
      isPlay.value = true;
    })
    .start();
}
function btnStop() {
  stopPoint = camera.position.clone();
  isPlay.value = false;
}
function renderPath() {
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);

  const line = new THREE.Line(geometry, material);

  scene.add(line);
}
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  .btns {
    position: absolute;
    top: 20px;
    left: 50px;
  }
}
</style>
