import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

const SPEED = 5
const JUMPHEIGHT = 5
const velocity = new THREE.Vector3()
const forwardDirectionVector = new THREE.Vector3()
const sidewaysDirectionVector = new THREE.Vector3()
const standingEye = new THREE.Vector3(0, 0.5, 0)
const crouchingEye = new THREE.Vector3(0, 0.2, 0)

export default function FPSControls() 
{
    const { camera } = useThree()
    const { rapier, world } = useRapier()
    const rigidBodyRef = useRef()
    const [isGrounded, setIsGrounded] = useState(true)
    const [isStanding, setIsStanding] = useState(true)
    const [subscribeKeys, getKeys] = useKeyboardControls()

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, jump, crouch } = getKeys()
        
        if (forward || backward || leftward || rightward || jump || crouch) 
        {
            rigidBodyRef.current.wakeUp()
        }

        if (rigidBodyRef.current) {
            /**
             * Camera
             */
            let previousCameraYaw = 0
            let accumulatedYaw = 0
            const pos = rigidBodyRef.current.translation()
            camera.position.copy(pos).add(standingEye)
            const cameraEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
            const currentCameraYaw = cameraEuler.y
            let deltaYaw = currentCameraYaw - previousCameraYaw
            if (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI
            if (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI
            accumulatedYaw += deltaYaw
            previousCameraYaw = currentCameraYaw
            const accumulatedYawQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, accumulatedYaw, 0, 'YXZ'))
            rigidBodyRef.current.setRotation(accumulatedYawQuaternion)

            /**
             * Movement
             */
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

            /**
             * Jump
             */
            const origin = rigidBodyRef.current.translation()
            origin.y -= 0.6
            const direction = { x: 0, y: -1, z: 0 }
            const ray = new rapier.Ray(origin, direction)
            const hit = world.castRay(ray, 10, true)

            if(jump && isGrounded && hit.toi < 0.15)
            {
                rigidBodyRef.current.setLinvel({ x: 0, y: JUMPHEIGHT, z: 0 })
                setIsGrounded(false)
            }
            else if(hit.toi === 0)
            {
                setIsGrounded(true)
            }
            /* Wall Friction */
            if(!isGrounded && hit.toi > 0.15)
            {
                rigidBodyRef.current.friction = 1
            }

            /**
             * Crouch
             */
            if(crouch && isStanding)
            {
                camera.position.copy(pos).add(crouchingEye)
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
