/* eslint-disable @typescript-eslint/no-explicit-any */
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { LANGUAGES } from 'types/common';
import {
  BPMN_EVENT, EventBus, ScriptTask,
} from 'types/processes';
import ActionButton from './parts/ActionButton';

const LOW_PRIORITY = 500;

type BusinessObj = { get: (name: string) => string; };

function isScript(element: Record<string, unknown>) {
  return is(element, 'camunda:Script');
}

function getScriptProperty(businessObject: BusinessObj) {
  return isScript(businessObject) ? 'value' : 'script';
}

function getScriptValue(businessObject: BusinessObj) {
  return businessObject.get(getScriptProperty(businessObject));
}

function getTaskId(businessObject: BusinessObj) {
  return businessObject.get('id');
}

function filterScriptProperties(id: string) {
  return !(['scriptValue', 'scriptFormat', 'scriptType'].includes(id));
}

function processGroups(
  groups: { label: string, entries: Record<string, unknown>[] }[],
  element: Record<string, unknown>,
  translate: (value: string) => string,
  eventBus: EventBus<ScriptTask>,
  scriptValue: string,
  taskId: string,
) {
  return groups.map((group) => {
    if (is(element, 'bpmn:ScriptTask') && group.label === 'Script') {
      return {
        ...group,
        entries: [
          ...group.entries.filter(({ id }) => filterScriptProperties(id as string)),
          ActionButton(element, translate, () => {
            eventBus.fire(BPMN_EVENT.GET_SCRIPT, {
              script: scriptValue,
              id: taskId,
            });
          }),
        ],
      };
    }
    return group;
  });
}

export default function ScriptTaskPropertiesProvider(
  this: any,
  propertiesPanel: { registerProvider: (priority: number, instance: any) => void; },
  translate: (value: string) => string,
  eventBus: EventBus<ScriptTask>,
  commandStack: { execute: (name: string, obj: Record<string, unknown>) => void },
) {
  this.getGroups = function getGroups(element: Record<string, unknown>) {
    const businessObject = getBusinessObject(element);
    const scriptValue = getScriptValue(businessObject);
    const scriptProperty = getScriptProperty(businessObject);
    const taskId = getTaskId(businessObject);

    if (is(element, 'bpmn:ScriptTask')) {
      businessObject.set('scriptFormat', LANGUAGES.GROOVY);
    }

    eventBus.on(BPMN_EVENT.SAVE_SCRIPT, ({ script, id }) => {
      if (businessObject.id === id) {
        commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: businessObject,
          properties: {
            [scriptProperty]: script || '',
          },
        });
      }
    });
    return (groups: { label: string, entries: Record<string, unknown>[] }[]) => processGroups(
      groups,
      element,
      translate,
      eventBus,
      scriptValue,
      taskId,
    );
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ScriptTaskPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'eventBus', 'commandStack'];
