/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useLayoutEffect } from "react";
import "./silk.css";
import { Color } from "three";

const hexToNormalizedRGB = (hex) => {
    hex = hex.replace("#", "");
    return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
    ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotateUVs(vec2 uv, float rotation) {
  float s = sin(rotation);
  float c = cos(rotation);
  mat2 rot = mat2(c, -s, s, c);
  return rot * (uv - 0.5) + 0.5;
}

void main() {
  vec2 uv = rotateUVs(vUv * uScale, uRotation);
  float tOffset = uTime * uSpeed;
  
  // Clean, simple wave logic
  float wave = sin((uv.x + uv.y + tOffset) * 5.0);
  wave = wave * 0.5 + 0.5;
  
  // Highlight blending
  vec3 finalColor = mix(uColor * 0.2, uColor, wave);
  
  // Texture
  float n = random(uv + tOffset * 0.1);
  finalColor += (n - 0.5) * uNoiseIntensity * 0.1;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
    const { viewport } = useThree();

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.scale.set(viewport.width, viewport.height, 1);
        }
    }, [viewport]);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.material.uniforms.uTime.value += delta;
        }
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
});

const Silk = ({
    speed = 1,
    scale = 1,
    color = "#333338",
    noiseIntensity = 0.5,
    rotation = 0,
    className = "",
}) => {
    const meshRef = useRef();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uSpeed: { value: speed },
            uScale: { value: scale },
            uColor: { value: new Color(...hexToNormalizedRGB(color)) },
            uNoiseIntensity: { value: noiseIntensity },
            uRotation: { value: rotation },
        }),
        [speed, scale, color, noiseIntensity, rotation]
    );

    return (
        <div className={`silk-container ${className}`}>
            <Canvas dpr={[1, 2]} frameloop="always">
                <SilkPlane ref={ref => { meshRef.current = ref; }} uniforms={uniforms} />
            </Canvas>
        </div>
    );
};

export default Silk;
