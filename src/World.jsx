import { RigidBody } from "@react-three/rapier";
const World = () => {
    return (
        <>
            <RigidBody type="fixed" friction={0} restitution={0}>
                {/*******Cube Obstacles */}
                {[...new Array(10)].map((item, index) => {
                    return (
                        <mesh
                            key={index}
                            position={[
                                (Math.random() - 0.5) * 20,
                                0.5,
                                (Math.random() - 0.5) * 20,
                            ]}
                        >
                            <boxGeometry />
                            <meshStandardMaterial color="#da8a22" />
                        </mesh>
                    );
                })}
                {/*********************** */}

                {/**Floor */}
                <mesh>
                    <boxGeometry args={[20, 0.1, 20]} />
                    <meshStandardMaterial color="#5d9955" />
                </mesh>
                {/*************** */}

                {/**Walls */}
                <mesh position={[10, 0.5, 0]}>
                    <boxGeometry args={[0.1, 10, 20]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                <mesh position={[-10, 0.5, 0]}>
                    <boxGeometry args={[0.1, 10, 20]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                <mesh position={[0, 0.5, 10]}>
                    <boxGeometry args={[20, 10, 0.1]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                <mesh position={[0, 0.5, -10]}>
                    <boxGeometry args={[20, 10, 0.1]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                {/*************** */}
            </RigidBody>
        </>
    );
};

export default World;
