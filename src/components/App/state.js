import { proxy } from 'valtio';

export const appState = proxy({
  hasScroll: false,
  activeIndex: 0,
});
