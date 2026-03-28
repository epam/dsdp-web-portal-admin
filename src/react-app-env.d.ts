// / <reference types="react-scripts" />
interface EnvironmentVariables {
  apiUrl?: string;
  kibanaUrl?: string;
  userLoadLogFilter?: string;
  emailBlacklist?: Array<string>;
  languageServerUrl: string;
  digitalDocumentsMaxFileSize: string;
  digitalDocumentsMaxTotalFileSize: string;
  language: string;
  supportedLanguages: string[];
  region: string;
  cicdUrl: string;
  vcsUrl: string;
}

interface RegistryEnvironmentVariables {
  supportEmail: string;
  theme: string;
}

interface RegistrySettings {
  settings: {
    general: {
      title: string,
      titleFull: string,
    },
  },
}

interface ApplicationTheme {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
}

// eslint-disable-next-line
declare var ENVIRONMENT_VARIABLES: EnvironmentVariables;
// eslint-disable-next-line
declare var APPLICATION_THEME: ApplicationTheme;
// eslint-disable-next-line
declare var REGISTRY_ENVIRONMENT_VARIABLES: RegistryEnvironmentVariables;
// eslint-disable-next-line
declare var REGISTRY_SETTINGS: RegistrySettings;
declare module '*.png';
declare module '*.woff2';
declare module '*.svg';
declare module '*.svg?url' {
  const url: string;
  export default url;
}
declare module '*.svg?react' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
declare module '*.json';
declare module 'bpmn-moddle';
declare module 'bpmn-js-properties-panel';
declare module 'bpmn-js/*';
declare module '@bpmn-io/element-template-chooser';
declare module 'monaco-ace-tokenizer/*';
declare module 'monaco-ace-tokenizer';
interface ImportMeta {
  readonly env: Record<string, string>;
}

declare module '*?worker' {
  const WorkerFactory: {
    new (): Worker;
  };
  export default WorkerFactory;
}
