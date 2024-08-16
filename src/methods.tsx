type MethodInterpolate = (
  t: number,
  from: number,
  to: number,
  easing?: string
) => number
type MethodgetGradientStyle = (color: any, textMask?: boolean) => void;
type MethodloadFont = (font: string) => Promise<void>;
type MethodHotUpdate = () => void;


// interpolate
let interpolateImpl: MethodInterpolate;
export const interpolate: MethodInterpolate = (t, from, to, easing) => {
  return interpolateImpl(t, from, to, easing)
}
export const registerInterpolate = (fn: MethodInterpolate) => {
  interpolateImpl = fn;
}

// getGradientStyle
let getGradientStyleImpl: MethodgetGradientStyle;
export const getGradientStyle: MethodgetGradientStyle = (color, textMask) => {
  return getGradientStyleImpl(color, textMask)
}
export const registerGetGradientStyle = (fn: MethodgetGradientStyle) => {
  getGradientStyleImpl = fn
}

// loadFont
let loadFontImpl: MethodloadFont;
export const loadFont: MethodloadFont = (font) => {
  return loadFontImpl(font)
}
export const registerLoadFont = (fn: MethodloadFont) => {
  loadFontImpl = fn
}

// hotUpdate
let hotUpdateImpl: MethodHotUpdate;
export const hotUpdate: MethodHotUpdate = () => {
  return hotUpdateImpl()
}
export const registerHotUpdate = (fn: MethodHotUpdate) => {
  hotUpdateImpl = fn
}