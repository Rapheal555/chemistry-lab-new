import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export type SimulationClock = {
  isRunning: boolean
  speed: number
  time: number
}

export function useSimulationClock(opts?: { running?: boolean; speed?: number }) {
  const state = useRef<SimulationClock>({ isRunning: opts?.running ?? true, speed: opts?.speed ?? 1, time: 0 })
  const api = useRef({
    get time() {
      return state.current.time
    },
    get isRunning() {
      return state.current.isRunning
    },
    get speed() {
      return state.current.speed
    },
    setRunning(v: boolean) {
      state.current.isRunning = v
    },
    setSpeed(v: number) {
      state.current.speed = v
    },
    reset() {
      state.current.time = 0
    },
  })

  useFrame((_, delta) => {
    if (state.current.isRunning) {
      state.current.time += delta * Math.max(0, state.current.speed)
    }
  })

  useEffect(() => {
    state.current.isRunning = opts?.running ?? true
    state.current.speed = opts?.speed ?? 1
  }, [opts?.running, opts?.speed])

  return api.current
}


