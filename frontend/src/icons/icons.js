import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faEnvelope,
  faFile,
  faUserShield,
  faCog,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
  dashboard: faHouse,
  messages: faEnvelope,
  assets: faFile,
  trustees: faUserShield,
  settings: faCog,
  logout: faSignOutAlt,
};

export { FontAwesomeIcon, icons };
