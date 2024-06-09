import React, { useState, useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import {
    useRapier,
    RigidBody,
    CapsuleCollider,
} from "@react-three/rapier"
import { Box, useKeyboardControls } from "@react-three/drei"
import * as THREE from 'three'

export default function Bhop() {

    const body = useRef()
    const player = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()

    const [isInAir, setIsInAir ] = useState(true)
    const [isGrounded, setIsGrounded ] = useState(true)

    const gravity = 20.0
    const friction = 6

    /* Movement */
    const moveSpeed = 7.0  // Ground move speed
    const runAcceleration = 14   // Ground accels
    const runDeacceleration = 10   // Deacceleration that occurs when running on the ground
    const airAcceleration = 2.0  // Air accel
    const airDeacceleration = 2.0    // Deacceleration experienced when opposite strafing
    const airControl = 0.3  // How precise air control is
    const sideStrafeAcceleration = 50   // How fast acceleration occurs to get up to sideStrafeSpeed when side strafing
    const sideStrafeSpeed = 1    // What the max speed to generate when side strafing
    const jumpSpeed = 8.0  // The speed at which the character's up axis gains when hitting jump
    const holdJumpToBhop = false // When enabled allows player to just hold jump button to keep on bhopping perfectly. Beware: smells like casual.

    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3()
    const sideVector = new THREE.Vector3()

    useFrame((state, delta) =>
    {
        /* Player */
        // const playerPosition = player.current.position
        // const playerRotation = new THREE.Quaternion()

        // /* Camera */
        // const offset = new THREE.Vector3(0, 1, 2)
        // const lookAtTarget = new THREE.Vector3(0, 5, 1)

        // state.camera.position.copy(playerPosition).add(offset)
        // state.camera.lookAt(lookAtTarget)
    })

console.log(player);
    return (
        <>
        <RigidBody 
            ref={body} 
            type='dynamic'
        >
            <CapsuleCollider ref={player} args={[0.75, 1]}/>
            {/* <Box position={[0,0,2]}/> */}
        </RigidBody>
        <Box  position={[0, 0.5, -3]}/>
        </>
    )
}
