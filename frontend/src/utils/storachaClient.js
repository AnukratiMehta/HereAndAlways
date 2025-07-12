import { create } from "@storacha/client";

// Global Storacha client
let client = null;
let space = null;

export const initializeStoracha = async (email = "anukratimehta@email.com") => {
  if (!client) {
    client = await create();
    const account = await client.login(email);
    await account.plan.wait();
    space = await client.createSpace("HereAndAlways", { account });
    await client.setCurrentSpace(space.did());
  }
};

export const uploadToStoracha = async (file) => {
  if (!space) {
    throw new Error("Storacha space not initialized");
  }
  const result = await space.upload(file);
  return result.url; // e.g. https://w3s.link/ipfs/cid
};
