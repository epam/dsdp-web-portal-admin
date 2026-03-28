export type TableListItem = {
  name: string,
  description: string,
  objectReference: boolean,
  historyFlag: boolean
};

export enum TableModeCode {
  common = 'common',
  columns = 'columns',
  indexes = 'indexes',
}
export type TableTab = {
  code: TableModeCode;
  title: string;
};

export type RegistryTableColumn = {
  name: string,
  description: string,
  type: string,
  defaultValue: string,
  notNullFlag: boolean,
  tableName: string,
};

export type RegistryTableIndexColumn = {
  name: string,
  sorting: string,
};

export type RegistryTableIndex = {
  name: string,
  columns: RegistryTableIndexColumn[],
  tableName: string,
};

export type RegistryTableIndexWithRule = {
  name: string,
  columns: RegistryTableIndexColumn[],
  tableName: string,
  rule: string,
};

export type RegistryTable = TableListItem & {
  columns: Record<string, RegistryTableColumn>
  indices: Record<string, RegistryTableIndex>
  primaryKey: RegistryTableIndex
  uniqueConstraints: Record<string, RegistryTableIndex>
};
