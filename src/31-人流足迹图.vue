<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { PathPointList, PathGeometry } from "three.path";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

let scene;
let camera;
let renderer;
let axesHelper;
let cameraControls;
let model;

// 场景
scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
// 渲染器
renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(3, 10, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);
// 平面
const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshPhongMaterial({ color: 0x00ff00, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.position.set(5, 0, 5);
mesh.receiveShadow = true;
const m1 = mesh.clone();
m1.position.set(15, 0, 5);
const m2 = mesh.clone();
m2.position.set(15, 0, 15);
const m3 = mesh.clone();
m3.position.set(25, 0, 5);
const m4 = mesh.clone();
m4.position.set(15, 0, -5);
scene.add(mesh);
scene.add(m1);
scene.add(m2);
scene.add(m3);
scene.add(m4);
// 线
const p1 = [
  new THREE.Vector3(0, 1, 8),
  new THREE.Vector3(8, 1, 8),
  new THREE.Vector3(12, 1, 12),
  new THREE.Vector3(12, 1, 20),
];
// 生成一条不闭合曲线
const pathCurve = new THREE.CatmullRomCurve3(p1, false, "catmullrom", 0);
const texture = new THREE.TextureLoader().load("../src/assets/img/arrow1.png");
texture.wrapS = THREE.RepeatWrapping;
// 向异性
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
// 创建一个合适的材质
const material = new THREE.MeshPhongMaterial({
  map: texture,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// 确定一个向上的向量
const up = new THREE.Vector3(0, 1, 0);
const pathPoints = new PathPointList();
pathPoints.set(pathCurve.getPoints(1000), 0.5, 2, up, false);
// 创建路径几何体
const geometry = new PathGeometry();

// 更新几何体的属性
geometry.update(pathPoints, {
  width: 2,
  arrow: false,
});

// 创建路径的网格模型
const pathToShow = new THREE.Mesh(geometry, material);

// 添加到场景
scene.add(pathToShow);

// model
const loader = new GLTFLoader();
loader.load("../src/model/Xbot.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
  animate();
});

// 相机
camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 3000);
camera.position.set(0, 30, 30);
camera.lookAt(0, 0, 0);

// 坐标辅助对象
axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  texture.offset.x -= 0.002;
}
// 相机轨道控制器
cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
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
