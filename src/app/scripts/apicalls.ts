"use server"

import { Storage } from "@google-cloud/storage";
import path from "path";
import axios from "axios"
import { setAuthToken } from "./server";
import { string } from "joi";

const BUCKETNAME = process.env.NEXT_PRIVATE_BUCKET_NAME;
const API = process.env.NEXT_PRIVATE_API;

const storage = new Storage({
    keyFilename: path.join(process.cwd(), "gcs-key.json"),
});
const bucket = storage.bucket(BUCKETNAME || "");

export const createUser = async (formData: FormData) : Promise<string | void>=> {
    try {
        if (formData.get("picture") !== null) {
            const profilePicture = formData.get("picture") as File;

            const buffer = Buffer.from(await profilePicture.arrayBuffer());

            const file = bucket.file(`${Date.now()}-${profilePicture.name}`);
            const fileStream = file.createWriteStream({
                resumable: false,
                metadata: { contentType: profilePicture.type }
            });

            fileStream.on("finish", async () => {
                const [url] = await file.getSignedUrl({
                    action: "read",
                    expires: Date.now() + 60 * 60 * 24 * 365,
                });

                formData.append("profilePicture", url);

                try {
                    const res = await axios.post(API + "/public/user/create", formData, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (res.status === 409) {
                        console.log(409)
                        return res.data.error
                    }
                    if (res.status === 201) {
                        console.log(201)
                        setAuthToken(res.data.jwt);
                    }

                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 409) {
                            return error.response.data.message
                        } else {
                            return "Server error. Please try again."
                        }
                    } else {
                        return "Server error. Please try again."
                    }
                }
            });

            fileStream.end(buffer);
        } else {
            try {
                const res = await axios.post(API + "/public/user/create", formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (res.status === 409) {
                    console.log(409)
                    return res.data.error
                }
                if (res.status === 201) {
                    console.log(201)
                    setAuthToken(res.data.jwt);
                }

                console.log(res)

            } catch (error) {
                console.log(error)
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 409) {
                        console.log("a")
                        return error.response.data.message
                    } else {
                        return "Server error. Please try again."
                    }
                } else {
                    return "Server error. Please try again."
                }
            }
        }
    } catch {
        console.log(5002)
        return "Server error. Please try again."
    }
};
