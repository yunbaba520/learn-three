<template>
  <div class="app">
    <div class="btns"></div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 高光
const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let model = null;

// 场景
const scene = new THREE.Scene();
// 模型
const loader = new GLTFLoader();
loader.load(
  "../src/model/factory/工厂.gltf",
  function (gltf) {
    console.log("控制台查看加载gltf文件返回的对象结构", gltf);
    model = gltf;
    // console.log('gltf对象场景属性',gltf.scene);
    // 返回的场景对象gltf.scene插入到threejs场景中
    scene.add(gltf.scene);
  },
  function (val) {
    // 加载一部分，就调用函数，可做模型加载进度条
    // console.log(val);
  },
  function (err) {
    console.log(err);
  }
);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight,
  0.1,
  3000
);
camera.position.set(-84, 78, 1.3);
camera.lookAt(0, 0, 0);
// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.decay = 0.0; //光源光照强度不随距离改变衰减

pointLight.position.set(-100, 190, 110);
scene.add(pointLight);
const ambient = new THREE.AmbientLight(0xffffff, 1.6);
scene.add(ambient);
// console.log(pointLight);
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
  // renderer.render(scene, camera); //执行渲染操作
});
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致
cameraControls.maxPolarAngle = Math.PI / 2; // 相机不能进入地下

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
  // 获取canvas元素和绘图上下文
  const canvas = document.createElement("canvas");
  canvas.width = "200";
  canvas.height = "200";
  const ctx = canvas.getContext("2d");
  // 创建一个径向渐变
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, // x坐标，圆心位置
    canvas.height / 2, // y坐标，圆心位置
    0, // 开始圆的半径
    canvas.width / 2, // x坐标，外围圆位置
    canvas.height / 2, // y坐标，外围圆位置
    canvas.width / 2 // 结束圆的半径
  );

  // 添加颜色渐变
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // 白色，完全不透明
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // 白色，完全透明

  // 填充渐变
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.dir(canvas);

  const texture = new THREE.CanvasTexture(canvas);
  const sm = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
  });
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
