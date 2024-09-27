import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import useMusicStore from "../../store/useMusicStore";

const MusicPlayerController = () => {
    const {
        isPlaying,
        setIsPlaying,
        currentTrackIndex,
        setCurrentTrackIndex,
        playlist,
        volume,
        setVolume
    } = useMusicStore();

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSkipForward = () => {
        if (playlist.length > 0 && currentTrackIndex < playlist.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
        }
    };

    const handleSkipBack = () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseInt(e.target.value));
    };

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={handleSkipBack}
                disabled={currentTrackIndex === 0}
                className="text-white hover:text-[#ed974d] transition-colors disabled:text-gray-500"
            >
                <SkipBack size={20} />
            </button>
            <button
                disabled={!playlist.length}
                onClick={handlePlayPause}
                className="text-white hover:text-[#ed974d] transition-colors disabled:text-gray-500"
            >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
                onClick={handleSkipForward}
                disabled={!playlist.length || currentTrackIndex === playlist.length - 1}
                className="text-white hover:text-[#ed974d] transition-colors disabled:text-gray-500"
            >
                <SkipForward size={20} />
            </button>
            <div className="flex items-center space-x-2">
                <Volume2 size={20} className="text-white" />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default MusicPlayerController;