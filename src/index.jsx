import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Preload } from '@react-three/drei'
import Experience from './Experience.jsx'
import Interface from './Interface.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const keys = [
    { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
    { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
    { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
    { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
    { name: 'jump', keys: [ 'Space' ] },
    {name: 'resetRotation', keys: [ 'KeyR' ]}
]

root.render(
    <KeyboardControls
    map={ keys }
    >
        <Canvas
        camera={{ position: [0, 1, 5] }} 
        flat 
        shadows 
        dpr={[1, 2]}
        >
            <Experience />
            <Preload all />
        </Canvas>
        <Interface />
    </KeyboardControls>
)