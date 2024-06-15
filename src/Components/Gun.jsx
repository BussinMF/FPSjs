import { MathUtils } from 'three'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import useMouseEvents from '../Hooks/useMouseEvents' 

export default function Gun() {
  const gun = useFBX('./Pistol.fbx')

  const [clicksPressed, setPressedClicks] = useState({ left: false, right: false })
  const [recoil, setRecoil] = useState(0)

  const recoilRef = useRef(0)
  const recoilTargetRef = useRef(0)

  // Hook for handling mouse events
  useMouseEvents(
    // Left mouse down
    () => {
      setPressedClicks((current) => ({ ...current, left: true }))
      setRecoil(-0.1) // Apply recoil when left click
      recoilRef.current = 1
      recoilTargetRef.current = 0
    },
    // Left mouse up
    () => {
      setPressedClicks((current) => ({ ...current, left: false }))
    },
    // Right mouse down
    () => {
      setPressedClicks((current) => ({ ...current, right: true }))
      // Additional logic for right mouse down
    },
    // Right mouse up
    () => {
      setPressedClicks((current) => ({ ...current, right: false }))
      // Additional logic for right mouse up
    }
  )

  useFrame(() => {
    // Update recoil with lerp
    if (recoil !== recoilTargetRef.current) {
      recoilRef.current = MathUtils.lerp(
        recoilRef.current,
        recoilTargetRef.current,
        0.2 // Adjust the speed of the lerp here
      )
      setRecoil(recoilRef.current)
    }
  })

  return (
    <>
      <primitive
        object={gun}
        scale={0.0005}
        position={[0.3, -0.2, -0.5]}
        rotation={[recoil, Math.PI * 0.5, 0]}
      />
    </>
  )
}
