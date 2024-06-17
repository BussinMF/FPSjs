import * as THREE from "three";

const slideDirection = new THREE.Vector3();

export function handleSlide(rigidBodyRef, SLIDE_SPEED, isGrounded, canSlide, setCanSlide, camera, forward, backward, leftward, rightward, slide) {
  if (slide && isGrounded && canSlide) {
    slideDirection.set(
      forward ? 0 : backward ? 0 : leftward ? -1 : rightward ? 1 : 0,
      0,
      forward ? -1 : backward ? 1 : leftward ? 0 : rightward ? 0 : -1
    );
    slideDirection.applyQuaternion(camera.quaternion);
    slideDirection.normalize().multiplyScalar(SLIDE_SPEED);
    setCanSlide(false);
  }

  if (!canSlide) {
    rigidBodyRef.current.setLinvel({
      x: slideDirection.x,
      y: rigidBodyRef.current.linvel().y,
      z: slideDirection.z,
    });
  }
}
