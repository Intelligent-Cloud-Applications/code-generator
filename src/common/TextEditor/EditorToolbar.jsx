// components/TextEditor/EditorToolbar.jsx
import React from "react";

const EditorToolbar = (folder) => ({
  container: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", ...(folder !== "" ? ["image"] : [])].filter(Boolean),
    [{ blockquote: true }],
    ["clean"],
  ],
});

export default EditorToolbar;
