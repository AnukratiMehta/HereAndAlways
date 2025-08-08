import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';

const RecentActivitySection = ({ 
  title, 
  icon, 
  items, 
  emptyMessage, 
  link,
  onItemClick,
  getItemTitle = (item) => item.title || item.name || "Untitled",
  getItemSubtitle = (item) => "",
  dateField = "createdAt",
  searchQuery = "",
  maxItems = 3,
  itemKey = (item) => item.id
}) => {
  const handleClick = (e, item) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const highlightMatch = (text) => {
    if (!searchQuery || !text) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} className="bg-yellow-100">{part}</span>
      ) : (
        part
      )
    );
  };

  const displayedItems = items?.slice(0, maxItems) || [];

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

      {displayedItems.length > 0 ? (
        <ul className="space-y-3">
          {displayedItems.map((item) => (
            <li key={itemKey(item)} className="py-2 border-b border-lightGray last:border-0">
              <div 
                onClick={(e) => handleClick(e, item)}
                className="flex justify-between items-center w-full hover:bg-gray-50 p-2 rounded transition-colors text-left cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {highlightMatch(getItemTitle(item))}
                  </p>
                  {getItemSubtitle(item) && (
                    <p className="truncate text-sm text-gray-500">
                      {highlightMatch(getItemSubtitle(item))}
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

RecentActivitySection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  link: PropTypes.string,
  onItemClick: PropTypes.func,
  getItemTitle: PropTypes.func,
  getItemSubtitle: PropTypes.func,
  dateField: PropTypes.string,
  searchQuery: PropTypes.string,
  maxItems: PropTypes.number,
  itemKey: PropTypes.func
};

export default RecentActivitySection;