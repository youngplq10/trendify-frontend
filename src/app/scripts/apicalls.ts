"use server"

import { Storage } from "@google-cloud/storage";
import path from "path";
import axios from "axios"
import { getAllCookies, setAuthToken } from "./server";

const BUCKETNAME = process.env.NEXT_PRIVATE_BUCKET_NAME;
const API = process.env.NEXT_PRIVATE_API;

const storage = new Storage({
    keyFilename: path.join(process.cwd(), "gcs-key.json"),
});
const bucket = storage.bucket(BUCKETNAME || "");

export const createUser = async (formData: FormData) : Promise<string | void> => {
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
                    expires: Date.now() + 60 * 60 * 24 * 365 * 100,
                });

                formData.append("profilePicture", url);

                try {
                    const res = await axios.post(API + "/public/user/create", formData, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (res.status === 409) {
                        return res.data.error
                    }
                    if (res.status === 201) {
                        setAuthToken(res.data.jwt);
                    }

                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 409) {
                            return error.response.data.error
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
                    return res.data.error
                }
                if (res.status === 201) {
                    setAuthToken(res.data.jwt);
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 409) {
                        return error.response.data.error
                    } else {
                        return "Server error. Please try again."
                    }
                } else {
                    return "Server error. Please try again."
                }
            }
        }
    } catch {
        return "Server error. Please try again."
    }
};

export const loginUser = async (formData: FormData) : Promise<string | void> => {
    try {
        const res = await axios.post(API + "/public/user/login", formData, {});

        if (res.status === 409) {
            return res.data.error
        }
        if (res.status === 200) {
            setAuthToken(res.data.jwt);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 409) {
                return error.response.data.error
            } else {
                return "Server error. Please try again."
            }
        } else {
            return "Server error. Please try again."
        }
    }
}

export const newPost = async (formData: FormData) : Promise<string | void> => {
    try {
        const { jwt } = await getAllCookies();

        if (formData.get("postPicture") !== null) {
            const postPicture = formData.get("postPicture") as File;

            const buffer = Buffer.from(await postPicture.arrayBuffer());

            const file = bucket.file(`${Date.now()}-${postPicture.name}`);
            const fileStream = file.createWriteStream({
                resumable: false,
                metadata: { contentType: postPicture.type }
            });

            fileStream.on("finish", async () => {
                const [url] = await file.getSignedUrl({
                    action: "read",
                    expires: Date.now() + 60 * 60 * 24 * 365 * 100,
                });
                formData.delete("postPicture")
                formData.append("image", url);

                try {
                    const res = await axios.post(API + "/auth/post/create", formData, {
                        headers: {
                            "Authorization" : "Bearer " + jwt?.value
                        }
                    });

                    if (res.status === 409) {
                        return res.data.error
                    }

                } catch (error) {
                    console.log(error)
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 409) {
                            return error.response.data.error
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
                const res = await axios.post(API + "/auth/post/create", formData, {
                    headers: {
                        "Authorization" : "Bearer " + jwt?.value
                    }
                });

                if (res.status === 409) {
                    return res.data.error
                }

            } catch (error) {
                console.log(error)
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 409) {
                        return error.response.data.error
                    } else {
                        return "Server error. Please try again."
                    }
                } else {
                    return "Server error. Please try again."
                }
            }
        }
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 409) {
                return error.response.data.error
            } else {
                return "Server error. Please try again."
            }
        } else {
            return "Server error. Please try again."
        }
    }
}
