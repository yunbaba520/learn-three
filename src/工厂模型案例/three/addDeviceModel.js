import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class DeviceModel {
  constructor(point) {
    this.point = point;
  }
  init() {
    const group = new THREE.Group();
    new GLTFLoader().load(
      "../src/model/exemple_piping/scene.gltf",
      function (gltf) {
        const model = gltf.scene;
        // console.log(model);
        model.scale.set(0.07, 0.07, 0.07);
        const model2 = model.clone();
        model.position.set(6, 0, -10);
        model2.position.set(6, 0, 20);
        group.add(model);
        group.add(model2);
      },
      undefined,
      function (err) {
        console.log(err);
      }
    );
    return group;
  }
}
