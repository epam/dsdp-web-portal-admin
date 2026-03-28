import { BpModelerTemplate } from './config';

export interface ProcessListItem {
  name: string,
  title: string,
  created: string,
  updated: string,
  ETag?: string,
}

export enum ProcessModeCode {
  common = 'common',
  code = 'code',
  modeler = 'modeler',
}
export type ProcessTab = {
  code: ProcessModeCode;
  title: string;
};
export type ProcessFormData = {
  formProcessString: string;
  name: string;
  title: string;
  isXmlValid: boolean;
};

export interface Modeler {
  on(name: string, cb: (value: Element) => void): void,
  off(name: string, cb: () => void): void,
  getDefinitions(): void,
  destroy(): void,
  get<T = Record<string, unknown>>(name: string): {
    on(event: string, cb: (value: T) => void): void,
    fire(name: string, value: T): void,
    off(event: string, cb: (value: T) => void): void,
    zoom(name: string): void,
    get(id: string): Element,
    add(name: string, type: string, params: {
      position: {
        bottom?: number,
        left?: number,
        top?: number,
        right?: number,
      },
      html: string,
    }): void,
    viewbox(element?: Element | number) : Element | number,
    remove(value: { type: string }): void,
    addMarker(elementId: string, marker: string): void,
    removeMarker(elementId: string, marker: string): void,
    getRootElement(): Element,
    setTemplates(templates: BpModelerTemplate[]): void,
    getGraphics(id: string): { addEventListener: (event: string, cb: () => void) => void },
    _elements: { secondaryGfx: HTMLElement, gfx: HTMLElement }[]
  },
  importXML(diagram: string): Promise<void>,
  saveXML({ format }: { format: boolean }): Promise<{ xml: string }>
  loading: boolean,
}

export interface EventBus<T> {
  on(name: string, cb: (value: T) => void): void,
  off(name: string, cb: (value: T) => void): void,
  fire(name: string, value: T): void,
}

export type ScriptTask = {
  script: string,
  id: string
};

export enum BPMN_EVENT {
  GET_SCRIPT = 'GET_SCRIPT',
  SAVE_SCRIPT = 'SAVE_SCRIPT',
}

export interface Element {
  width: number
  height: number
  x: number,
  y: number,
  waypoints?: { x: number, y: number }[],
  viewbox?: number,
}

export interface ChangedElement {
  elementId: string,
  type: string,
  $type?: string,
  label: string
  name?: string
  model: {
    $type?: string,
  }
}

export interface СhangeDetails {
  id: string,
  attribute: string,
  changes: {
    oldValue: string,
    newValue: string
  }
}

export interface Marker {
  className: string,
  symbol: string,
}
