import { OrbitControls, PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Lights from './Lights.jsx'
import World from './World.jsx'
import FPScontrols from './FPScontrols.jsx'

export default function Experience()
{
    return <>
        <color args={[ 'lightgrey' ]} attach="background" />

        {/* <OrbitControls makeDefault /> */}

        <PointerLockControls />

        <Lights />

        <Physics debug>
            <FPScontrols />
            <World />
        </Physics>

    </>
}