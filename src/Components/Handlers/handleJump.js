export function handleJump(rigidBodyRef, JUMPHEIGHT, isGrounded, isWalled, setIsGrounded, setIsWalled, jump, hit) {
    if (jump && (isGrounded || isWalled) && hit.toi < 0.15) {
      rigidBodyRef.current.setLinvel({ x: 0, y: JUMPHEIGHT, z: 0 });
      setIsGrounded(false);
      setIsWalled(false);
    } else if (!isGrounded && isWalled && hit.toi > 0.15) {
      setIsWalled(true);
    } else if (hit.toi === 0) {
      setIsGrounded(true);
    }
  }
  