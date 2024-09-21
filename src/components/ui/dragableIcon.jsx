const DragableIcon = () => {
  return (
    <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.5 16v-1.5H16V16h-4.5zM8 16v-1.5h1.5V16H8zm-3.5 0v-1.5H6V16H4.5zM16 12.5h-1.5V16H16v-3.5zM16 9h-1.5v1.5H16V9zM16 5.5h-1.5V7H16V5.5z" />
      </svg>
    </div>
  );
};

export default DragableIcon;
