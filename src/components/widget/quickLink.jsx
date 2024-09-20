import useQuickLinkStore from "../../store/useQuickLinkStore";

const QuickLink = () => {
  const { listSite } = useQuickLinkStore();

  return (
    <div className="select-none">
      <div className="absolute top-4 left-0 z-50 flex justify-center items-center px-4">
        <div className="p-3 bg-[#221B15]/70 backdrop-blur-lg rounded-lg w-full flex justify-between items-center">
          {listSite.map((site) => (
            <a
              href={site.link}
              key={site.link}
              className="cursor-pointer text-md font-bold px-2 py-1 rounded-md hover:bg-white/10 "
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${site.link}&sz=64`}
                alt={site.name}
                className="w-6 h-6"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLink;
