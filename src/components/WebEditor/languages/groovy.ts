import * as monaco from 'monaco-editor';
import { registerRulesForLanguage } from 'monaco-ace-tokenizer';
import GroovyHighlightRules from 'monaco-ace-tokenizer/dist/definitions/groovy';

interface Range {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}

export function registerGroovyLanguageForMonaco(isGlobal: boolean): monaco.IDisposable {
  monaco.languages.register({
    id: 'groovy',
  });

  registerRulesForLanguage('groovy', new GroovyHighlightRules());

  function extendRegistryFuncProperties(textUntilPosition: string) {
    const match = textUntilPosition.match(/\b(?:registry\(\))\.(\w*)$/);
    if (!match) {
      return [];
    }
    return [{
      label: 'language',
      insertText: 'language',
    },
    {
      label: 'supportedLanguages',
      insertText: 'supportedLanguages',
    }];
  }

  function createDependencyGroovySuggestions(model: monaco.editor.ITextModel, range: Range) {
    const suggestions = [
      {
        label: 'set_transient_variable',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'set_transient_variable(${1:variableName}, ${2:variableValue})',
      },
      {
        label: 'completer',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'completer(${1:taskDefinitionKey})',
      },
      {
        label: 'sign_submission',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'sign_submission(${1:bpmnElementId})',
      },
      {
        label: 'submission',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'submission(${1:bpmnElementId})',
      },
      {
        label: 'get_variable',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'get_variable(${1:variableName})',
      }, {
        label: 'initiator',
        insertText: 'initiator()',
      }, {
        label: 'message_payload',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'message_payload(${1:bpmnElementId})',
      },
      {
        label: 'process_caller',
        insertText: 'process_caller()',
      },
      {
        label: 'set_variable',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'set_variable(${1:variableName}, ${2:variableValue})',
      },
      {
        label: 'system_user',
        insertText: 'system_user()',
      },
      {
        label: 'save_digital_document_from_url',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'save_digital_document_from_url(${1:remoteFileUrl}, ${2:targetFileName})',
      },
      {
        label: 'load_digital_document',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'load_digital_document(${1:documentId})',
      },
      {
        label: 'save_digital_document',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'save_digital_document(${1:content}, ${2:targetFileName})',
      },
      {
        label: 'get_digital_document_metadata',
        // eslint-disable-next-line no-template-curly-in-string
        insertText: 'get_digital_document_metadata(${1:documentId})',
      },
      {
        label: 'registry',
        insertText: 'registry()',
      },
    ];

    if (!isGlobal) {
      suggestions.push(
        {
          label: 'get_trembita_auth_token',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'get_trembita_auth_token(${1:registryName})',
        },
        {
          label: 'signature_content',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'signature_content(${1:data}, ${2:container})',
        },
        {
          label: 'signature_details',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'signature_details(${1:data}, ${2:container})',
        },
      );
    }

    const textUntilPosition = model.getValueInRange({
      startLineNumber: range.startLineNumber,
      startColumn: 1,
      endLineNumber: range.endLineNumber,
      endColumn: range.endColumn,
    });

    suggestions.push(
      ...extendRegistryFuncProperties(textUntilPosition),
    );

    return suggestions.map((item) => ({
      range,
      label: item.label,
      insertText: item.insertText,
      kind: monaco.languages.CompletionItemKind.Function,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: '',
    }));
  }

  return monaco.languages.registerCompletionItemProvider('groovy', {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: createDependencyGroovySuggestions(model, range),
      };
    },
  });
}
