import { FormType, Form as MdtuForm } from '#web-components/components/Form/types';
import { FormioModule } from '#web-components/components/Form';

export type Form = MdtuForm & {
  _id: string;
};

export interface FormListItem {
  name: string,
  title: string,
  created: string,
  updated: string,
  ETag?: string,
}

export type ExportForm = Pick<Form, 'type' | 'components' | 'submissionAccess' | 'title' | 'path' | 'name' | 'display'>;

export interface FormDetails {
  title: string;
  path: string;
  type: { value: FormType, label: FormType };
  roles: string[];
  showOnCardList: boolean;
  formSchema: Form,
  jsonScheme?: string,
  jsonSchemeIsInValid?: boolean,
}

export type FormioModuleComponents = typeof FormioModule.components;

export enum FormModeCode {
  common = 'common',
  code = 'code',
  modeler = 'modeler',
  preview = 'preview',
  query = 'query',
}
export type FormTabs = Array<{ code: FormModeCode, title: string }>;
