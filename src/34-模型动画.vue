<template>
  <div class="app">
    <div class="btns">
      <button @click="startFn">整体介绍</button>
      <button @click="splitFn">分解介绍</button>
      <button @click="reset">重置</button>
      <button @click="allStart">开始</button>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let scene;
let camera;
let renderer;
let axesHelper;
let model;

let labelRenderer;
// label分租
let labelGroup = new THREE.Group();
let lineGroup = new THREE.Group();
init();
render();
function init() {
  // 场景
  scene = new THREE.Scene();

  // 相机
  camera = new THREE.PerspectiveCamera(
    45,
    canvasWidth / canvasHeight,
    1,
    10000
  );
  camera.position.set(0, 100, 400);
  camera.lookAt(0, 0, 0);
  // 模型
  addModel();
  // const ambient = new THREE.AmbientLight(0xffffff, 10000);
  // scene.add(ambient);
  addLight();

  // 坐标辅助对象
  // axesHelper = new THREE.AxesHelper(200);
  // scene.add(axesHelper);
  // console.log(scene);
  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.shadowMap.enabled = true;

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  document.body.appendChild(labelRenderer.domElement);

  new OrbitControls(camera, labelRenderer.domElement);
}

function addModel() {
  new GLTFLoader().load("../src/model/model1234.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        // //模型阴影
        // child.castShadow = true;
        // 调整金属度
        child.material.metalness = 0.58;
        // //模型自发光
        // child.material.emissive = child.material.color;
        // child.material.emissiveMap = child.material.map;
        const edges = new THREE.EdgesGeometry(child.geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
          color: 0x111111,
        });
        const line = new THREE.LineSegments(edges, edgesMaterial);
        child.add(line);
      }
    });

    model = gltf.scene.children[0];
    // model.add(new THREE.AxesHelper(200));
    console.log(model);
    model.rotateX(-Math.PI / 2);
    model.rotateZ(-Math.PI / 2);
    model.rotateY(Math.PI / 18);
    scene.add(model);
    scene.add(lineGroup);
    scene.add(labelGroup);
  });
}
function addLight() {
  // scene.add(new THREE.HemisphereLight(0xbfefff, 0xffffff, 1));
  scene.add(new THREE.HemisphereLight(0xcccccc, 0xeeeeee, 8));
  // const pointLight = new THREE.PointLight(0xffffff, 3.0);
  // pointLight.decay = 0.0; //光源光照强度不随距离改变衰减
  // pointLight.position.set(500, 500, 500);
  // scene.add(pointLight);
  const ambient = new THREE.AmbientLight(0xffffff, 2.6);
  scene.add(ambient);
  // const light = new THREE.AmbientLight(0xffffff, 1); // 柔和的白光
  // scene.add(light);
  // const light1 = new THREE.PointLight(0xffffff, 2500000);
  // light1.position.set(500, 500, 500);
  // scene.add(light1);
  // const light2 = new THREE.PointLight(0xffffff, 2500000);
  // light2.position.set(-500, 500, -500);
  // scene.add(light2);
  // const light3 = new THREE.PointLight(0xffffff, 1500000);
  // light3.position.set(500, 500, -500);
  // scene.add(light3);
  // const light4 = new THREE.PointLight(0xffffff, 1500000);
  // light4.position.set(-500, 500, 500);
  // scene.add(light4);
}
function render() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  TWEEN.update();

  requestAnimationFrame(render);
}

