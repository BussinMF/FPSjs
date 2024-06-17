import { PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Lights from './Components/Lights.jsx'
import World from './Components/Prefabs/World.jsx'
import Player from './Components/Player.jsx'

export default function Experience()
{
    return <>
        <color args={[ 'lightgrey' ]} attach="background" />

        <PointerLockControls />

        <Lights />

        <Physics debug>
            <Player />
            <World />
        </Physics>

    </>
}