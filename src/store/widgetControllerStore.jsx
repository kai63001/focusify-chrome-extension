import { create } from "zustand";

const useWidgetControllerStore = create((set, get) => ({
  listWidgetOpened: [],
  addWidget: (widgetName, position) =>
    set((state) => {
      const newList = [...state.listWidgetOpened, { name: widgetName, zIndex: state.listWidgetOpened.length, position }];
      localStorage.setItem('widgetState', JSON.stringify(newList));
      return { listWidgetOpened: newList };
    }),
  removeWidget: (widgetName) =>
    set((state) => {
      const newList = state.listWidgetOpened.filter((widget) => widget.name !== widgetName);
      localStorage.setItem('widgetState', JSON.stringify(newList));
      return { listWidgetOpened: newList };
    }),
  isWidgetOpen: (widgetName) => (state) =>
    state.listWidgetOpened.some((widget) => widget.name === widgetName),
  bringToFront: (widgetName) =>
    set((state) => {
      const newList = state.listWidgetOpened.map((widget) =>
        widget.name === widgetName
          ? { ...widget, zIndex: state.listWidgetOpened.length - 1 }
          : { ...widget, zIndex: widget.zIndex > 0 ? widget.zIndex - 1 : 0 }
      );
      localStorage.setItem('widgetState', JSON.stringify(newList));
      return { listWidgetOpened: newList };
    }),
  getWidgetZIndex: (widgetName) => (state) =>
    state.listWidgetOpened.find((widget) => widget.name === widgetName)?.zIndex ?? 0,
  updateWidgetPosition: (widgetName, position) =>
    set((state) => {
      const newList = state.listWidgetOpened.map((widget) =>
        widget.name === widgetName ? { ...widget, position } : widget
      );
      localStorage.setItem('widgetState', JSON.stringify(newList));
      return { listWidgetOpened: newList };
    }),
  initializeFromLocalStorage: () => {
    const savedState = JSON.parse(localStorage.getItem('widgetState') || '[]');
    set({ listWidgetOpened: savedState });
  },
}));

export default useWidgetControllerStore;
