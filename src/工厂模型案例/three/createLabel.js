import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

export default function createLabel(position, text) {
  console.log(position);
  const textDiv = document.createElement("div");
  textDiv.className = "label";
  textDiv.textContent = text;
  textDiv.style.color = "#00ffff";
  textDiv.style.padding = "2px 5px";
  textDiv.style.borderRadius = "5px";
  textDiv.style.backgroundColor = "rgba(0,0,0,0.2)";

  const textLabel = new CSS2DObject(textDiv);
  textLabel.position.set(position.x, position.y, position.z);
  return textLabel;
}
