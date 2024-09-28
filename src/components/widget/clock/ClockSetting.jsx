import { ChevronLeft } from "lucide-react";
import useClockStore from "../../../store/useClockStore";
import Switch from "../../ui/switch";
import useUserDataStore from "../../../store/userDataStore";
const ClockSetting = ({ onBack }) => {
  const { mode, setMode, quote, setQuote, isDraggable, setIsDraggable } =
    useClockStore();
  const { premium } = useUserDataStore();

  return (
    <div className="animate-slide-left">
      <div className="px-4 py-2 flex items-center">
        <ChevronLeft
          size={20}
          className="cursor-pointer mr-2"
          onClick={onBack}
        />
        <span className="text-sm text-white font-semibold">Clock Settings</span>
      </div>
      {!premium && (
        <div className="text-yellow-500 py-2 px-4">
          Upgrade to premium to access clock settings.
        </div>
      )}
      <div className={`px-4 py-2 text-sm text-white ${premium ? '' : 'opacity-50 pointer-events-none'}`}>
        <label className="block mb-2">
          Clock Mode:
          <select
            value={mode}
            onChange={premium ? (e) => setMode(e.target.value) : undefined}
            className="ml-2 bg-gray-700 rounded"
            disabled={!premium}
          >
            <option value="DIGITAL">Digital</option>
            <option value="AM_PM">AM/PM</option>
          </select>
        </label>
      </div>
      <div className={`px-4 py-2 text-sm text-white ${premium ? '' : 'opacity-50 pointer-events-none'}`}>
        <label className="block mb-2">
          Quote:
          <input
            type="text"
            value={quote}
            onChange={premium ? (e) => setQuote(e.target.value) : undefined}
            className="w-full mt-1 bg-gray-700 rounded px-2 py-1"
            disabled={!premium}
          />
        </label>
      </div>
      <div
        onClick={premium ? () => setIsDraggable(!isDraggable) : undefined}
        className={`px-4 py-2 text-sm text-white flex items-center space-x-2 cursor-pointer ${premium ? '' : 'opacity-50'}`}
      >
        <Switch isOn={isDraggable} onChange={premium ? setIsDraggable : undefined} disabled={!premium} />
        <span className="text-sm">Enable Dragging</span>
      </div>
    </div>
  );
};

export default ClockSetting;
