import * as THREE from "three";

const dashDirection = new THREE.Vector3();

export function handleDash(rigidBodyRef, DASH_SPEED, DASH_DURATION, canDash, setCanDash, isDashPressed, setIsDashPressed, camera, forward, backward, leftward, rightward, dash, dashTimeout) {
  if (dash && canDash && !isDashPressed) {
    setIsDashPressed(true);

    dashDirection.set(
      forward ? 0 : backward ? 0 : leftward ? -1 : rightward ? 1 : 0,
      0,
      forward ? -1 : backward ? 1 : leftward ? 0 : rightward ? 0 : -1
    );
    dashDirection.applyQuaternion(camera.quaternion);
    dashDirection.normalize().multiplyScalar(DASH_SPEED);
    setCanDash(false);

    // Start a timer for the dash duration
    dashTimeout = setTimeout(() => {
      setCanDash(true);
    }, DASH_DURATION * 1000);
  }

  if (!dash && isDashPressed) {
    setIsDashPressed(false);
  }

  if (!canDash) {
    rigidBodyRef.current.setLinvel({
      x: dashDirection.x,
      y: rigidBodyRef.current.linvel().y,
      z: dashDirection.z,
    });
  }
}
