import * as THREE from "three";

const velocity = new THREE.Vector3();
const forwardDirectionVector = new THREE.Vector3();
const sidewaysDirectionVector = new THREE.Vector3();

export function handleMovement(rigidBodyRef, SPEED, forward, backward, leftward, rightward) {
  forwardDirectionVector.set(0, 0, -forward + backward);
  sidewaysDirectionVector.set(rightward - leftward, 0, 0);

  const bodyRot = rigidBodyRef.current.rotation();

  velocity
    .copy(forwardDirectionVector)
    .add(sidewaysDirectionVector)
    .normalize()
    .multiplyScalar(SPEED)
    .applyQuaternion(bodyRot);

  rigidBodyRef.current.setLinvel({
    x: velocity.x,
    y: rigidBodyRef.current.linvel().y,
    z: velocity.z,
  });
}
