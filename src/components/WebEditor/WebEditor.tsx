import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { LANGUAGES } from 'types/common';
import { isGlobal } from 'utils/region';

import { registerGroovyLanguageForMonaco } from './languages/groovy';
import LanguageServer from './LanguageServer.service';
import './monacoSetup';

const EDITOR_THEME = 'vs-dark';

type WebEditorProps = {
  value: string,
  onChange: (value: string) => void,
  language: LANGUAGES,
  heightRatio: number,
  path?: string,
  onValidate?: (value: boolean) => void,
  isReadOnly?: boolean
};

export default function WebEditor({
  value,
  onChange,
  language,
  heightRatio,
  path = '',
  isReadOnly = false,
  onValidate = () => null,
}: WebEditorProps) {
  const editorRef = useRef<null | HTMLDivElement>(null);
  const monacoRef = useRef<null | monaco.editor.IStandaloneCodeEditor>(null);
  const modelEditorRef = useRef<null | monaco.editor.ITextModel>(null);

  useEffect(() => {
    const subscriptions: monaco.IDisposable[] = [];
    function setOneMarker(
      markers: monaco.editor.IMarker[],
    ) {
      monaco.editor.setModelMarkers(
        monacoRef.current?.getModel() as monaco.editor.ITextModel,
        markers[0].owner,
        [markers[0]],
      );
    }

    function initEditor() {
      if (editorRef.current) {
        const uri = path ? monaco.Uri.file(path) : undefined;
        modelEditorRef.current = monaco.editor.createModel(
          value,
          language,
          uri,
        );
        monacoRef.current = monaco.editor.create(editorRef.current, {
          model: modelEditorRef.current,
          theme: EDITOR_THEME,
          automaticLayout: true,
          readOnly: isReadOnly,
        });

        monacoRef.current.focus();

        subscriptions[0] = monacoRef.current?.onDidChangeModelContent(() => {
          onChange(monacoRef.current?.getValue() || '');
        });

        subscriptions[1] = monaco.editor.onDidChangeMarkers(() => {
          const markers = monaco.editor.getModelMarkers({ resource: uri });

          onValidate(!!markers.length);

          if (markers.length > 1 && language === LANGUAGES.GROOVY) {
            setOneMarker(markers);
          }
        });
      }
    }

    initEditor();

    return () => {
      modelEditorRef.current?.dispose();
      monacoRef.current?.dispose();
      subscriptions.forEach((subscription) => subscription.dispose());
    };
  }, [isReadOnly, language, onChange, onValidate, path, value]);

  useEffect(() => {
    const languageClient = new LanguageServer(language);
    languageClient.createWebSocket();
    return () => {
      languageClient.closeWebSocket();
    };
  }, [language]);

  useEffect(() => {
    const groovyProvider = registerGroovyLanguageForMonaco(isGlobal(ENVIRONMENT_VARIABLES.region));
    return () => {
      groovyProvider.dispose();
    };
  }, []);

  return (
    <div
      ref={editorRef}
      style={{ height: `calc(100vh - ${heightRatio}px)` }}
    />
  );
}
