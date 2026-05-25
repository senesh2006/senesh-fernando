export const ControlType = {
  Enum: "enum",
  Boolean: "boolean",
  Color: "color",
  Object: "object",
  Number: "number",
  BorderRadius: "borderRadius",
} as const

export const RenderTarget = {
  canvas: "canvas",
  current: () => "production",
}

export function addPropertyControls(_component: unknown, _controls: unknown) {
  // Framer editor only — no-op in production
}

export function useIsStaticRenderer() {
  return false
}
