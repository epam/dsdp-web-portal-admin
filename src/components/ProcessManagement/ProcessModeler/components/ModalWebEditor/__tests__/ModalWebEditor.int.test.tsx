import React from 'react';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  describe, it, expect, vi,
} from 'vitest';
import {
  portalRender,
  fireEvent,
} from '#shared/utils/testUtils';
import ModalWebEditor from '../ModalWebEditor';

const mockState = getCommonReduxMockState({});

describe('ModalWebEditor', () => {
  const props = {
    isOpen: true,
    onOpenChange: vi.fn(),
    value: '',
    onSave: vi.fn(),
    onChangeEditor: vi.fn(),
  };
  it('should be defined', () => {
    const wrapper = portalRender(<ModalWebEditor {...props} />, { preloadedState: mockState });
    expect(wrapper).toBeDefined();
  });

  it('if not readonly mode equal false', () => {
    const wrapper = portalRender(<ModalWebEditor {...props} />, { preloadedState: mockState });
    expect(wrapper.getByText('process.actions.save')).toBeInTheDocument();
    expect(wrapper.getByText('process.text.editScript')).toBeInTheDocument();
  });

  it('if readonly mode equal true', () => {
    const wrapper = portalRender(<ModalWebEditor {...props} isReadonly />, { preloadedState: mockState });
    expect(wrapper.queryByText('process.text.save')).not.toBeInTheDocument();
    expect(wrapper.getByText('process.text.viewScript')).toBeInTheDocument();
  });

  it('should switch to fullscreen mode', async () => {
    const wrapper = portalRender(<ModalWebEditor {...props} />, { preloadedState: mockState });
    expect(wrapper.getByTestId('fullscreen')).toBeInTheDocument();
    fireEvent.click(wrapper.getByTestId('fullscreen'));
    expect(wrapper.getByTestId('fullscreenExit')).toBeInTheDocument();
    fireEvent.click(wrapper.getByTestId('fullscreenExit'));
    expect(wrapper.getByTestId('fullscreen')).toBeInTheDocument();
  });

  it('should exit from fullscreen mode after click to Escape button', async () => {
    const wrapper = portalRender(<ModalWebEditor {...props} />, { preloadedState: mockState });
    expect(wrapper.getByTestId('fullscreen')).toBeInTheDocument();
    fireEvent.click(wrapper.getByTestId('fullscreen'));

    fireEvent.click(wrapper.getByTestId('fullscreenExit'));

    fireEvent.keyDown(document, {
      key: 'Escape',
    });

    expect(wrapper.getByTestId('fullscreen')).toBeInTheDocument();
  });
});
