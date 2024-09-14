import { create } from "zustand";

const useWidgetControllerStore = create((set) => ({
  listWidgetOpened: [],
  addWidget: (widgetName) =>
    set((state) => ({
      listWidgetOpened: [...state.listWidgetOpened, { name: widgetName, zIndex: state.listWidgetOpened.length }],
    })),
  removeWidget: (widgetName) =>
    set((state) => ({
      listWidgetOpened: state.listWidgetOpened.filter(
        (widget) => widget.name !== widgetName
      ),
    })),
  isWidgetOpen: (widgetName) => (state) =>
    state.listWidgetOpened.some((widget) => widget.name === widgetName),
  // Add this new function
  bringToFront: (widgetName) =>
    set((state) => ({
      listWidgetOpened: state.listWidgetOpened.map((widget) =>
        widget.name === widgetName
          ? { ...widget, zIndex: state.listWidgetOpened.length - 1 }
          : { ...widget, zIndex: widget.zIndex > 0 ? widget.zIndex - 1 : 0 }
      ),
    })),
  // Add this new function
  getWidgetZIndex: (widgetName) => (state) =>
    state.listWidgetOpened.find((widget) => widget.name === widgetName)?.zIndex ?? 0,
}));

export default useWidgetControllerStore;
