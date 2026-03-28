/* eslint-disable no-restricted-globals */

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

// make it global
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    switch (label) {
      case 'json':
        return new JsonWorker();
      default:
        return new EditorWorker();
    }
  },
};