function startFn() {
  console.log("开始");
  if (!model.rotation) {
    console.warn("model.rotation无值");
    return;
  }
  new TWEEN.Tween(model.rotation)
    .to({ z: (Math.PI / 2) * 3 + Math.PI / 9 }, 2000)
    .start()
    .onComplete((val) => {
      console.log(val);
    }); // 开始动画
  new TWEEN.Tween(model.position)
    .to({ x: -100 }, 2000)
    .start()
    .onComplete(() => {
      addInfoAndLine(
        [
          model.position,
          {
            x: model.position.x + 200,
            y: model.position.y + 100,
            z: model.position.z,
          },
          {
            x: model.position.x + 300,
            y: model.position.y + 100,
            z: model.position.z,
          },
        ],
        `
      <h1>北斗边际服务网关</h1>
      <p>
        北斗边际服务网关支持示范区域内的无线网络覆盖，<br>
        实现北斗智能终端数据的汇聚和交互。北斗边际服<br>
        务网关通过无线网络向系统内所有的北斗智能终端<br>
        播发北斗伪距差分数据，并收集北斗智能终端上报<br>
        的数据信息通过以太网回传指挥中心。  
      </p>
      `
      );
    });
}
function addInfoAndLine(linePoints, text = "介绍信息") {
  const arr = [];
  linePoints.forEach((item) => {
    arr.push(item.x);
    arr.push(item.y);
    arr.push(item.z);
  });
  // line
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(arr), 3)
  );
  const m = new THREE.LineBasicMaterial({ color: 0x666666 });
  const line = new THREE.Line(g, m);

  // info
  const textDiv = document.createElement("div");
  textDiv.className = "label";
  textDiv.innerHTML = text;
  // textDiv.style.backgroundColor = "#00253f";
  textDiv.style.color = "#000";

  const textLabel = new CSS2DObject(textDiv);
  textLabel.position.set(
    linePoints[2].x + 10,
    linePoints[2].y,
    linePoints[2].z
  );
  labelGroup.add(textLabel);
  lineGroup.add(line);
}

