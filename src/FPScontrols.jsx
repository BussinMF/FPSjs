import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

export default function FPSControls() {
    const SPEED = 5 // Adjust speed as necessary
    const { camera } = useThree()
    const { rapier, world } = useRapier()

    const rigidBodyRef = useRef()
    const velocity = new THREE.Vector3()
    const forwardDirectionVector = new THREE.Vector3()
    const sidewaysDirectionVector = new THREE.Vector3()

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const [isGrounded, setIsGrounded] = useState(true)

    // useEffect(() => {
    //     const unsubscribeJump = subscribeKeys(
    //         (state) => state.jump,
    //         (value) => {
    //             if (value && isGrounded) {
    //                 rigidBodyRef.current.applyImpulse({ x: 0, y: 5, z: 0 }) // Adjust the y impulse as necessary
    //                 setIsGrounded(false)
    //             }
    //         }
    //     )
    //     return unsubscribeJump
    // }, [subscribeKeys, isGrounded])

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, jump } = getKeys()

        // Wake up rigid body if keys are pressed
        if (forward || backward || leftward || rightward || jump) {
            rigidBodyRef.current.wakeUp()
        }

        if (rigidBodyRef.current) {
            // Check if the character is grounded
            const origin = rigidBodyRef.current.translation()
            origin.y -= 0.6
            const direction = { x: 0, y: -1, z: 0 }
            const ray = new rapier.Ray(origin, direction)
            const hit = world.castRay(ray, 10, true)

            if(jump && isGrounded && hit.toi < 0.15)
            {
                rigidBodyRef.current.applyImpulse({ x: 0, y: 0.2, z: 0 })
                setIsGrounded(false)
            }
            else if(hit.toi === 0)
            {
                setIsGrounded(true)
            }
            
            console.log('Grounded:', isGrounded)
            console.log(hit.toi);

            let previousCameraYaw = 0
            let accumulatedYaw = 0
            const pos = rigidBodyRef.current.translation()
            camera.position.copy(pos)
            const cameraEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
            const currentCameraYaw = cameraEuler.y
            let deltaYaw = currentCameraYaw - previousCameraYaw
            if (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI
            if (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI
            accumulatedYaw += deltaYaw
            previousCameraYaw = currentCameraYaw
            const accumulatedYawQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, accumulatedYaw, 0, 'YXZ'))
            rigidBodyRef.current.setRotation(accumulatedYawQuaternion)
            
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
                y: rigidBodyRef.current.linvel().y, // Keep the current y velocity for jumping
                z: velocity.z,
            })
        }
    })

    return (
        <RigidBody
            ref={rigidBodyRef}
            colliders={false}
            mass={1} // Adjust the mass as necessary
            friction={0}
            restitution={0}
            position={[0, 0.6, 0]}
            enabledRotations={[false, false, false]} // Prevent from falling sideways
        >
            <CapsuleCollider args={[0.3, 0.25]} />
        </RigidBody>
    )
}
