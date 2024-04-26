<template>
  <div class="app">
    <div class="btns">
      <button @click="btnClick">加一人</button>
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
//
let moveVector;
let endPoint;
// 场景
scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

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
const p1_g = new THREE.BufferGeometry().setFromPoints(
  new THREE.CatmullRomCurve3(p1).getSpacedPoints(5500)
);
const p1_m = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Create the final object to add to the scene
const p1_p = new THREE.Line(p1_g, p1_m);
scene.add(p1_p);
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
  currentAction = baseActions.idle.action;
  currentAction.play();
  animate();
});

// 相机
camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 3000);
camera.position.set(0, 30, 30);
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
  if (moveVector) {
    // 计算这一帧应该移动的距离
    const distanceToMove = moveVector.clone().multiplyScalar(0.1 * frameT);
    model.position.add(distanceToMove);
    if (model.position.distanceTo(endPoint) < 0.2) {
      model.position.copy(endPoint); // 到达目标点，直接将位置设置为目标点
      // 这里可以添加到达目标点后的逻辑，比如停止动画或开始新的动画
      moveVector = null;
      currentAction.stop();
      currentAction = baseActions.idle.action;
      currentAction.play();
    }
  }
}
// 相机轨道控制器
cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
  setInterval(() => {
    moniWS();
  }, 1000);
});

function btnClick() {
  //目标点位
  endPoint = new THREE.Vector3(
    Math.floor(Math.random() * 11),
    0,
    Math.floor(Math.random() * 11)
  ); // 目标点坐标
  const startPoint = model.position;
  console.log(startPoint, endPoint);
  // 向量
  moveVector = new THREE.Vector3().subVectors(endPoint, startPoint);
  // 距离
  console.log(startPoint.distanceTo(endPoint));
  // 面向目标的
  model.lookAt(endPoint);
  if (currentAction) {
    currentAction.stop();
  }
  if (startPoint.distanceTo(endPoint) < 8) {
    baseActions.walk.action.play();
    currentAction = baseActions.walk.action;
  } else {
    baseActions.run.action.play();
    currentAction = baseActions.run.action;
  }
}

// 模拟ws推送
const currentPeople = [];
function moniWS() {
  if (currentPeople.length) {
    // 出，进，移
    switch (Math.floor(Math.random() * 3)) {
      // 出
      case 0:
        break;
      // 进
      case 1:
        break;
      // 移
      case 2:
        break;
      default:
        break;
    }
  } else {
    // 进
    currentPeople.push(1);
  }
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
