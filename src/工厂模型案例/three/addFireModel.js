import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function initFireModel(scene) {
  new GLTFLoader().load(
    "../src/model/fire_extinguisher/scene.gltf",
    function (gltf) {
      // console.log(gltf);
      const model1 = gltf.scene;
      const model2 = model1.clone();
      const model3 = model1.clone();
      const model4 = model1.clone();
      scene.add(model1);
      scene.add(model2);
      scene.add(model3);
      scene.add(model4);
      model1.position.set(-6, 1, 14);
      model2.position.set(24, 1, -20);
      model3.position.set(-10, 1, -70);
      model4.position.set(-24, 1, 68);
    },
    function (val) {
      // 加载一部分，就调用函数，可做模型加载进度条
      // console.log("进度", val);
      // progress.value = val.loaded / val.total;
    },
    function (err) {
      console.log(err);
    }
  );
}
