import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const SearchInput = ({ placeholder, onSearch, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
      />
      <FontAwesomeIcon 
        icon={icons.search} 
        className="absolute left-3 top-3 text-gray-400"
      />
    </div>
  );
};

export default SearchInput;