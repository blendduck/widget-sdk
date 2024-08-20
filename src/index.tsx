import React from 'react';
import * as z from "zod";
export * from "./context";
export * from "./methods";
export * from "./signal";
export * from "./panel";

export interface InspectorDefinition<T extends z.ZodObject<any>> {
  schema: T,
  fieldConfig: Record<string, any>
}

export interface PanelDefinition {
  Panel: React.FC,
  options: {
    name: string,
    icon: React.ReactElement,
  },
}

export interface WidgetDefinition<
  T extends z.ZodObject<any>,
  U extends z.ZodObject<any> | undefined = undefined,
  V extends z.ZodObject<any> | undefined = undefined
> {
  name: string;
  Widget: React.FC;
  parameters?: InspectorDefinition<T>;
  appear?: InspectorDefinition<U extends z.ZodObject<any> ? U : never>;
  disappear?: InspectorDefinition<V extends z.ZodObject<any> ? V : never>;
}

export class WidgetLibrary {
  id: string;
  version: string;
  widgets: Record<string, WidgetDefinition<any, any, any>>;
  panel?: PanelDefinition;
  
  constructor(id: string, version: string) {
    this.id = id;
    this.version = version;
    this.widgets = {};
  }
  register(definition: WidgetDefinition<any, any, any>) {
    this.widgets[definition.name] = definition;
  }
  setPanel(Panel: React.FC, options?: any) {
    this.panel = { Panel, options }
  }
}