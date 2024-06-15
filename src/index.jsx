import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Preload } from '@react-three/drei'
import Experience from './Experience.jsx'
import Interface from './Interface.jsx'
import { Perf } from 'r3f-perf'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const keys = [
    { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
    { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
    { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
    { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
    { name: 'jump', keys: [ 'Space' ] },
    { name: 'slide', keys: [ 'Shift' ] },
    { name: 'dash', keys: [ 'KeyQ' ] },
    { name: 'reloadKey', keys: [ 'KeyR' ] },
]

root.render(
    <KeyboardControls
    map={ keys }
    >
        <Canvas
        flat 
        shadows 
        dpr={[1, 2]}
        >
            <Perf position="top-left" minimal/>
            <Experience />
            <Preload all />
        </Canvas>
        <Interface />
    </KeyboardControls>
)