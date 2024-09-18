import { ChevronLeft } from "lucide-react";

const ClockSetting = ({ onBack }) => {
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
      {/* Add clock settings options here */}
      <div className="px-4 py-2 text-sm text-white">Clock setting option 1</div>
      <div className="px-4 py-2 text-sm text-white">Clock setting option 2</div>
    </div>
  );
};

export default ClockSetting;
