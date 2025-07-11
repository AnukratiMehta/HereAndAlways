import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const assetTypeIcons = {
  PASSWORD: icons.key,
  DOCUMENT: icons.fileAlt,
  LINK: icons.link,
  IMAGE: icons.image,
  VIDEO: icons.video,
  MUSIC: icons.music,
  DEFAULT: icons.file,
};

const AssetCard = ({ asset }) => {
  const {
    fileName,
    type,
    uploadedAt,
    linkedTrustee,
    linkedMessage
  } = asset;

  const icon = assetTypeIcons[type] || assetTypeIcons.DEFAULT;

  return (
    <div className="border border-lightGray rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2 text-sm w-full max-w-sm">
      <div className="flex items-center gap-2 text-brandRose text-lg mb-1">
        <FontAwesomeIcon icon={icon} />
        <span className="font-semibold">{fileName}</span>
      </div>

      <div className="text-gray-500">Uploaded: {new Date(uploadedAt).toLocaleDateString()}</div>

      <div>
        <span className="font-medium text-charcoal">Trustee: </span>
        {linkedTrustee?.name || <span className="text-gray-400">—</span>}
      </div>

      <div>
        <span className="font-medium text-charcoal">Message: </span>
        {linkedMessage?.title || <span className="text-gray-400">—</span>}
      </div>

      <div className="flex gap-4 mt-2">
        <button className="text-blue-600 hover:underline">Download</button>
        <button className="text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  );
};

export default AssetCard;
