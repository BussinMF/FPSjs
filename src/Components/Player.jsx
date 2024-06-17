import * as THREE from "three"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier"
import Gun from "./Gun.jsx"
import { handleMovement } from "./Handlers/handleMovement"
import { handleJump } from "./Handlers/handleJump"
import { handleSlide } from "./Handlers/handleSlide"
import { handleDash } from "./Handlers/handleDash"
import { handleCamera } from "./Handlers/handleCamera"

const SPEED = 10
const JUMPHEIGHT = 7
const SLIDE_SPEED = 15
const DASH_SPEED = 30
const DASH_DURATION = 0.2
const direction = new THREE.Vector3(0, -1, 0)

export default function Player() {
  const { camera } = useThree()
  const { rapier, world } = useRapier()
  const rigidBodyRef = useRef()
  const gunRef = useRef()
  const [isGrounded, setIsGrounded] = useState(true)
  const [isWalled, setIsWalled] = useState(false)
  const [canSlide, setCanSlide] = useState(true)
  const [canDash, setCanDash] = useState(true)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const [isDashPressed, setIsDashPressed] = useState(false)
  let dashTimeout = null

  useEffect(() => {
    const unsubscribe = subscribeKeys((state) => {
      if (!state.slide) {
        setCanSlide(true)
      }

      if (!state.dash) {
        setIsDashPressed(false)
      }
    })
    return () => unsubscribe()
  }, [subscribeKeys])

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, jump, slide, dash } = getKeys()

    if (forward || backward || leftward || rightward || jump || slide || dash) {
      rigidBodyRef.current.wakeUp()
    }

    if (rigidBodyRef.current) {
      handleCamera(rigidBodyRef, camera, canSlide)
      handleMovement(rigidBodyRef, SPEED, forward, backward, leftward, rightward)

      const origin = rigidBodyRef.current.translation()
      origin.y -= 0.6
      const ray = new rapier.Ray(origin, direction)
      const hit = world.castRay(ray, 10, true)

      if (hit) {
        setIsGrounded(hit.toi < 0.15)
        setIsWalled(!isGrounded && hit.toi > 0.15 && (forward || backward || leftward || rightward))
        handleJump(rigidBodyRef, JUMPHEIGHT, isGrounded, isWalled, setIsGrounded, setIsWalled, jump, hit)
        handleSlide(rigidBodyRef, SLIDE_SPEED, isGrounded, canSlide, setCanSlide, camera, forward, backward, leftward, rightward, slide)
        handleDash(rigidBodyRef, DASH_SPEED, DASH_DURATION, canDash, setCanDash, isDashPressed, setIsDashPressed, camera, forward, backward, leftward, rightward, dash, dashTimeout)

        if (isWalled && !isGrounded) {
          rigidBodyRef.current.friction = 1
        } else {
          rigidBodyRef.current.friction = 0
        }
      }
    }

    // Update gun position and rotation to follow the camera
    if (gunRef.current) {
      gunRef.current.position.copy(camera.position)
      gunRef.current.quaternion.copy(camera.quaternion)
    }
  })

  useEffect(() => {
    return () => {
      // Clean up the dash timeout when the component unmounts or rerenders
      if (dashTimeout) {
        clearTimeout(dashTimeout)
      }
    }
  }, [])

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        mass={1}
        restitution={0}
        position={[0, 0.6, 0]}
        enabledRotations={[false, false, false]}
        canSleep
      >
        <CapsuleCollider args={[0.3, 0.25]} />
      </RigidBody>
      <group ref={gunRef}>
        <Gun />
      </group>
    </>
  )
}