function splitFn() {
  const m1 = model.getObjectByName("BDBS盖板2");
  const m2 = model.getObjectByName("JLA250V1A-ZK222滤波器");
  const m3 = model.getObjectByName("BDBS电池");
  const m4 = model.getObjectByName("BDBS盖板");
  const m5 = model.getObjectByName("BDBS内部模块");
  const m6 = model.getObjectByName("PCBA");
  const m7 = model.getObjectByName("BDBS腔体");
  new TWEEN.Tween(m4.position)
    .to({ z: 80 }, 2000)
    .start()
    .onComplete((val) => {
      const wordP = getWorldPosition(m4);
      addInfoAndLine(
        [
          { x: wordP.x, y: wordP.y + 30, z: wordP.z },
          { x: wordP.x + 200, y: wordP.y + 100, z: wordP.z },
          { x: wordP.x + 300, y: wordP.y + 100, z: wordP.z },
        ],
        `
          <h1>顶盖板</h1>
        `
      );
      const wordP2 = getWorldPosition(m7);
      addInfoAndLine(
        [
          { x: wordP2.x, y: wordP2.y, z: wordP2.z },
          { x: wordP2.x + 200, y: wordP2.y, z: wordP2.z },
          { x: wordP2.x + 300, y: wordP2.y, z: wordP2.z },
        ],
        `
          <h1>主体腔体</h1>
        `
      );
    });
  new TWEEN.Tween(m5.position)
    .to({ z: 60 }, 2000)
    .start()
    .onComplete((val) => {
      const wordP = getWorldPosition(m5);
      addInfoAndLine(
        [
          { x: wordP.x - 40, y: wordP.y + 20, z: wordP.z - 70 },
          { x: wordP.x + 200, y: wordP.y + 40, z: wordP.z - 70 },
          { x: wordP.x + 300, y: wordP.y + 40, z: wordP.z - 70 },
        ],
        `
          <h1>数据链</h1>
          <p>
            支持双向通信，有效带宽512kbps;<br>  
            通信距离可覆盖2 Km范围;<br>
            支持自组网;<br>
            最大接入终端数量：100个。<br>
          </p>
        `
      );
    });
  new TWEEN.Tween(m2.position)
    .to({ z: -100 }, 2000)
    .start()
    .onComplete((val) => {
      const wordP = getWorldPosition(m2);
      console.log("滤波器", wordP);

      addInfoAndLine(
        [
          { x: wordP.x + 100, y: wordP.y, z: wordP.z },
          { x: wordP.x + 200, y: wordP.y, z: wordP.z },
          { x: wordP.x + 300, y: wordP.y, z: wordP.z },
        ],
        `
          <h1>滤波器</h1>
        `
      );
    });
  new TWEEN.Tween(m3.position)
    .to({ z: -100 }, 2000)
    .start()
    .onComplete((val) => {
      const wordP = getWorldPosition(m3);
      console.log("开关电源", wordP);

      addInfoAndLine(
        [
          { x: wordP.x + 100, y: wordP.y + 30, z: wordP.z - 60 },
          { x: wordP.x + 200, y: wordP.y + 40, z: wordP.z - 60 },
          { x: wordP.x + 300, y: wordP.y + 40, z: wordP.z - 60 },
        ],
        `
          <h1>开关电源</h1>
        `
      );
    });
  new TWEEN.Tween(m6.position)
    .to({ z: -100 }, 2000)
    .start()
    .onComplete((val) => {
      const wordP = getWorldPosition(m6);
      console.log("主板", wordP);
      addInfoAndLine(
        [
          { x: wordP.x, y: wordP.y, z: wordP.z - 40 },
          { x: wordP.x + 200, y: wordP.y - 50, z: wordP.z - 40 },
          { x: wordP.x + 300, y: wordP.y - 50, z: wordP.z - 40 },
        ],
        `
          <h1>主板</h1>
          <p>
            基于ARM+FPGA架构，软硬件100%自主可控;<br>  
            板载32G EMMC存储器，存储时长大于3个月;<br>
            支持有线通信（以太网、CAN、RS232）;<br>
            支持无线通信（4G、数据链）;<br>
            支持卫星定位通信（北斗定位、短报文）;<br>
            采用自定义物联网协议，确保数据安全可靠。<br>
          </p>
        `
      );
    });
  new TWEEN.Tween(m1.position)
    .to({ z: -150 }, 2000)
    .start()
    .onComplete((val) => {
      const wordP = getWorldPosition(m1);
      addInfoAndLine(
        [
          { x: wordP.x, y: wordP.y - 40, z: wordP.z },
          { x: wordP.x + 200, y: wordP.y - 50, z: wordP.z },
          { x: wordP.x + 300, y: wordP.y - 50, z: wordP.z },
        ],
        `
          <h1>底盖板</h1>
        `
      );
    });
  new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 100, z: 600 }, 2000)
    .onUpdate(function () {
      camera.lookAt(0, 0, 0);
    })
    .start();
}
function reset() {
  labelReset();
  positionReset();
}
function labelReset() {
  console.log("labelReset");
  while (labelGroup.children.length > 0) {
    labelRenderer.domElement.removeChild(labelGroup.children[0].element);
    labelGroup.remove(labelGroup.children[0]);
  }

  while (lineGroup.children.length > 0) {
    lineGroup.remove(lineGroup.children[0]);
  }
}
function positionReset() {
  const m1 = model.getObjectByName("BDBS盖板2");
  const m2 = model.getObjectByName("JLA250V1A-ZK222滤波器");
  const m3 = model.getObjectByName("BDBS电池");
  const m4 = model.getObjectByName("BDBS盖板");
  const m5 = model.getObjectByName("BDBS内部模块");
  const m6 = model.getObjectByName("PCBA");
  const m7 = model.getObjectByName("BDBS腔体");
  new TWEEN.Tween(m1.position).to({ z: 0 }, 1000).start();
  new TWEEN.Tween(m2.position).to({ z: 0 }, 1000).start();
  new TWEEN.Tween(m3.position).to({ z: 0 }, 1000).start();
  new TWEEN.Tween(m4.position).to({ z: 0 }, 1000).start();
  new TWEEN.Tween(m5.position).to({ z: 0 }, 1000).start();
  new TWEEN.Tween(m6.position).to({ z: 0 }, 1000).start();
  new TWEEN.Tween(m7.position).to({ z: 0 }, 1000).start();
}
async function allStart() {
  startFn();
  await sleep(7000);
  labelReset();

  splitFn();
  await sleep(8000);
  reset();
  await sleep(3000);

  new TWEEN.Tween(model.rotation).to({ z: -Math.PI / 2 }, 2000).start();
  new TWEEN.Tween(model.position).to({ x: 0 }, 2000).start();
}
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
// 获取模型的世界坐标
function getWorldPosition(model) {
  // 创建一个三维向量，用于存储结果
  const worldPosition = new THREE.Vector3();

  // 获取世界坐标
  worldPosition.setFromMatrixPosition(model.matrixWorld);

  // 返回世界坐标
  return worldPosition;
}
onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  // background-color: #4a708b;
  background: rgb(230, 235, 240);
  background-image: linear-gradient(white 2px, transparent 0),
    linear-gradient(90deg, rgba(255, 255, 255, 0.86) 2px, transparent 0),
    linear-gradient(hsla(0, 0%, 100%, 0.335) 1px, transparent 0),
    linear-gradient(90deg, hsla(0, 0%, 100%, 0.3) 1px, transparent 0);
  background-size: 75px 75px, 75px 75px, 15px 15px, 15px 15px;

  .btns {
    position: absolute;
    top: 50px;
    left: 50px;
    z-index: 99999;
  }
}
</style>
