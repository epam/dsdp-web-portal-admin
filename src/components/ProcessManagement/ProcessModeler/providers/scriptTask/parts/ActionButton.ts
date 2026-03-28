import './style.css';

export default function ActionButton(
  element: Record<string, unknown>,
  translate: (value: string) => string,
  onClick: () => void,
) {
  return {
    element,
    onClick,
    component: 'button',
    class: 'bio-properties-panel-group-header-button bio-properties-panel-select-template-button action-btn',
    children: translate('Open script editor'),
  };
}
