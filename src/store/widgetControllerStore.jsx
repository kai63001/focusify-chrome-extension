import { create } from "zustand";
const defaultWidget = [
  {
    name: "Clock",
    zIndex: 0,
    position: { x: 0, y: 0 },
    size: { width: 200, height: 200 },
  },
];

const useWidgetControllerStore = create((set) => ({
  listWidgetOpened: [],
  rememberWidgetPosition:
    localStorage.getItem("rememberWidgetPosition") === "true" ? true : false,
  addWidget: (widgetName, position, size) =>
    set((state) => {
      const newList = [
        ...state.listWidgetOpened,
        {
          name: widgetName,
          zIndex: state.listWidgetOpened.length,
          position,
          size,
        },
      ];
      if (state.rememberWidgetPosition) {
        localStorage.setItem("widgetState", JSON.stringify(newList));
      }
      return { listWidgetOpened: newList };
    }),
  removeAllWidgets: () =>
    set((state) => {
      //remove Pomodoro, Todo, Bookmark, Note
      const newList = state.listWidgetOpened.filter(
        (widget) =>
          widget.name !== "Pomodoro" &&
          widget.name !== "Todo" &&
          widget.name !== "Bookmark" &&
          widget.name !== "Note"
      );
      localStorage.setItem("widgetState", JSON.stringify(newList));
      return { listWidgetOpened: newList };
    }),
  removeWidget: (widgetName) =>
    set((state) => {
      const newList = state.listWidgetOpened.filter(
        (widget) => widget.name !== widgetName
      );
      localStorage.setItem("widgetState", JSON.stringify(newList));
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
      if (state.rememberWidgetPosition) {
        localStorage.setItem("widgetState", JSON.stringify(newList));
      }
      return { listWidgetOpened: newList };
    }),
  getWidgetZIndex: (widgetName) => (state) =>
    state.listWidgetOpened.find((widget) => widget.name === widgetName)
      ?.zIndex ?? 0,
  updateWidgetPosition: (widgetName, position) =>
    set((state) => {
      const newList = state.listWidgetOpened.map((widget) =>
        widget.name === widgetName ? { ...widget, position } : widget
      );
      if (state.rememberWidgetPosition) {
        localStorage.setItem("widgetState", JSON.stringify(newList));
      }
      return { listWidgetOpened: newList };
    }),
  updateWidgetSize: (widgetName, size) =>
    set((state) => {
      const newList = state.listWidgetOpened.map((widget) =>
        widget.name === widgetName ? { ...widget, size } : widget
      );
      if (state.rememberWidgetPosition) {
        localStorage.setItem("widgetState", JSON.stringify(newList));
      }
      return { listWidgetOpened: newList };
    }),
  initializeFromLocalStorage: () => {
    let savedState = JSON.parse(
      localStorage.getItem("widgetState") || JSON.stringify(defaultWidget)
    );
    const rememberWidgetPosition =
      localStorage.getItem("rememberWidgetPosition") === "true";
    if (!rememberWidgetPosition) {
      localStorage.setItem("widgetState", JSON.stringify(defaultWidget));
      savedState = defaultWidget;
    }
    set({ listWidgetOpened: savedState, rememberWidgetPosition });
  },
  setRememberWidgetPosition: (value) =>
    set(() => {
      localStorage.setItem("rememberWidgetPosition", value);
      return { rememberWidgetPosition: value };
    }),
}));

export default useWidgetControllerStore;
