import * as THREE from "three";

const standingEye = new THREE.Vector3(0, 0.5, 0);
const crouchingEye = new THREE.Vector3(0, 0.2, 0);
const cameraEuler = new THREE.Euler();
const accumulatedYawQuaternion = new THREE.Quaternion();

let previousCameraYaw = 0;
let accumulatedYaw = 0;

export function handleCamera(rigidBodyRef, camera, canSlide) {
  const pos = rigidBodyRef.current.translation();
  camera.position.copy(pos).add(canSlide ? standingEye : crouchingEye);
  cameraEuler.setFromQuaternion(camera.quaternion, "YXZ");
  const currentCameraYaw = cameraEuler.y;
  let deltaYaw = currentCameraYaw - previousCameraYaw;
  if (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI;
  if (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI;
  accumulatedYaw += deltaYaw;
  previousCameraYaw = currentCameraYaw;
  accumulatedYawQuaternion.setFromEuler(
    new THREE.Euler(0, accumulatedYaw, 0, "YXZ")
  );
  rigidBodyRef.current.setRotation(accumulatedYawQuaternion);
}
