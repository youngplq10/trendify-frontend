"use server"

import { Storage } from "@google-cloud/storage";
import path from "path";

const BUCKETNAME = process.env.NEXT_PRIVATE_BUCKET_NAME;

const storage = new Storage({
    keyFilename: path.join(process.cwd(), "gcs-key.json"),
});
const bucket = storage.bucket(BUCKETNAME || "");

export const createUser = async (formData: FormData) => {
    try {
        if (formData.get("profilePicture") !== null) {
            const profilePicture = formData.get("profilePicture") as File;
            const buffer = Buffer.from(await profilePicture.arrayBuffer());

            const file = bucket.file(`${Date.now()}-${profilePicture.name}`);
            const fileStream = file.createWriteStream({
                resumable: false,
                metadata: { contentType: profilePicture.type }
            });

            return new Promise((resolve, reject) => {
                fileStream.on("error", (err) => reject(err));
            
                fileStream.on("finish", async () => {
                    const [url] = await file.getSignedUrl({
                        action: "read",
                        expires: Date.now() + 60 * 60 * 24 * 365,
                    });
                    resolve(url);
                });

                fileStream.end(buffer);
            });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
};
