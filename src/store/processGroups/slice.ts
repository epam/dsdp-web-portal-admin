import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { ProcessDefinition, ProcessDefinitionGroupData } from '#shared/types/processDefinition';
/* eslint-disable no-param-reassign */

const ACTION_PREFIX = 'process';

export interface ProcessGroupsState {
  groupData: ProcessDefinitionGroupData,
  groupDataEdit: ProcessDefinitionGroupData,
}

const initialState: ProcessGroupsState = {
  groupData: {
    groups: [],
    ungrouped: [],
  },
  groupDataEdit: {
    groups: [],
    ungrouped: [],
  },
};

export const getProcessGroupDataRequest = createAction<string>(`${ACTION_PREFIX}/getProcessGroupDataRequest`);
export const getProcessGroupDataError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getProcessGroupDataError`);

export const saveProcessGroupDataRequest = createAction<{ groupData: ProcessDefinitionGroupData, versionId: string }>(
  `${ACTION_PREFIX}/saveProcessGroupDataRequest`,
);
export const saveProcessGroupDataError = createAction<ErrorInfo>(`${ACTION_PREFIX}/saveProcessGroupDataError`);

const ProcessGroupsSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getProcessGroupDataSuccess(state, action: PayloadAction<ProcessDefinitionGroupData>) {
      return {
        ...state,
        groupData: action.payload,
        groupDataEdit: action.payload,
      };
    },
    getProcessGroupDataClean() {
      return {
        ...initialState,
      };
    },
    saveProcessGroupDataSuccess(state) {
      return {
        ...state,
        groupData: state.groupDataEdit,
      };
    },
    cancelGroupDataEdit(state) {
      return {
        ...state,
        groupDataEdit: state.groupData,
      };
    },
    groupActionNewGroup(state, action: PayloadAction<string>) {
      state.groupDataEdit.groups.push({ name: action.payload, processDefinitions: [] });
    },
    groupActionEditGroup(state, action: PayloadAction<{ name: string, newName: string }>) {
      const { name, newName } = action.payload;
      const currentIndex = state.groupDataEdit.groups.findIndex((group) => group.name === name);
      state.groupDataEdit.groups[currentIndex].name = newName;
    },
    groupActionMoveGroupUp(state, action: PayloadAction<string>) {
      const currentIndex = state.groupDataEdit.groups.findIndex((group) => group.name === action.payload);
      if (currentIndex && currentIndex !== -1) {
        const newIndex = currentIndex - 1;
        const group = state.groupDataEdit.groups[currentIndex];
        state.groupDataEdit.groups.splice(currentIndex, 1);
        state.groupDataEdit.groups.splice(newIndex, 0, group);
      }
    },
    groupActionMoveGroupDown(state, action: PayloadAction<string>) {
      const currentIndex = state.groupDataEdit.groups.findIndex((group) => group.name === action.payload);
      if (currentIndex !== -1 && currentIndex < state.groupDataEdit.groups.length - 1) {
        const newIndex = currentIndex + 1;
        const group = state.groupDataEdit.groups[currentIndex];
        state.groupDataEdit.groups.splice(currentIndex, 1);
        state.groupDataEdit.groups.splice(newIndex, 0, group);
      }
    },
    groupActionMoveProcessUp(state, action: PayloadAction<{ groupName?: string; processId: string }>) {
      const { groupName, processId } = action.payload;
      const group = state.groupDataEdit.groups.find((g) => g.name === groupName);
      const list: Array<ProcessDefinition> = group ? group.processDefinitions : state.groupDataEdit.ungrouped;
      const currentIndex = list.findIndex(({ id }) => id === processId);

      if (currentIndex && currentIndex !== -1) {
        const newIndex = currentIndex - 1;
        const processName = list[currentIndex];
        list.splice(currentIndex, 1);
        list.splice(newIndex, 0, processName);
      }
    },
    groupActionMoveProcessDown(state, action: PayloadAction<{ groupName?: string; processId: string }>) {
      const { groupName, processId } = action.payload;
      const group = state.groupDataEdit.groups.find((g) => g.name === groupName);
      const list: Array<ProcessDefinition> = group ? group.processDefinitions : state.groupDataEdit.ungrouped;
      const currentIndex = list.findIndex(({ id }) => id === processId);

      if (currentIndex !== -1 && currentIndex < list.length - 1) {
        const newIndex = currentIndex + 1;
        const processDefinition = list[currentIndex];
        list.splice(currentIndex, 1);
        list.splice(newIndex, 0, processDefinition);
      }
    },
    groupActionDeleteGroup(state, action: PayloadAction<string>) {
      const currentIndex = state.groupDataEdit.groups.findIndex((g) => g.name === action.payload);
      const group = state.groupDataEdit.groups[currentIndex];
      const processDefinitions = group?.processDefinitions;

      if (currentIndex !== -1) {
        state.groupDataEdit.groups.splice(currentIndex, 1);
        state.groupDataEdit.ungrouped = state.groupDataEdit.ungrouped.concat(processDefinitions);
      }
    },
    groupActionMoveProcess(state, action: PayloadAction<{
      processDefinition: ProcessDefinition,
      groupName: string,
      currentGroup?: string,
    }>) {
      const { groupName, processDefinition, currentGroup } = action.payload;
      const { id: processId } = processDefinition;
      const current = state.groupDataEdit.groups.find((g) => g.name === currentGroup);
      const currentList: Array<ProcessDefinition> = current
        ? current.processDefinitions
        : state.groupDataEdit.ungrouped;
      const currentIndex = currentList.findIndex(({ id }) => id === processId);
      const group = state.groupDataEdit.groups.find((g) => g.name === groupName);
      const list: Array<ProcessDefinition> = group ? group.processDefinitions : state.groupDataEdit.ungrouped;

      currentList.splice(currentIndex, 1);
      list.push(processDefinition);
    },
    groupActionNewGroupWithProcess(state, action: PayloadAction<{
      processDefinition: ProcessDefinition,
      groupName: string,
      currentGroup?: string,
    }>) {
      const { groupName, processDefinition, currentGroup } = action.payload;
      const { id: processId } = processDefinition;
      const group = state.groupDataEdit.groups.find((g) => g.name === currentGroup);
      const list: Array<ProcessDefinition> = group ? group.processDefinitions : state.groupDataEdit.ungrouped;
      const currentIndex = list.findIndex(({ id }) => id === processId);

      list.splice(currentIndex, 1);

      state.groupDataEdit.groups.push({
        name: groupName, processDefinitions: [processDefinition],
      });
    },
    groupActionMoveToUngrouped(state, action: PayloadAction<{
      processDefinition: ProcessDefinition,
      groupName: string,
    }>) {
      const { groupName, processDefinition } = action.payload;
      const { id: processId } = processDefinition;
      const current = state.groupDataEdit.groups.find((g) => g.name === groupName);
      const currentList: Array<ProcessDefinition> = current
        ? current.processDefinitions
        : state.groupDataEdit.ungrouped;
      const currentIndex = currentList.findIndex(({ id }) => id === processId);

      currentList.splice(currentIndex, 1);
      state.groupDataEdit.ungrouped.push(processDefinition);
    },
  },
});

export default ProcessGroupsSlice.reducer;

export const {
  getProcessGroupDataSuccess,
  getProcessGroupDataClean,
  groupActionNewGroup,
  groupActionMoveGroupUp,
  groupActionMoveGroupDown,
  groupActionDeleteGroup,
  groupActionEditGroup,
  groupActionMoveProcessUp,
  groupActionMoveProcessDown,
  groupActionMoveProcess,
  saveProcessGroupDataSuccess,
  cancelGroupDataEdit,
  groupActionNewGroupWithProcess,
  groupActionMoveToUngrouped,
} = ProcessGroupsSlice.actions;
