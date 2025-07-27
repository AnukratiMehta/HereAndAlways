import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RecentActivitySection = ({ 
  title, 
  icon, 
  items, 
  emptyMessage, 
  link,
  onItemClick,
  getItemTitle = (item) => item.title || item.name || "Untitled",
  getItemSubtitle = (item) => "",
  dateField = "createdAt"
}) => {
  const handleClick = (e, item) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-brandRose-dark">
          <FontAwesomeIcon icon={icon} />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {link && (
          <a href={link} className="text-sm text-brandRose hover:underline">
            View all
          </a>
        )}
      </div>

      {items?.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="py-2 border-b border-lightGray last:border-0">
              <div 
                onClick={(e) => handleClick(e, item)}
                className="flex justify-between items-center w-full hover:bg-gray-50 p-2 rounded transition-colors text-left cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {getItemTitle(item)}
                  </p>
                  {getItemSubtitle(item) && (
                    <p className="truncate text-sm text-gray-500">
                      {getItemSubtitle(item)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(item[dateField]).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500 py-4 text-center">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default RecentActivitySection;