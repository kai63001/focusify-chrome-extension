import useBackgroundStore from '../store/useBackgroundStore';

const Background = () => {
  const { background } = useBackgroundStore();

  return (
    <div className="absolute inset-0 z-[-1] w-full h-full">
      <img src={background} alt="Background" className="bg-cover w-full h-full object-cover" />
    </div>
  );
};

export default Background;
