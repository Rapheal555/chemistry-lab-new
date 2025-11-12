import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useLabStore } from "../../state/labStore";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Compound colors for visualization
const compoundColors: Record<string, string> = {
  sand: "#d4a574",
  chalk: "#f5f5dc",
  "coffee grounds": "#3e2723",
  clay: "#8b4513",
  water: "#4fc3f7",
  saltwater: "#81c784",
  oil: "#ffd54f",
};

export function FiltrationRig() {
  const experiment = useLabStore((s) => s.filtrationExperiment);
  const updateExperiment = useLabStore((s) => s.updateFiltrationExperiment);
  const params = useLabStore((s) => s.params.filtration);

  const liquidLevelRef = useRef(experiment.liquidLevel || 0.5);
  const filtrateLevelRef = useRef(experiment.filtrateLevel || 0);
  const cakeThicknessRef = useRef(experiment.cakeThickness || 0.01);
  const paperFoldRef = useRef(experiment.paperFoldProgress || 0);

  // Darcy's law physics simulation
  useFrame((_, dt) => {
    if (experiment.step !== "filtering" || !experiment.isRunning) return;

    const vacuum = Math.max(0, params.vacuumMbar);
    const area = Math.max(1, params.filterAreaCm2) * 1e-4;
    const viscosity = Math.max(0.1, params.slurryViscosityCP) / 1000;
    const pore = Math.max(0.1, params.poreSizeMicron) * 1e-6;

    const baseResistance = 1 / Math.pow(pore, 2);
    const cakeResistance = 1 + cakeThicknessRef.current * 100;
    const resistance = baseResistance * cakeResistance;

    const pressurePa = vacuum * 100;
    const flowRate = (pressurePa * area) / (viscosity * resistance);
    const scaledFlow = flowRate * 5e-6;

    const dV = scaledFlow * dt;

    if (liquidLevelRef.current > 0.05) {
      liquidLevelRef.current = Math.max(0.05, liquidLevelRef.current - dV * 2);
      filtrateLevelRef.current = Math.min(
        0.5,
        filtrateLevelRef.current + dV * 1.5
      );
      cakeThicknessRef.current = Math.min(
        0.08,
        cakeThicknessRef.current + dV * 0.3
      );

      updateExperiment({
        liquidLevel: liquidLevelRef.current,
        filtrateLevel: filtrateLevelRef.current,
        cakeThickness: cakeThicknessRef.current,
      });
    } else {
      updateExperiment({ step: "complete", isRunning: false });
    }
  });

  // Animate filter paper folding
  useFrame((_, dt) => {
    if (experiment.step === "folding-paper" && paperFoldRef.current < 1) {
      paperFoldRef.current = Math.min(1, paperFoldRef.current + dt * 0.5);
      updateExperiment({ paperFoldProgress: paperFoldRef.current });

      if (paperFoldRef.current >= 1) {
        updateExperiment({ step: "mixing" });
      }
    }
  });

  const solidColor = experiment.solidCompound
    ? compoundColors[experiment.solidCompound] || "#999999"
    : "#999999";
  const liquidColor = experiment.liquidCompound
    ? compoundColors[experiment.liquidCompound] || "#4fc3f7"
    : "#4fc3f7";

  // Available compounds to choose from
  const solids = ["sand", "chalk", "coffee grounds", "clay"];
  const liquids = ["water", "saltwater", "oil"];

  return (
    <group position={[0, 0, 0]}>
      {/* Ring stand base */}
      <group position={[-0.3, 0.75, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1, 16]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
        </mesh>
      </group>

      {/* Glass Funnel - appears after paper is folded */}
      {experiment.step !== "setup" && experiment.step !== "folding-paper" && (
        <group position={[-0.15, 1.3, 0]}>
          {/* Funnel cone */}
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.18, 0.25, 32]} />
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

          {/* Funnel rim highlight */}
          <mesh position={[0, 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.005, 16, 32]} />
            <meshStandardMaterial
              color="#b0d4e0"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* Funnel stem */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.02, 0.15, 16]} />
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

          {/* Filter paper - animated folding */}
          {(experiment.step === "ready" ||
            experiment.step === "pouring" ||
            experiment.step === "filtering" ||
            experiment.step === "complete") && (
            <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.16, 0.2, 32, 1, true]} />
              <meshStandardMaterial
                color="#f5f5f5"
                side={THREE.DoubleSide}
                roughness={0.9}
              />
            </mesh>
          )}

          {/* Slurry in funnel (during filtering) */}
          {(experiment.step === "filtering" || experiment.step === "pouring") &&
            liquidLevelRef.current > 0.05 && (
              <>
                <mesh position={[0, -0.125 + liquidLevelRef.current * 0.15, 0]}>
                  <cylinderGeometry
                    args={[
                      0.15 * (1 - liquidLevelRef.current * 0.5),
                      0.15,
                      Math.max(0.02, liquidLevelRef.current * 0.3),
                      32,
                    ]}
                  />
                  <meshStandardMaterial
                    color={liquidColor}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
                <mesh
                  position={[0, -0.125 + cakeThicknessRef.current * 0.3, 0]}
                >
                  <cylinderGeometry
                    args={[
                      0.14,
                      0.14,
                      Math.max(0.01, cakeThicknessRef.current),
                      32,
                    ]}
                  />
                  <meshStandardMaterial
                    color={solidColor}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              </>
            )}
        </group>
      )}

      {/* Erlenmeyer Flask */}
      <group position={[0, 0.85, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[0.2, 0.25, 32]} />
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
        <mesh position={[0, 0.175, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
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

        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.15, 24]} />
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

        <mesh position={[0, 0.375, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04, 0.004, 16, 32]} />
          <meshStandardMaterial
            color="#b0d4e0"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {filtrateLevelRef.current > 0.01 && (
          <mesh position={[0, -0.125 + filtrateLevelRef.current * 0.2, 0]}>
            <cylinderGeometry
              args={[
                0.18,
                0.18,
                Math.max(0.02, filtrateLevelRef.current * 0.4),
                32,
              ]}
            />
            <meshStandardMaterial
              color={liquidColor}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}
      </group>

      {/* Individual beakers for each compound on the table - SETUP STAGE */}
      {experiment.step === "setup" && (
        <group>
          {/* Solid compounds in beakers - back row */}
          {solids.map((solid, index) => (
            <group key={solid} position={[-1.2 + index * 0.8, 0.82, -0.8]}>
              {/* Beaker */}
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.07, 0.15, 24]} />
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

              {/* Rim */}
              <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.08, 0.003, 16, 24]} />
                <meshStandardMaterial
                  color="#b0d4e0"
                  metalness={0.7}
                  roughness={0.2}
                />
              </mesh>

              {/* Solid compound inside */}
              <mesh position={[0, -0.05, 0]}>
                <cylinderGeometry args={[0.07, 0.065, 0.05, 24]} />
                <meshStandardMaterial
                  color={compoundColors[solid]}
                  roughness={0.9}
                />
              </mesh>

              {/* Label */}
              <Text
                position={[0, -0.15, 0.09]}
                fontSize={0.04}
                color="#2563eb"
                anchorX="center"
                anchorY="middle"
              >
                {solid}
              </Text>
            </group>
          ))}

          {/* Liquid compounds in beakers - front row */}
          {liquids.map((liquid, index) => (
            <group key={liquid} position={[-0.9 + index * 0.9, 0.9, 0.2]}>
              {/* Beaker */}
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.07, 0.15, 24]} />
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

              {/* Rim */}
              <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.08, 0.003, 16, 24]} />
                <meshStandardMaterial
                  color="#b0d4e0"
                  metalness={0.7}
                  roughness={0.2}
                />
              </mesh>

              {/* Liquid inside */}
              <mesh position={[0, -0.02, 0]}>
                <cylinderGeometry args={[0.075, 0.068, 0.11, 24]} />
                <meshStandardMaterial
                  color={compoundColors[liquid]}
                  transparent
                  opacity={0.7}
                />
              </mesh>

              {/* Label */}
              <Text
                position={[0, -0.15, 0.09]}
                fontSize={0.04}
                color="#2563eb"
                anchorX="center"
                anchorY="middle"
              >
                {liquid}
              </Text>
            </group>
          ))}

          {/* Empty mixing beaker in center */}
          <group position={[0.6, 0.9, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.25, 32]} />
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

            <mesh position={[0, 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.15, 0.005, 16, 32]} />
              <meshStandardMaterial
                color="#b0d4e0"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>

            <Text
              position={[0, -0.25, 0]}
              fontSize={0.05}
              color="#2563eb"
              anchorX="center"
            >
              Mixing Beaker
            </Text>
          </group>

          {/* Filter paper (flat, unfolded) on table */}
          <group position={[-0.8, 0.76, 0.5]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.12, 32]} />
              <meshStandardMaterial
                color="#f5f5f5"
                side={THREE.DoubleSide}
                roughness={0.9}
              />
            </mesh>
            <Text
              position={[0, 0.01, -0.18]}
              fontSize={0.04}
              color="#2563eb"
              rotation={[-Math.PI / 2, 0, 0]}
              anchorX="center"
            >
              Filter Paper
            </Text>
          </group>
        </group>
      )}

      {/* Animated filter paper folding sequence */}
      {experiment.step === "folding-paper" && (
        <group position={[0, 1.2, 0]}>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.08}
            color="#16a34a"
            anchorX="center"
            anchorY="middle"
          >
            Folding Filter Paper... {Math.round(paperFoldRef.current * 100)}%
          </Text>

          {/* Animate paper from flat circle to cone shape with realistic folding */}
          <group rotation={[0, paperFoldRef.current * Math.PI * 4, 0]}>
            {/* Stage 1: Flat circle (0-0.25) */}
            {paperFoldRef.current < 0.25 && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.18, 32]} />
                <meshStandardMaterial
                  color="#f5f5f5"
                  side={THREE.DoubleSide}
                  roughness={0.9}
                />
              </mesh>
            )}

            {/* Stage 2: Semi-folded (0.25-0.5) */}
            {paperFoldRef.current >= 0.25 && paperFoldRef.current < 0.5 && (
              <mesh
                rotation={[
                  -Math.PI / 2 + (paperFoldRef.current - 0.25) * Math.PI * 2,
                  0,
                  0,
                ]}
              >
                <circleGeometry args={[0.18, 32]} />
                <meshStandardMaterial
                  color="#f5f5f5"
                  side={THREE.DoubleSide}
                  roughness={0.9}
                />
              </mesh>
            )}

            {/* Stage 3: Forming cone (0.5-0.75) */}
            {paperFoldRef.current >= 0.5 && paperFoldRef.current < 0.75 && (
              <mesh
                rotation={[0, 0, 0]}
                scale={[1, 0.5 + (paperFoldRef.current - 0.5) * 2, 1]}
              >
                <coneGeometry args={[0.18, 0.05, 32, 1, true]} />
                <meshStandardMaterial
                  color="#f5f5f5"
                  side={THREE.DoubleSide}
                  roughness={0.9}
                />
              </mesh>
            )}

            {/* Stage 4: Final cone shape (0.75-1.0) */}
            {paperFoldRef.current >= 0.75 && (
              <mesh
                rotation={[0, 0, 0]}
                scale={[1, 0.5 + (paperFoldRef.current - 0.75) * 2, 1]}
              >
                <coneGeometry args={[0.16, 0.2, 32, 1, true]} />
                <meshStandardMaterial
                  color="#f5f5f5"
                  side={THREE.DoubleSide}
                  roughness={0.9}
                />
              </mesh>
            )}
          </group>
        </group>
      )}

      {/* Mixing beaker with contents during mixing/ready/pouring stages */}
      {(experiment.step === "mixing" || experiment.step === "ready") && (
        <group position={[0.6, 0.9, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.25, 32]} />
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

          <mesh position={[0, 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.005, 16, 32]} />
            <meshStandardMaterial
              color="#b0d4e0"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* Mixed contents */}
          {experiment.solidCompound && experiment.liquidCompound && (
            <>
              {/* Liquid */}
              <mesh position={[0, -0.04, 0]}>
                <cylinderGeometry args={[0.14, 0.11, 0.15, 32]} />
                <meshStandardMaterial
                  color={liquidColor}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              {/* Solid particles */}
              <mesh position={[0, -0.06, 0]}>
                <cylinderGeometry args={[0.14, 0.11, 0.15, 32]} />
                <meshStandardMaterial
                  color={solidColor}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </>
          )}

          <Text
            position={[0, -0.25, 0]}
            fontSize={0.05}
            color="#2563eb"
            anchorX="center"
          >
            Mixture Ready
          </Text>
        </group>
      )}

      {/* Labels */}
      {experiment.step !== "setup" && experiment.step !== "folding-paper" && (
        <>
          <Text
            position={[-0.6, 1.5, 0]}
            fontSize={0.06}
            color="#2563eb"
            anchorX="center"
            anchorY="middle"
          >
            Funnel
          </Text>

          <Text
            position={[-0.6, 0.9, 0]}
            fontSize={0.06}
            color="#2563eb"
            anchorX="center"
            anchorY="middle"
          >
            Flask
          </Text>
        </>
      )}

      {experiment.step === "complete" && (
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.08}
          color="#16a34a"
          anchorX="center"
          anchorY="middle"
        >
          Filtration Complete!
        </Text>
      )}
    </group>
  );
}
