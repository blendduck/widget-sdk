import React from "react";
import * as z from "zod";

export type WidgetStyles = {
  width: number;
  height: number;
};

export type WidgetParameters<T extends z.ZodObject<any>> = z.infer<T>;

export type AnimationParameters<T extends z.ZodObject<any> | undefined = undefined> = {
  frame: number,
  durationInFrames: number,
  data: T extends z.ZodObject<any> ? z.infer<T> : undefined,
}

export type WidgetContextProps<
  T extends z.ZodObject<any> = any,
  U extends z.ZodObject<any> | undefined = undefined,
  V extends z.ZodObject<any> | undefined = undefined
> = {
  styles: WidgetStyles,
  parameters: WidgetParameters<T>,
  appear?: AnimationParameters<U extends z.ZodObject<any> ? U : never>,
  disappear?: AnimationParameters<V extends z.ZodObject<any> ? V : never>,
}

export const WidgetContext = React.createContext<WidgetContextProps<any, any, any> | null>(null);

export function useWidgetAppear
<T extends z.ZodObject<any> | undefined = undefined>()
: AnimationParameters<T> | undefined  
{
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetAppear must be called in WidgetProvider')
  }
  return context.appear
}

export function useWidgetDisappear
  <T extends z.ZodObject<any> | undefined = undefined>()
  : AnimationParameters<T> | undefined  
{
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetDisappear must be called in WidgetProvider')
  }
  return context.disappear
}

export function useWidgetStyles(): WidgetStyles {
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetStyles must be called in WidgetProvider')
  }
  return context.styles;
}

export function useWidgetParameters
  <T extends z.ZodObject<any>>(): WidgetParameters<T>  {
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetParameters must be called in WidgetProvider')
  }
  return context.parameters;
}