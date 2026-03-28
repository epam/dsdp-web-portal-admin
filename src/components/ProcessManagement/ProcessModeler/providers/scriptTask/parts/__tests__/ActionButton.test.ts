import {
  describe, expect, it, vi,
} from 'vitest';
import ActionButton from '../ActionButton';

describe('ActionButton', () => {
  it('should be defined', () => {
    const actionButton = ActionButton({}, vi.fn(), vi.fn());
    expect(actionButton).toBeDefined();
    expect(actionButton.component).toBe('button');
    expect(actionButton.class).toBe(
      'bio-properties-panel-group-header-button bio-properties-panel-select-template-button action-btn',
    );
  });
});
