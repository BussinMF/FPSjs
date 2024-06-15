import { useFBX } from "@react-three/drei"

export default function Gun()
{
    const gun = useFBX('./Pistol.fbx')
    return <>
        <primitive object={gun} scale={0.0005} position={[0.3, -0.2, -0.5]} rotation={[0.1, Math.PI * 0.5, 0]} />
    </>
}