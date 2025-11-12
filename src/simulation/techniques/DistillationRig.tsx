import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useLabStore } from "../../state/labStore";
import { Text } from "@react-three/drei";

// Educational binary distillation visualization
// - mixtureCompA: feed mole fraction of A (more volatile)
// - heatRateW controls boil-up
// - condenserEfficiency and refluxRatio affect distillate rate

export function DistillationRig() {
  const p = useLabStore((s) => s.params.distillation);

  const boilLevel = useRef(0.5);
  const receiverLevel = useRef(0);
  const vaporIntensity = useRef(0);
  const temperatureRef = useRef(78); // simulated temperature

  useFrame((_, dt) => {
    const heat = Math.max(0, p.heatRateW);
    const eff = Math.min(1, Math.max(0, p.condenserEfficiency));
    const reflux = Math.max(0, p.refluxRatio);

    const boilUp = heat * 1e-4;
    const condensed = boilUp * eff;
    const distillate = condensed * (1 / (1 + reflux));

    if (boilLevel.current > 0.1) {
      boilLevel.current = Math.max(
        0.1,
        boilLevel.current - distillate * dt * 0.15
      );
      receiverLevel.current = Math.min(
        0.5,
        receiverLevel.current + distillate * dt * 0.25
      );
      vaporIntensity.current = heat > 50 ? Math.min(0.5, boilUp * 3) : 0;

      // Simulate temperature based on composition
      const baseTemp = 78 + (100 - 78) * (1 - p.mixtureCompA);
      temperatureRef.current = baseTemp + Math.random() * 2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Stand and burner base */}
      <group position={[-0.7, 0.75, 0]}>
        {/* Tripod stand */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        {/* Wire gauze */}
        <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.005, 32]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        {/* Bunsen burner */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
          <meshStandardMaterial
            color="#4a90e2"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Flame */}
        {p.heatRateW > 10 && (
          <mesh position={[0, 0.3, 0]}>
            <coneGeometry
              args={[0.08, 0.15 + vaporIntensity.current * 0.2, 16]}
            />
            <meshStandardMaterial
              color={p.heatRateW > 200 ? "#ff6600" : "#ffaa00"}
              emissive={p.heatRateW > 200 ? "#ff4400" : "#ff8800"}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>

      {/* Round Bottom Flask (Boiler) */}
      <group position={[-0.7, 1.15, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.25, 48, 48]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.75}
            thickness={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Boiling liquid */}
        <mesh position={[0, -0.05 - (0.5 - boilLevel.current) * 0.1, 0]}>
          <sphereGeometry
            args={[
              0.22 * (boilLevel.current / 0.5),
              32,
              32,
              0,
              Math.PI * 2,
              0,
              Math.PI / 2,
            ]}
          />
          <meshStandardMaterial
            color={p.mixtureCompA > 0.5 ? "#ff6b6b" : "#4169e1"}
            transparent
            opacity={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Boiling bubbles */}
        {vaporIntensity.current > 0.1 && (
          <>
            <mesh position={[0.1, 0, 0.05]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
            <mesh position={[-0.08, 0.02, -0.03]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          </>
        )}

        {/* Flask neck connection */}
        <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 16]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.35}
            roughness={0.05}
            transmission={0.7}
            thickness={1.5}
            clearcoat={1}
          />
        </mesh>
      </group>

      {/* Distillation Column */}
      <group position={[-0.35, 1.35, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 24]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.75}
            thickness={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Vapor visualization */}
        {vaporIntensity.current > 0.1 && (
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.55, 16]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.3 + vaporIntensity.current * 0.5}
            />
          </mesh>
        )}

        {/* Thermometer */}
        <mesh position={[0.1, 0.2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 12]} />
          <meshStandardMaterial color="#cc0000" />
        </mesh>
      </group>

      {/* Condenser (Liebig condenser) */}
      <group position={[0.25, 1.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        {/* Outer jacket */}
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.8, 24]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.75}
            thickness={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Inner tube */}
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.75, 16]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.35}
            roughness={0.05}
            transmission={0.7}
            thickness={1.5}
            clearcoat={1}
          />
        </mesh>

        {/* Cooling water inlet/outlet */}
        <mesh position={[0, -0.35, 0.06]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.1, 12]} />
          <meshStandardMaterial color="#2196f3" />
        </mesh>
        <mesh position={[0, 0.35, 0.06]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.1, 12]} />
          <meshStandardMaterial color="#2196f3" />
        </mesh>

        {/* Condensing droplets */}
        {p.condenserEfficiency > 0.5 && vaporIntensity.current > 0.1 && (
          <>
            <mesh position={[0, 0.1, 0.02]}>
              <sphereGeometry args={[0.015, 12, 12]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, -0.15, -0.02]}>
              <sphereGeometry args={[0.012, 12, 12]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
            </mesh>
          </>
        )}
      </group>

      {/* Receiving Flask */}
      <group position={[0.8, 0.95, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[0.18, 0.22, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            roughness={0.05}
            transmission={0.92}
          />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            roughness={0.05}
            transmission={0.92}
          />
        </mesh>

        {/* Flask neck */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.035, 0.12, 24]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            roughness={0.05}
            transmission={0.92}
          />
        </mesh>

        {/* Distillate (purified liquid) */}
        {receiverLevel.current > 0.02 && (
          <mesh position={[0, -0.11 + receiverLevel.current * 0.15, 0]}>
            <cylinderGeometry
              args={[
                0.16,
                0.16,
                Math.max(0.02, receiverLevel.current * 0.3),
                32,
              ]}
            />
            <meshStandardMaterial
              color={p.mixtureCompA > 0.5 ? "#ffb3ba" : "#bae1ff"}
              transparent
              opacity={0.6}
              roughness={0.1}
            />
          </mesh>
        )}
      </group>

      {/* Educational Labels */}
      <Text
        position={[-0.7, 0.6, 0]}
        fontSize={0.05}
        color="#ef4444"
        anchorX="center"
      >
        Heat Source
      </Text>

      <Text
        position={[-0.7, 1.55, 0]}
        fontSize={0.05}
        color="#2563eb"
        anchorX="center"
      >
        Boiling Flask
      </Text>

      <Text
        position={[0.25, 1.9, 0]}
        fontSize={0.05}
        color="#2563eb"
        anchorX="center"
      >
        Condenser
      </Text>

      <Text
        position={[0.8, 0.65, 0]}
        fontSize={0.05}
        color="#16a34a"
        anchorX="center"
      >
        Distillate
      </Text>

      {/* Temperature display */}
      <Text
        position={[-0.2, 1.7, 0]}
        fontSize={0.08}
        color="#dc2626"
        anchorX="center"
      >
        {temperatureRef.current.toFixed(1)}°C
      </Text>

      {receiverLevel.current > 0.45 && (
        <Text
          position={[0.4, 1.9, 0]}
          fontSize={0.08}
          color="#16a34a"
          anchorX="center"
        >
          Collection Complete!
        </Text>
      )}
    </group>
  );
}
