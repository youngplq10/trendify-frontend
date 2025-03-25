import React from 'react'

const NewPostForm = () => {
    return (
        <div className="col-12 col-sm-10 col-md-8 col-xl-6 p-0">
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
            />
            </form>
        </div>
    )
}

export default NewPostForm
