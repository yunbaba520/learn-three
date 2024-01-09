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
let scene;
let camera;
let renderer;
let axesHelper;
let cameraControls;
// 三维样条曲线
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-50, 20, 90),
  new THREE.Vector3(-10, 40, 40),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(60, -60, 0),
  new THREE.Vector3(90, -40, 60),
  new THREE.Vector3(120, 30, 30),
]);
// 从曲线上等间距获取一定数量点坐标
const pointsArr = path.getSpacedPoints(500);
// 场景
scene = new THREE.Scene();
// 模型
renderMesh();
// 相机
camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 3000);
camera.position.set(0, 0, 600);
camera.lookAt(0, 0, 0);

// 坐标辅助对象
axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 渲染器
renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);

// 动画渲染循环
let i = 0; //在渲染循环中累加变化
function animate() {
  if (i < pointsArr.length - 1) {
    // 相机位置设置在当前点位置
    camera.position.copy(pointsArr[i]);
    // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
    // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
    camera.lookAt(pointsArr[i + 1]);
    i += 1; //调节速度
  } else {
    // i = 0;
  }
  renderer.render(scene, camera);
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

function renderMesh() {
  // 样条曲线path作为TubeGeometry参数生成管道
  const geometry = new THREE.TubeGeometry(path, 200, 5, 30);
  const texLoader = new THREE.TextureLoader();
  //纹理贴图
  const texture = texLoader.load("../src/assets/img/icon.png");
  // console.log(texture);
  //UV坐标U方向阵列模式
  texture.wrapS = THREE.RepeatWrapping;
  //纹理沿着管道方向阵列(UV坐标U方向)
  texture.repeat.x = 10;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide, //双面显示看到管道内壁
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}
</script>

<style lang="scss" scoped>
.app {
  position: relative;
}
</style>
