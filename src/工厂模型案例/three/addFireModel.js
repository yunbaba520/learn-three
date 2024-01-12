import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class FireModel {
  constructor(points) {
    this.points = points;
    this.init();
  }
  init() {
    const _that = this;
    const group = new THREE.Group();
    new GLTFLoader().load(
      "../src/model/fire_extinguisher/scene.gltf",
      function (gltf) {
        const model = gltf.scene;

        for (let i = 0; i < _that.points.length; i++) {
          const point = _that.points[i];
          const m = model.clone();
          m.position.set(point.x, point.y, point.z);
          group.add(m);
        }
      },
      undefined,
      function (err) {
        console.log(err);
      }
    );
    return group;
  }
}
