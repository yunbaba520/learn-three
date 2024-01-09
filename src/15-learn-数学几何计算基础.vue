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
  camera.position.set(400, 400, 400);
  camera.lookAt(0, 0, 0);
  // 模型
  addModel();
  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
}

function addModel() {
  // MathUtils类度和弧度转换方法
  // 弧度转度
  // const angle = THREE.MathUtils.radToDeg(Math.PI);
  // console.log("Math.PI转度", angle);
  // 度转弧度
  // const angle = THREE.MathUtils.degToRad(30);
  // console.log("度转弧度", angle);
  // ---------------------------------------------------------------------------------------------------
  // 三角函数计算
  // const R = 100; //半径长度
  // const angle = Math.PI / 6; //30度
  // const x = R * Math.cos(angle);
  // const y = R * Math.sin(angle);
  // const geometry = new THREE.SphereGeometry(3);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  // const mesh = new THREE.Mesh(geometry, material);
  // mesh.position.set(x, y, 0);
  // scene.add(mesh);
  // ---------------------------------------------------------------------------------------------------
  // 相机沿着视线方向移动
  // const dir = new THREE.Vector3();
  // // 获取相机的视线方向
  // camera.getWorldDirection(dir);
  // console.log("相机方向", dir);
  // console.log("单位向量", dir.length());
  // // dis向量表示相机沿着相机视线方向平移200的位移量
  // const dis = dir.clone().multiplyScalar(200);
  // // 相机沿着视线方向平移
  // console.log(dis);
  // camera.position.add(dis);
  // ---------------------------------------------------------------------------------------------------
  // 着色器
  const geometry = new THREE.PlaneGeometry(100, 50);
  const vertexShader = `
    // 写顶点着色器的代码 投影矩阵projectionMatrix 视图矩阵 modelMatrix 模型矩阵viewMatrix 顶点位置 position
    // attribute vec3 color;//ShaderMaterial默认提供不用手写
    // varying vec3 vColor;// varying关键字声明一个变量表示顶点颜色插值后的结果
    void main(){
      // 顶点颜色插值计算
      // vColor = color
      gl_Position = projectionMatrix*modelViewMatrix*vec4( position, 1.0 );
    }
  `;
  const fragmentShader = `
    uniform float opacity;
    uniform vec3 color;
    // varying vec3 vColor;// 顶点片元化后有多少个片元,顶点颜色插值后就有多少个颜色数据
    void main() {
      // RGB 透明度
      gl_FragColor = vec4(color,opacity);
      // 根据片元屏幕坐标设置颜色（相对canvas画布，右上角最大，左下角0x0）,注意浮点类型
      // if(gl_FragCoord.x < 900.0) {
      //   gl_FragColor = vec4(color,opacity);
      // }else {
      //   gl_FragColor = vec4(1.0,0.0,0.0,opacity);
      // }

      // if(gl_FragCoord.x < 900.0){
      //   // 符合条件片元保留，并设置颜色
      //   gl_FragColor = vec4(1.0,0.0,0.0,1.0);
      // }else {
      //   discard;//不符合条件片元直接舍弃掉
      // }
      
      // 使用顶点颜色渲染
      // gl_FragColor = vec4(vColor,1.0);
    }
  `;
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader, // 顶点着色器
    fragmentShader: fragmentShader, // 片元着色器
    side: THREE.DoubleSide, //双面显示
    // 传值
    uniforms: {
      opacity: { value: 0.3 },
      color: { value: new THREE.Color(0x00ff00) },
    },
    //允许设置使用顶点颜色渲染
    // vertexColors: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function render() {
  // cameraControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
}
</style>
