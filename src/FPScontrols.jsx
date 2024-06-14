import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

const SPEED = 5
const JUMPHEIGHT = 5
const SLIDE_SPEED = 15
const standingEye = new THREE.Vector3(0, 0.5, 0)
const crouchingEye = new THREE.Vector3(0, 0.2, 0)

const velocity = new THREE.Vector3()
const forwardDirectionVector = new THREE.Vector3()
const sidewaysDirectionVector = new THREE.Vector3()
const direction = new THREE.Vector3(0, -1, 0)
const slideDirection = new THREE.Vector3()
const cameraEuler = new THREE.Euler()
const accumulatedYawQuaternion = new THREE.Quaternion()

export default function FPSControls() {
    const { camera } = useThree()
    const { rapier, world } = useRapier()
    const rigidBodyRef = useRef()
    const [isGrounded, setIsGrounded] = useState(true)
    const [canSlide, setCanSlide] = useState(true)
    const [subscribeKeys, getKeys] = useKeyboardControls()
    let previousCameraYaw = 0
    let accumulatedYaw = 0

    useEffect(() => {
        const unsubscribe = subscribeKeys((state) => {
            if (!state.slide) {
                setCanSlide(true)
            }
        })
        return () => unsubscribe()
    }, [subscribeKeys])

    const handleMovement = (forward, backward, leftward, rightward) => {
        forwardDirectionVector.set(0, 0, -forward + backward)
        sidewaysDirectionVector.set(rightward - leftward, 0, 0)

        velocity
            .copy(forwardDirectionVector)
            .add(sidewaysDirectionVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyQuaternion(camera.quaternion)

        rigidBodyRef.current.setLinvel({
            x: velocity.x,
            y: rigidBodyRef.current.linvel().y,
            z: velocity.z,
        })
    }

    const handleJump = (jump, hit) => {
        if (jump && isGrounded && hit.toi < 0.15) {
            rigidBodyRef.current.setLinvel({ x: 0, y: JUMPHEIGHT, z: 0 })
            setIsGrounded(false)
        } else if (hit.toi === 0) {
            setIsGrounded(true)
        }
    }

    const handleSlide = (forward, backward, leftward, rightward, slide) => {
        if (slide && isGrounded && canSlide) {
            slideDirection.set(
                forward ? 0 : backward ? 0 : leftward ? -1 : rightward ? 1 : 0,
                0,
                forward ? -1 : backward ? 1 : leftward ? 0 : rightward ? 0 : -1
            )
            slideDirection.applyQuaternion(camera.quaternion)
            slideDirection.normalize().multiplyScalar(SLIDE_SPEED)
            setCanSlide(false)
        }

        if (!canSlide) {
            rigidBodyRef.current.setLinvel({
                x: slideDirection.x,
                y: rigidBodyRef.current.linvel().y,
                z: slideDirection.z,
            })
        }
    }

    const handleCameraRotation = () => {
        const pos = rigidBodyRef.current.translation()
        camera.position.copy(pos).add(canSlide ? standingEye : crouchingEye)
        cameraEuler.setFromQuaternion(camera.quaternion, 'YXZ')
        const currentCameraYaw = cameraEuler.y
        let deltaYaw = currentCameraYaw - previousCameraYaw
        if (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI
        if (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI
        accumulatedYaw += deltaYaw
        previousCameraYaw = currentCameraYaw
        accumulatedYawQuaternion.setFromEuler(new THREE.Euler(0, accumulatedYaw, 0, 'YXZ'))
        rigidBodyRef.current.setRotation(accumulatedYawQuaternion)
    }

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, jump, slide } = getKeys()
        
        if (forward || backward || leftward || rightward || jump || slide) {
            rigidBodyRef.current.wakeUp()
        }

        if (rigidBodyRef.current) {
            handleCameraRotation()
            handleMovement(forward, backward, leftward, rightward)

            const origin = rigidBodyRef.current.translation()
            origin.y -= 0.6
            const ray = new rapier.Ray(origin, direction)
            const hit = world.castRay(ray, 10, true)

            if (hit) {
                setIsGrounded(hit.toi < 0.15)
                handleJump(jump, hit)
                handleSlide(forward, backward, leftward, rightward, slide)

                if (!isGrounded && hit.toi > 0.15) {
                    if (forward || backward || leftward || rightward) {
                        rigidBodyRef.current.friction = 1
                    }
                }
            }
        }
    })

    return (
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
    )
}
