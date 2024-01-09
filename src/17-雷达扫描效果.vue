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

let mesh;
const clock = new THREE.Clock();

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
  const geometry = new THREE.CircleGeometry(50);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true, // 启用透明
  });
  mesh = new THREE.Mesh(geometry, material);
  material.onBeforeCompile = function (shader) {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uSpeed = { value: 300 }; // 速度
    shader.uniforms.uRadius = { value: 50 }; // 半径
    shader.uniforms.uFollowWidth = { value: 50 }; // 尾焰宽度

    // 增加顶点位置插值计算代码
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
      varying vec3 vPosition;//顶点位置插值后的坐标
      void main(){
        vPosition = vec3(modelMatrix * vec4( position, 1.0 ));
      `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
      // 接受传值
      uniform float uRadius;     
      uniform float uTime;            
      uniform float uSpeed; 
      uniform float uFollowWidth; 
      varying vec3 vPosition;
      // 获取扫描角度函数（参数：三维向量空间坐标）
      float calcAngle(vec3 oFrag){
        float fragAngle;
        // 定义一个三维向量，x轴方向向量
        const vec3 ox = vec3(1,0,0);
        // 向量运算，将片元的位置向量 oFrag 投影到了 x-z 平面上，然后求投影向量与 ox 向量的点积。点积计算的是两个向量之间的夹角余弦值乘以两个向量的长度，结果是一个标量值。
        float dianji = oFrag.x * ox.x + oFrag.z*ox.z;
        // 片元到中心的长度
        float oFrag_length = length(oFrag); // length是内置函数
        float ox_length = length(ox); // length是内置函数
        // 余弦值
        float yuxian = dianji / (oFrag_length * ox_length);
        // 角度
        fragAngle = acos(yuxian);
        fragAngle = degrees(fragAngle);
        if(oFrag.z > 0.0) {
          fragAngle = -fragAngle + 360.0;
        }
        float scanAngle = uTime * uSpeed - floor(uTime * uSpeed / 360.0) * 360.0;
        float angle = scanAngle - fragAngle;
        if(angle < 0.0){
          angle = angle + 360.0;
        }
        return angle;
      }
      void main() {
      `
    );
    // 跟片元的坐标vPosition控制自身的颜色值。
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
      #include <dithering_fragment>
      // length内置函数，取向量的长度
      if(length(vPosition) == 0.0 || length(vPosition) > uRadius-2.0){
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      } else {
        float angle = calcAngle(vPosition);
        if(angle < uFollowWidth){
          // 尾焰区域
          float opacity =  1.0 - angle / uFollowWidth; 
          gl_FragColor = vec4( outgoingLight, diffuseColor.a * opacity );  
        } else {
          // 其他位置的像素均为透明
          gl_FragColor = vec4( outgoingLight, 0.0 ); 
        }
      }
      `
    );
    console.log(shader.fragmentShader);
    mesh.shader = shader;
  };
  mesh.rotateX(-Math.PI / 2);
  scene.add(mesh);
}
function render() {
  // cameraControls.update();
  renderer.render(scene, camera);

  // 每一次间隔
  const deltaTime = clock.getDelta();
  mesh.shader.uniforms.uTime.value += deltaTime;
  // 一旦y接近模型mesh顶部，重新设置为0，这样扫光反复循环
  // if (mesh.shader.uniforms.y.value > 159) mesh.shader.uniforms.y.value = 0;
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
