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
  const geometry = new THREE.BoxGeometry(50, 160, 50);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
  });
  mesh = new THREE.Mesh(geometry, material);

  material.onBeforeCompile = function (shader) {
    // 给着色器变量y传值
    shader.uniforms.y = { value: 50 };
    // 增加顶点位置插值计算代码
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
      varying vec3 vPosition;//顶点位置插值后的坐标
      void main(){
        vPosition = vec3(modelMatrix * vec4( position, 1.0 ));
        // vPosition = position;//不考虑模型旋转缩放平移变换(modelMatrix) 相对模型自身
      `
    );
    // 片元着色器增加varying vec3 vPosition;,获取顶点位置插值之后的坐标值vPosition。
    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
      varying vec3 vPosition;
      uniform float y; //变化的y控制光带高度
      float w = 10.0;//光带宽度一半
      void main() {
      `
    );
    // 跟片元的坐标vPosition控制自身的颜色值。
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
      #include <dithering_fragment>
      if(vPosition.y > y && vPosition.y < y + w ){
        float per = (vPosition.y-y)/w;//范围0~1
        // 渐变色
        gl_FragColor.rgb = mix( vec3(1.0,1.0,0.0),gl_FragColor.rgb, per);
      }
      if(vPosition.y <= y && vPosition.y > y - w ){
        float per = (y-vPosition.y)/w;//范围0~1
        gl_FragColor.rgb = mix( vec3(1.0,1.0,0.0),gl_FragColor.rgb, per);
      }
      `
    );
    console.log(shader.fragmentShader);
    // 函数外访问shader.uniforms属性
    mesh.shader = shader;
  };
  mesh.position.set(0, 80, 0);
  // 进行形变测试，相对的是坐标系
  // mesh.position.y = 50;
  // mesh.rotateZ(Math.PI / 6);
  scene.add(mesh);
}
function render() {
  // cameraControls.update();
  renderer.render(scene, camera);

  // 每一次间隔
  const deltaTime = clock.getDelta();
  mesh.shader.uniforms.y.value += 30 * deltaTime;
  // 一旦y接近模型mesh顶部，重新设置为0，这样扫光反复循环
  if (mesh.shader.uniforms.y.value > 159) mesh.shader.uniforms.y.value = 0;
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
