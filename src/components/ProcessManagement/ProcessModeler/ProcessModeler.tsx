import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ElementTemplatesPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import ElementTemplateChooserModule from '@bpmn-io/element-template-chooser';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import { makeStyles } from '@material-ui/core';
import {
  BPMN_EVENT, EventBus, Modeler, ScriptTask,
} from 'types/processes';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { getProcessObj } from 'utils/process';
import { getBpModelerTemplatesRequest, selectBpModelerTemplates, selectBpModelerTemplatesIsLoaded } from 'store/config';
import providers from './providers';
import ModalWebEditor from './components/ModalWebEditor';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import '@bpmn-io/element-template-chooser/dist/element-template-chooser.css';
import ProcessValidationMessage from '../ProcessValidationMessage';
import styles from './ProcessModeler.styles';

export interface ProcessModelerProps {
  isReadonly?: boolean,
}

const useStyles = makeStyles(styles, { name: 'ProcessModeler' });

export default function ProcessModeler({ isReadonly }: ProcessModelerProps) {
  const classes = useStyles();
  const { getValues, setValue } = useFormContext();
  const dispatch = useDispatch();
  const bpModelerTemplates = useSelector(selectBpModelerTemplates);
  const isBpModelerTemplatesLoaded = useSelector(selectBpModelerTemplatesIsLoaded);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const propertiesPanelRef = useRef<HTMLDivElement | null>(null);
  const modeler = useRef<Modeler | null>(null);
  const eventBus = useRef<EventBus<ScriptTask> | null>(null);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState<string | null>(null);
  const [scriptTaskInfo, setScriptTaskInfo] = useState<ScriptTask>({
    script: '',
    id: '',
  });

  useEffect(() => {
    const container = containerRef.current;
    const propertiesPanel = propertiesPanelRef.current;

    modeler.current = new BpmnModeler({
      container,
      propertiesPanel: {
        parent: propertiesPanel,
      },
      keyboard: {
        bindTo: window,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        ElementTemplatesPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        ElementTemplateChooserModule,
        providers.ScriptTaskPropertiesProvider,
      ],
      moddleExtensions: {
        camunda: CamundaBpmnModdle,
      },
    });
    return () => modeler.current?.destroy();
  }, []);

  useEffect(() => {
    const openDiagram = async () => {
      if (isBpModelerTemplatesLoaded) {
        try {
          const processString = getValues('formProcessString');
          await modeler.current?.importXML(processString);
          modeler.current?.get('canvas').zoom('fit-viewport');
          const sortedTemplates = sortBy(bpModelerTemplates, (t) => (t.name.includes('[DEPRECATED]') ? 1 : 0));
          modeler.current?.get('elementTemplatesLoader').setTemplates(sortedTemplates);
        } catch (err) {
          setError((err as Error).message);
        }
      }
    };
    openDiagram();
  }, [bpModelerTemplates, dispatch, getValues, isBpModelerTemplatesLoaded]);
  useEffect(() => {
    if (!isBpModelerTemplatesLoaded) {
      dispatch(getBpModelerTemplatesRequest());
    }
  }, [dispatch, isBpModelerTemplatesLoaded]);

  useEffect(() => {
    const saveXML = debounce(async () => {
      const data = await modeler.current?.saveXML({ format: true });
      const { id, name } = await getProcessObj(data?.xml as string);
      setValue('formProcessString', data?.xml);
      setValue('name', id, { shouldDirty: true, shouldValidate: true });
      setValue('title', name, { shouldDirty: true, shouldValidate: true });
    }, 500);

    modeler.current?.on('commandStack.changed', saveXML);

    return () => modeler.current?.off('commandStack.changed', saveXML);
  }, [setValue]);

  useEffect(() => {
    const handleEvent = (event: ScriptTask) => {
      setIsOpen(true);
      setScriptTaskInfo({ script: event.script, id: event.id });
    };
    eventBus.current = modeler.current?.get('eventBus') as EventBus<ScriptTask>;
    eventBus.current?.on(BPMN_EVENT.GET_SCRIPT, handleEvent);

    return () => eventBus.current?.off(BPMN_EVENT.GET_SCRIPT, handleEvent);
  }, []);

  const handleSave = useCallback(() => {
    const script = editorValue ?? scriptTaskInfo.script;
    eventBus.current?.fire(BPMN_EVENT.SAVE_SCRIPT, { script, id: scriptTaskInfo.id });
    setEditorValue(null);
  }, [editorValue, scriptTaskInfo.id, scriptTaskInfo.script]);

  if (error) {
    return (
      <ProcessValidationMessage />
    );
  }

  return (
    <div className={classes.modeler}>
      <div ref={containerRef} className={classes.canvas} />
      <div ref={propertiesPanelRef} className={classes.propertiesPanel} />

      <ModalWebEditor
        isOpen={isOpen}
        value={scriptTaskInfo.script}
        onOpenChange={setIsOpen}
        onChangeEditor={setEditorValue}
        onSave={handleSave}
        isReadonly={isReadonly}
      />
    </div>
  );
}
