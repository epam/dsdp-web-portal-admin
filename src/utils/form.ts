import { mapKeys } from 'lodash';
import { Components } from 'formiojs';

import { ExportForm, Form, FormioModuleComponents } from 'types/form';
import { FormComponent } from '#web-components/components/Form/types';
import { transformComponents } from '#web-components/components/Form/utils';

export function downloadObjectAsJson(exportObj: Record<string, unknown>, exportName: string) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj, null, 2))}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function formatFormForExport(form: Form): ExportForm {
  const fieldsToSave: Array<keyof ExportForm> = [
    'name',
    'path',
    'title',
    'type',
    'submissionAccess',
    'components',
    'display',
  ];
  const cleanForm = Object.fromEntries(
    Object.entries(form).filter(([key]) => fieldsToSave.includes(key as keyof ExportForm)),
  );
  return cleanForm as ExportForm;
}

export const createFieldCopy = (field?: string) => { return field ? `Copy_${field}` : ''; };

// in <componentName>Preview we store customized component, in <componentName> we store legacy component,
// but with settings from customized component
export function createBuilderAndPreviewComponents(
  components: FormioModuleComponents,
  componentKeys: Array<keyof FormioModuleComponents>,
) {
  const componentsWithPreview = mapKeys(components, (_value, key: keyof FormioModuleComponents) => {
    if (componentKeys.includes(key)) {
      return `${key}Preview`;
    }
    return key;
  });
  return {
    ...componentsWithPreview,
    ...Object.fromEntries(
      componentKeys.map((fullKey) => {
        const key = fullKey.replace('Latest', '');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ClassForExtend = key === 'select' ? Components.components.select : (components as any)[`${key}Legacy`];
        const updatedClass = class extends ClassForExtend {
          static editForm = componentsWithPreview[`${fullKey}Preview`].editForm;

          static get builderInfo() {
            return componentsWithPreview[`${fullKey}Preview`].builderInfo;
          }

          static schema = componentsWithPreview[`${fullKey}Preview`].schema;
        };
        return [
          fullKey,
          updatedClass,
        ];
      }),
    ),
  };
}

export function removeCustomClass(components: Array<FormComponent>): Array<FormComponent> {
  return transformComponents(components, (component) => ({
    ...component,
    customClass: '',
  }));
}
