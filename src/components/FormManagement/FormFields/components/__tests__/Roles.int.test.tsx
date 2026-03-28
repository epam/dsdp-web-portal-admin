import {
  describe, expect, it, vi, beforeEach,
} from 'vitest';
import React from 'react';
import { portalRender, fireEvent } from '#shared/utils/testUtils';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import Roles from '../Roles';

const useFormContextMock = vi.mocked(useFormContext);
const useWatchMock = vi.mocked(useWatch);
const ControllerMock = vi.mocked(Controller);
vi.mock('react-hook-form', async (importOriginal) => {
  const reactHookForm: typeof import('react-hook-form') = await importOriginal();
  return {
    ...reactHookForm,
    useFormContext: vi.fn(),
    useWatch: vi.fn(),
    Controller: vi.fn(),
  };
});

describe('Roles', () => {
  const register = vi.fn();
  const setValue = vi.fn();
  const getValues = vi.fn();
  const watch = vi.fn();
  const clearErrors = vi.fn();
  const setError = vi.fn();

  beforeEach(() => {
    useFormContextMock.mockReturnValue({
      control: vi.fn(), register, setValue, getValues, watch, formState: { errors: {} }, clearErrors, setError,
    });
    useWatchMock.mockReturnValue({ roles: [], roleName: '' });
    ControllerMock.mockImplementation(({ render: controllerRender }) => {
      const Component = controllerRender({ field: { name: 'roleName', value: '', onChange: vi.fn() } });
      return Component;
    });
  });

  it('should be defined', () => {
    const wrapper = portalRender(<Roles isReadOnly={false} />);
    expect(wrapper).toBeDefined();
  });

  it('should render roles', () => {
    useWatchMock.mockReturnValueOnce('Some role name');
    useWatchMock.mockReturnValueOnce(['Admin', 'User']);
    const { getByText } = portalRender(<Roles isReadOnly={false} />);
    expect(getByText('Admin')).toBeInTheDocument();
    expect(getByText('User')).toBeInTheDocument();
  });

  it('should add a role on button click', () => {
    useWatchMock.mockReturnValueOnce('some new role');
    useWatchMock.mockReturnValueOnce(['Admin', 'User']);
    const { getByTestId } = portalRender(<Roles isReadOnly={false} />);
    fireEvent.click(getByTestId('addRoleBtn'));
    expect(setValue).toHaveBeenCalledWith('roles', ['some new role', 'Admin', 'User']);
    expect(setValue).toHaveBeenCalledWith('roleName', '');
  });

  it('should not add a role if roleName is empty', () => {
    useWatchMock.mockReturnValueOnce('');
    useWatchMock.mockReturnValueOnce(['Admin', 'User']);
    const { getByTestId } = portalRender(<Roles isReadOnly={false} />);
    fireEvent.click(getByTestId('addRoleBtn'));
    expect(setError).toHaveBeenCalledWith('roleName', { type: 'required', message: 'errors~form.fieldIsRequired' });
  });

  it('should delete a role', () => {
    useWatchMock.mockReturnValueOnce('');
    useWatchMock.mockReturnValueOnce(['Admin', 'User']);
    const { getAllByTestId } = portalRender(<Roles isReadOnly={false} />);
    fireEvent.click(getAllByTestId('chipDeleteIcon')[0]);
    expect(setValue).toHaveBeenCalledWith('roles', ['User']);
    expect(clearErrors).toHaveBeenCalledWith('roleName');
  });

  it('should not add a duplicate role', () => {
    useWatchMock.mockReturnValueOnce('Admin');
    useWatchMock.mockReturnValueOnce(['Admin']);
    const { getByTestId } = portalRender(<Roles isReadOnly={false} />);
    fireEvent.click(getByTestId('addRoleBtn'));
    expect(setError).toHaveBeenCalledWith('roleName', { type: 'required', message: 'errors~form.roleAlreadyExists' });
  });

  it('should add a role on Enter key press', () => {
    useWatchMock.mockReturnValueOnce('new super role');
    useWatchMock.mockReturnValueOnce(['Admin']);
    const { getByPlaceholderText } = portalRender(<Roles isReadOnly={false} />);
    const input = getByPlaceholderText('form.fields.enterRoleName');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(setValue).toHaveBeenCalledWith('roles', ['new super role', 'Admin']);
    expect(setValue).toHaveBeenCalledWith('roleName', '');
  });
});
