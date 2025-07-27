import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StatCard = ({ icon, title, value, link, color = "bg-brandRose-light text-brandRose-dark" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray hover:shadow-md transition-shadow">
      <Link to={link} className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
        </div>
      </Link>
    </div>
  );
};

export default StatCard;