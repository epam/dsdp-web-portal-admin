import { ERROR_TYPE } from '#shared/types/common';
import { createSelector } from 'reselect';
import {
  createAsyncActionAllErrorsSelector,
  createAsyncActionIsLoadedSelector, createAsyncActionIsLoadingSelector,
} from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import { RegistryTableIndex, RegistryTableIndexColumn } from 'types/table';
import {
  getTableByNameRequest,
  getTableListRequest,
  getTableDataModelRequest,
  updateTableDataModelRequest,
} from './slice';

export const selectTablesState = (state: RootState) => state.tables;

export const selectTablesList = createSelector(
  selectTablesState,
  (tables) => tables.list,
);

export const selectRegistryTable = createSelector(
  selectTablesState,
  (state) => state.table,
);

export const selectTablesListPageIsLoading = createAsyncActionIsLoadingSelector(
  getTableListRequest.type,
);

export const selectTableEditPageIsLoading = createAsyncActionIsLoadingSelector(
  getTableByNameRequest.type,
);

export const selectRegistryTableIndexes = createSelector(
  selectRegistryTable,
  (table) => {
    if (table) {
      const indexTableItems: RegistryTableIndex[] = Object.values(table.indices) || [];
      const uniqueTableItems: RegistryTableIndex[] = Object.values(table.uniqueConstraints) || [];
      const indexes: RegistryTableIndex[] = [...indexTableItems, ...uniqueTableItems];

      if (table.primaryKey) {
        indexes.push(table.primaryKey);
      }
      return indexes.map((index) => {
        const { columns } = index;
        const rules = columns.reduce((rule: string[], { name, sorting }: RegistryTableIndexColumn) => {
          return [...rule, `"${name}" ${sorting}`];
        }, []);
        return { ...index, rule: `${rules.join(', ')}` };
      });
    }
    return [];
  },
);

export const selectDataModel = createSelector(
  selectTablesState,
  (state) => state.dataModel,
);

export const selectDataModelIsLoading = createAsyncActionIsLoadingSelector(
  getTableDataModelRequest.type,
);

export const selectComponentError = (action: string) => createSelector(
  createAsyncActionAllErrorsSelector(action),
  (errors) => {
    if (errors) {
      const criticalErrors = errors.filter(({ type }) => type === ERROR_TYPE.COMPONENT);
      return criticalErrors.length && criticalErrors[0].message;
    }
    return null;
  },
);

export const selectUpdateDataModelIsLoading = createAsyncActionIsLoadingSelector(
  updateTableDataModelRequest.type,
);

export const selectDataModelIsLoaded = createAsyncActionIsLoadedSelector(
  getTableDataModelRequest.type,
);
export const selectDataModelCriticalError = selectComponentError(getTableDataModelRequest.type);

export const selectTablesListPageCriticalError = selectComponentError(getTableListRequest.type);
