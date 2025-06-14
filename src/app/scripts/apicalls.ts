"use server"

import { Storage } from "@google-cloud/storage";
import axios from "axios"
import { getAllCookies, setAuthToken } from "./server";
import { post, user } from "./interfaces";

const BUCKETNAME = process.env.NEXT_PRIVATE_BUCKET_NAME;
const API = process.env.NEXT_PRIVATE_API;

const keyJson = Buffer.from(process.env.NEXT_PRIVATE_GCSKEY!, "base64").toString("utf8");

const storage = new Storage({
  credentials: JSON.parse(keyJson),
});

const bucket = storage.bucket(BUCKETNAME || "");

export const createUser = async (formData: FormData): Promise<string | void> => {
    try {
        if (formData.get("picture") !== null) {
            const profilePicture = formData.get("picture") as File;
            const buffer = Buffer.from(await profilePicture.arrayBuffer());
            const file = bucket.file(`${Date.now()}-${profilePicture.name}`);
            
            await new Promise<void>((resolve, reject) => {
                const fileStream = file.createWriteStream({
                    resumable: false,
                    metadata: { contentType: profilePicture.type }
                });

                fileStream.on("finish", async () => {
                    try {
                        const [url] = await file.getSignedUrl({
                            action: "read",
                            expires: Date.now() + 60 * 60 * 24 * 365 * 100,
                        });

                        formData.append("profilePicture", url);

                        const res = await axios.post(API + "/public/user/create", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        });

                        if (res.status === 409) {
                            reject(res.data.error);
                        } else if (res.status === 201) {
                            setAuthToken(res.data.jwt);
                            resolve();
                        } else {
                            reject("Unexpected response from server.");
                        }
                    } catch (error) {
                        if (axios.isAxiosError(error) && error.response?.status === 409) {
                            reject(error.response.data.error);
                        } else {
                            reject("Server error. Please try again.");
                        }
                    }
                });

                fileStream.on("error", reject);
                fileStream.end(buffer);
            });
        } else {
            const res = await axios.post(API + "/public/user/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 409) {
                return res.data.error;
            }
            if (res.status === 201) {
                setAuthToken(res.data.jwt);
            }
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

export const newPost = async (formData: FormData): Promise<string | void | { unique: string }> => {
    try {
        const { jwt } = await getAllCookies();
        
        if (jwt === undefined) {
            return "You need to log in."
        }

        if (formData.get("postPicture") !== null) {
            const postPicture = formData.get("postPicture") as File;
            const buffer = Buffer.from(await postPicture.arrayBuffer());
            const file = bucket.file(`${Date.now()}-${postPicture.name}`);

            console.log(file);

            return new Promise((resolve, reject) => {
                const fileStream = file.createWriteStream({
                    resumable: false,
                    metadata: { contentType: postPicture.type }
                });

                fileStream.on("finish", async () => {
                    try {
                        const [url] = await file.getSignedUrl({
                            action: "read",
                            expires: Date.now() + 60 * 60 * 24 * 365 * 100,
                        });

                        formData.delete("postPicture");
                        formData.append("image", url);

                        console.log(url)

                        const res = await axios.post(API + "/auth/post/create", formData, {
                            headers: { "Authorization": "Bearer " + jwt?.value }
                        });

                        if (res.status === 201) {
                            resolve({ unique: res.data.unique });
                        } else if (res.status === 409) {
                            reject(res.data.error);
                        } else {
                            reject("Unexpected server response.");
                        }
                    } catch (error) {
                        reject(axios.isAxiosError(error) && error.response?.status === 409
                            ? error.response.data.error
                            : "Server error. Please try again."
                        );
                    }
                });

                fileStream.on("error", (err) => reject(err));
                fileStream.end(buffer);
            });
        } else {
            const res = await axios.post(API + "/auth/post/create", formData, {
                headers: { "Authorization": "Bearer " + jwt?.value }
            });

            if (res.status === 201) {
                return { unique: res.data.unique };
            }

            if (res.status === 409) {
                return res.data.error;
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.status === 409 ? error.response.data.error : "Server error. Please try again.";
        } else {
            return "Server error. Please try again.";
        }
    }
};

export const getAllPosts = async () : Promise<post[] | string> => {
    try {
        const res = await axios.get(API + "/public/post/getall", {});

        if (res.status === 200) {
            res.data.posts.map((post : post) => console.log(post))
            return res.data.posts as post[];
        } else {
            return res.data.error;
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

export const getUserData = async () : Promise<user | string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.get(API + "/auth/user", {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.data as user;
        } else {
            return res.data.error;
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

export const likePost = async (unique: string) : Promise<string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.post(API + "/auth/post/like/" + unique, {}, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.message;
        } else {
            return res.data.error;
        }
    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 409) {
                return error.response.data.error
            } else {
                return "Server error. Please try again."
            }
        } else {
            return "Server error. Please try again3."
        }
    }
}

export const unlikePost = async (unique: string) : Promise<string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.post(API + "/auth/post/unlike/" + unique, {}, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.message;
        } else {
            return res.data.error;
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

export const getPost = async (unique: string) : Promise<post | string> => {
    try {
        const res = await axios.get(API + "/public/post/" + unique, {});

        if (res.status === 200) {
            return res.data.data as post;
        } else {
            return res.data.error;
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

export const newReply = async (formData: FormData): Promise<string | void | { unique: string }> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        if (formData.get("replyPicture") !== null) {
            const replyPicture = formData.get("replyPicture") as File;
            const buffer = Buffer.from(await replyPicture.arrayBuffer());
            const file = bucket.file(`${Date.now()}-${replyPicture.name}`);

            return new Promise((resolve, reject) => {
                const fileStream = file.createWriteStream({
                    resumable: false,
                    metadata: { contentType: replyPicture.type }
                });

                fileStream.on("finish", async () => {
                    try {
                        const [url] = await file.getSignedUrl({
                            action: "read",
                            expires: Date.now() + 60 * 60 * 24 * 365 * 100,
                        });

                        formData.delete("replyPicture");
                        formData.append("imageLink", url);

                        const res = await axios.post(API + "/auth/reply/create", formData, {
                            headers: { "Authorization": "Bearer " + jwt?.value }
                        });

                        if (res.status === 201) {
                            resolve({ unique: res.data.unique });
                        } else if (res.status === 409) {
                            reject(res.data.error);
                        } else {
                            reject("Unexpected server response.");
                        }
                    } catch (error) {
                        reject(axios.isAxiosError(error) && error.response?.status === 409
                            ? error.response.data.error
                            : "Server error. Please try again."
                        );
                    }
                });

                fileStream.on("error", (err) => reject(err));
                fileStream.end(buffer);
            });
        } else {
            const res = await axios.post(API + "/auth/reply/create", formData, {
                headers: { "Authorization": "Bearer " + jwt?.value }
            });

            if (res.status === 201) {
                return { unique: res.data.unique };
            }

            if (res.status === 409) {
                return res.data.error;
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.status === 409 ? error.response.data.error : "Server error. Please try again.";
        } else {
            return "Server error. Please try again.";
        }
    }
};

export const likeReply = async (unique: string) : Promise<string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.post(API + "/auth/reply/like/" + unique, {}, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.message;
        } else {
            return res.data.error;
        }
    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 409) {
                return error.response.data.error
            } else {
                return "Server error. Please try again."
            }
        } else {
            return "Server error. Please try again3."
        }
    }
}

export const unlikeReply = async (unique: string) : Promise<string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.post(API + "/auth/reply/unlike/" + unique, {}, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.message;
        } else {
            return res.data.error;
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

export const deletePost = async (unique: string) : Promise<string | void> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.delete(API + "/auth/post/" + unique, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status !== 200) {
            return res.data.error;
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

export const deleteReply = async (unique: string) : Promise<string | void> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.delete(API + "/auth/reply/" + unique, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status !== 200) {
            return res.data.error;
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

export const getUserByUsername = async (username: string) : Promise<string | user> => {
    try {
        const res = await axios.get(API + "/public/user/" + username, {});

        if (res.status === 200) {
            return res.data.data as user;
        } else {
            return res.data.error;
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

export const followUser = async (username: string) : Promise<string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.post(API + "/auth/user/follow/" + username, {}, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.message;
        } else {
            return res.data.error;
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

export const unfollowUser = async (username: string) : Promise<string> => {
    try {
        const { jwt } = await getAllCookies();

        if (jwt === undefined) {
            return "You need to log in."
        }

        const res = await axios.post(API + "/auth/user/unfollow/" + username, {}, {
            headers: {
                "Authorization" : "Bearer " + jwt?.value
            }
        });

        if (res.status === 200) {
            return res.data.message;
        } else {
            return res.data.error;
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