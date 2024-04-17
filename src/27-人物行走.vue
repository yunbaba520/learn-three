<template>
  <div class="app">
    <div class="btns">
      <button @click="btnClick('idle')">站立</button>
      <button @click="btnClick('walk')">走</button>
      <button @click="btnClick('run')">跑</button>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
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
let mixer;
const baseActions = {
  idle: { weight: 1 },
  walk: { weight: 0 },
  run: { weight: 0 },
};
let currentAction;
// 场景
scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);
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
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);
// model
const loader = new GLTFLoader();
loader.load("../src/model/Xbot.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
  // 所有动画 [AnimationClip]
  const animations = gltf.animations;
  console.log(animations);
  //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
  mixer = new THREE.AnimationMixer(model);
  for (const item of animations) {
    //执行播放器AnimationMixer的.clipAction()方法返回一个AnimationAction对象,AnimationAction对象用来控制如何播放，比如.play()方法。

    const name = item.name;

    if (baseActions[name]) {
      const action = mixer.clipAction(item);
      baseActions[name].action = action;
    }
  }
  console.log(baseActions);
  animate();
});

// 相机
camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 3000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// 坐标辅助对象
axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 渲染器
renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
let clock = new THREE.Clock();

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  const frameT = clock.getDelta();
  // 更新播放器相关的时间
  mixer.update(frameT);
}
// 相机轨道控制器
cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});

function btnClick(item) {
  if (currentAction) {
    currentAction.stop();
  }
  baseActions[item].action.play();
  currentAction = baseActions[item].action;
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
