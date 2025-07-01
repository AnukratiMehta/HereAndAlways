import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faEnvelope,
  faFile,
  faUserShield,
  faCog,
  faSignOutAlt,
  faPaperPlane,
  faFilePen,
  faEye,
  faPen,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
  dashboard: faHouse,
  messages: faEnvelope,
  assets: faFile,
  trustees: faUserShield,
  settings: faCog,
  logout: faSignOutAlt,
  send: faPaperPlane,
  save: faFilePen,
  eye: faEye,
  pen: faPen,
};

export { FontAwesomeIcon, icons };
