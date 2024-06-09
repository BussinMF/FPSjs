import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import { useRef, useState } from "react"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import { useThree, useFrame } from "@react-three/fiber"

export default function FPScontrols() {
    const SPEED = 10
    const velocity = new THREE.Vector3()
    const forwardDirectionVector = new THREE.Vector3()
    const sidewaysDirectionVector = new THREE.Vector3()

    const [isInAir, setIsInAir ] = useState(true)
    const [isGrounded, setIsGrounded ] = useState(true)

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const rigidBodyRef = useRef()
    const { camera } = useThree()

    useFrame((state, delta) => {
        //get input key values on every frame
        const { forward, backward, leftward, rightward, jump } = getKeys()

        if (forward ||backward || rightward || leftward) 
        {
            rigidBodyRef.current.wakeUp()
        }

        //check if ref has been linked to rigid body
        if (rigidBodyRef.current) {
            //get current position of rigid body (on every frame)
            const pos = rigidBodyRef.current.translation()
            camera.position.copy(pos)

             //get current rotation of camera and set the rotation on rigidbody (on every frame)
            const cameraRotation = new THREE.Quaternion()
            cameraRotation.setFromEuler(camera.rotation)
            rigidBodyRef.current.setRotation(cameraRotation)

            //'front direction' takes true/false values from keyboard input
            //  and treats them as 1/0. When summed together you get a number
            //  on the z-axis telling you if you're going forward or backward.
            //Forward is in the -z direction
            forwardDirectionVector.set(0, 0, -forward + backward)

            //same for x, left is in the -x direction
            sidewaysDirectionVector.set(rightward - leftward, 0, 0)

            /**
             * VELOCITY SETUP
             */

            //combine forward & side directions into one vector
            //  (just for concise writing).Its the same same as
            //  doing { x: sideDir.x, y:0, z: forwardDir.z}
            velocity.addVectors(
                forwardDirectionVector,
                sidewaysDirectionVector
            )

            //force the combined vector to a magnitude of 1
            velocity.normalize()

            //give the combined vector a desired magnitude
            //i.e multiply direction by speed to get velocity
            velocity.multiplyScalar(SPEED)

            //account for different frame rates per user
            //'20' here is an arbitrary tuning value though
            velocity.multiplyScalar(delta * 20)

            //account for the pointerLock direction with some 'math'
            //  so that left,right etc are all relative to camera direction
            velocity.applyEuler(camera.rotation)
            //applying camera rotation to velocity can also be done with
            // velocity.applyQuaternion(camera.quaternion)

            //set the velicity of your capsule collider to the result velocity above
            rigidBodyRef.current.setLinvel({
                x: velocity.x,
                y: velocity.y * 0, //zero this if you don't have 'jump' functionality
                z: velocity.z,
            })
        }
    })

    return (
        <>
            <RigidBody
                ref={rigidBodyRef}
                colliders={false}
                mass={1}
                friction={0}
                restitution={0}
                position={[0, 0.6, 0]}
                enabledRotations={[false, false, false]} //prevent from falling sideways
            >
                <CapsuleCollider args={[0.3, 0.25]} />
            </RigidBody>
        </>
    )
}
