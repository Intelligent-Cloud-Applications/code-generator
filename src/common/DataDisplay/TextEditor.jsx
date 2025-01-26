// components/TextEditor/TextEditor.jsx
import React, { useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Storage } from "aws-amplify";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

const TextEditor = ({
  value,
  onChange,
  onSave,
  showSaveButton = true,
  saveButtonText = "Save Changes",
  saveButtonClassName = "",
  saveButtonStyle = {},
  editorClassName = "",
  placeholder = "",
}) => {
  // Track uploaded images
  const [uploadedImages, setUploadedImages] = useState(new Map());


const imageHandler = useCallback(() => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      // Generate unique ID for tracking
      const imageId = crypto.randomUUID();
      const fileName = `${imageId}-${file.name}`;
      
      const uploadResult = await Storage.put(fileName, file, {
        contentType: file.type,
      });

      if (!uploadResult?.key) throw new Error("Upload failed");

      const imageUrl = await Storage.get(fileName);

      // Update tracking state
      setUploadedImages(prev => new Map(prev).set(imageId, {
        fileName,
        url: imageUrl
      }));

      // Insert image with tracking ID
      const editor = document.querySelector(".ql-editor");
      if (!editor) return;

      const range = document.getSelection()?.getRangeAt(0);
      if (!range) return;

      const img = document.createElement("img");
      img.src = imageUrl;
      img.setAttribute("data-image-id", imageId);
      range.insertNode(img);

      console.log(`Image uploaded: ${imageId}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
}, []);

const handleContentChange = useCallback(async (content) => {
  onChange(content);
  
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  
  // Get current image IDs
  const currentImageIds = Array.from(tempDiv.querySelectorAll("img"))
    .map(img => img.getAttribute("data-image-id"))
    .filter(Boolean);
    
  console.log("Current image IDs:", currentImageIds);
  
  // Find deleted images
  const deletedImages = Array.from(uploadedImages.keys())
    .filter(id => !currentImageIds.includes(id));
    
  console.log("Deleted image IDs:", deletedImages);
  
  // Remove deleted images
  for (const imageId of deletedImages) {
    const imageData = uploadedImages.get(imageId);
    if (!imageData) continue;
    
    try {
      await Storage.remove(imageData.fileName);
      setUploadedImages(prev => {
        const next = new Map(prev);
        next.delete(imageId);
        return next;
      });
      console.log(`Deleted image: ${imageId}`);
    } catch (error) {
      console.error(`Failed to delete image ${imageId}:`, error);
    }
  }
}, [uploadedImages, onChange]);

  // ReactQuill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ blockquote: true }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
      displaySize: true,
      handleStyles: {
        backgroundColor: "black",
        border: "none",
        color: "white",
      },
    },
  };


  return (
    <div className="text-editor-container">
      <ReactQuill
        value={value}
        onChange={handleContentChange}
        modules={modules}
        className={`mt-5 ${editorClassName}`}
        theme="snow"
        placeholder={placeholder}
      />
      {showSaveButton && onSave && (
        <div className="flex justify-end mt-5">
          <button
            onClick={onSave}
            className={`w-[15rem] text-white px-12 py-2 rounded-[8px] mb-4 h-[3rem] text-[1.2rem] tracking-[0.8px] ${saveButtonClassName} mt-28 md:mt-14`}
            style={saveButtonStyle}
          >
            {saveButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
