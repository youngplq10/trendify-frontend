"use client"

import { Alert, Button, Snackbar } from '@mui/material';
import React, { useState } from 'react'
import { validateNewPost } from '../scripts/validation';
import { newPost } from '../scripts/apicalls';

const NewPostForm = () => {
    const [content, setContent] = useState("");
    const [postPicture, setPostPicture] = useState<File | null>(null);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    const handleSubmit = async () => {
        const validation = validateNewPost(content);

        if (validation !== "Success") {
            setAlertMessage(validation);
            setAlertSeverity("error");
            setAlertState(true);
            return;
        } else {
            const formData = new FormData();
            formData.append("content", content);
            
            if (postPicture !== null) {
                formData.append("postPicture", postPicture, postPicture?.name);
            }
            setAlertMessage("Sharing...");
            setAlertSeverity("info");
            setAlertState(true);

            const res = await newPost(formData);

            setAlertState(false);

            if (typeof res === "string") {
                setAlertMessage(res);
                setAlertSeverity("error");
                setAlertState(true);
            }
            if (typeof res === "object") {
                window.location.href = "/?topPost=" + res.unique;
            }
        }
    }

    return (
        <section className="col-12 col-sm-10 col-md-8 col-xl-6 p-0">
            <form>
            <textarea
                style={{
                    width: "100%",
                    minHeight: "3rem",
                    backgroundColor: "#05040c",
                    color: "#e8e6f5",
                    border: "1px solid #e8e6f5",
                    padding: "8px",
                    resize: "none",
                    overflow: "hidden",
                }}
                rows={3}
                placeholder="Share yours thoughs..."
                maxLength={400}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <input
                type="file" 
                accept="image/*" 
                id="file-upload"
                className="d-none"
                onChange={(e) => setPostPicture(e.target.files?.[0] || null)} 
            />

            <label 
                htmlFor="file-upload" 
                className="form-control py-3 mt-2 text-center" 
                style={{
                    minHeight: "2rem",
                    backgroundColor: "#05040c",
                    color: "#e8e6f5",
                    border: "1px solid #e8e6f5",
                    cursor: "pointer",
                }}
            >
                {postPicture ? postPicture.name : "Attach image"}
            </label>

            <Button variant='contained' className='col-12 mt-2' onClick={handleSubmit}>Share</Button>
            </form>

            <Snackbar open={alertState} autoHideDuration={6000} onClose={() => setAlertState(false)}>
                <Alert
                    onClose={() => setAlertState(false)}
                    severity={alertSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </section>
    )
}

export default NewPostForm
