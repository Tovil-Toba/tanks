export const formatActionButton = (button: string): string => {
  button = button.replace('Key', '');
  button = button.replace('ArrowUp', '↑');
  button = button.replace('ArrowRight', '→');
  button = button.replace('ArrowDown', '↓');
  button = button.replace('ArrowLeft', '←');

  return button;
};
