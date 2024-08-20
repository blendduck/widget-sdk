import React from "react";

export type PanelState<T = undefined> = {
  state: T,
  setState: (state: T) => void,
}

export const PanelContext = React.createContext<PanelState<any> | null>(null);

export function usePanelState<T = any>(initialState?: T): PanelState<T>  
{
  const context = React.useContext(PanelContext);
  if (!context) {
    throw new Error('usePanelState must be called in PanelProvider')
  }
  const { state, setState } = context;

  return {
    state: (state ?? initialState) as T,
    setState: setState as PanelState<T>['setState']
  };
}