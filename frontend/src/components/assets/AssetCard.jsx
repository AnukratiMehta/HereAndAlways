import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { supabase } from "../../utils/supabaseClient";

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
    id,
    name,
    assetType,
    createdAt,
    linkedTrustees = [],
    linkedMessage,
    downloadUrl
  } = asset;

  const icon = assetTypeIcons[assetType] || assetTypeIcons.DEFAULT;

// const handleDownload = async () => {
//   try {
//     // 1. Verify authentication
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
    
//     if (authError) throw authError;
//     if (!user) throw new Error("User not authenticated");

//     // 2. Extract the clean file path
//     const filePath = downloadUrl.replace(/^\/?assets\//, '');
//     console.log("Attempting to download:", filePath);

//     // 3. Get the file
//     const { data, error } = await supabase
//       .storage
//       .from('assets')
//       .download(filePath);

//     if (error) throw error;
//     if (!data) throw new Error("No file data returned");

//     // 4. Create download link
//     const url = window.URL.createObjectURL(data);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', filePath.split('/').pop()); // Set filename
//     document.body.appendChild(link);
//     link.click();
    
//     // 5. Clean up
//     setTimeout(() => {
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     }, 100);

//   } catch (err) {
//     console.error("Download failed:", {
//       error: err,
//       downloadUrl,
//       user: await supabase.auth.getUser()
//     });
//     alert(`Download failed: ${err.message}`);
//   }
// };

const handleDownload = async () => {
  try {
    // Extract filename (assuming downloadUrl format: "/assets/filename.ext")
    const filePath = downloadUrl.replace(/^\/?assets\//, ''); 

    // Generate public URL (bypasses RLS temporarily)
    const publicUrl = `https://${YOUR_SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/assets/${filePath}`;
    
    // Open in new tab (or force download)
    window.open(publicUrl, '_blank');

  } catch (err) {
    console.error("Download failed:", err);
    alert(`Download failed: ${err.message}`);
  }
};


  return (
    <div className="border border-lightGray rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2 text-sm w-full max-w-sm">
      <div className="flex items-center gap-2 text-brandRose text-lg mb-1">
        <FontAwesomeIcon icon={icon} />
        <span className="font-semibold">{name}</span>
      </div>

      <div className="text-gray-500">
  Uploaded: {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
</div>


      <div>
  <span className="font-medium text-charcoal">Trustee: </span>
  {Array.isArray(linkedTrustees) && linkedTrustees.length > 0
    ? linkedTrustees.map((t) => t.name).join(", ")
    : <span className="text-gray-400">—</span>}
</div>


      <div>
  <span className="font-medium text-charcoal">Messages: </span>
  {Array.isArray(asset.linkedMessages) && asset.linkedMessages.length > 0
    ? asset.linkedMessages.map((m) => m.title).join(", ")
    : <span className="text-gray-400">—</span>}
</div>


      <div className="flex gap-4 mt-2">
        <button onClick={handleDownload} className="text-blue-600 hover:underline">
          Download
        </button>
        <button className="text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  );
};

export default AssetCard;
