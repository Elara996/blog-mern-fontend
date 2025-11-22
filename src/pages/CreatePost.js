import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Navigate } from "react-router-dom";
import { Bold, Italic, List, ListOrdered, Underline, Link } from "lucide-react";

// Menu Component
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  // Render buttons for text formatting
  return (
    <div
      className="editor-menu"
      style={{
        border: "1px solid #ccc",
        padding: "5px",
        display: "flex",
        gap: "5px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold"
        style={{ padding: "5px", border: "none", cursor: "pointer" }}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic"
        style={{ padding: "5px", border: "none", cursor: "pointer" }}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        title="Bullet List"
        style={{ padding: "5px", border: "none", cursor: "pointer" }}
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        title="Numbered List"
        style={{ padding: "5px", border: "none", cursor: "pointer" }}
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
};

//  Main Component
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: "border: 1px solid #ccc; padding: 10px; min-height: 200px;",
      },
    },
  });

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", editor.getHTML());

    if (files && files.length > 0) {
      data.set("cover", files[0]);
    } else {
      alert("Error: Please select a cover image before submitting.");
      return;
    }

    // Send the data to your backend API
    const response = await fetch("http://localhost:5000/api/post", {
      method: "POST",
      credentials: "include",
      body: data,
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      try {
        const errorData = await response.json();
        console.error("Post Creation Failed:", errorData);
        alert(
          `Failed to create post. Status: ${response.status}. Check console for details.`
        );
      } catch (e) {
        alert(
          `Failed to create post. Status: ${response.status}. Server response was not JSON.`
        );
      }
    }
  }

  // Handle successful redirect
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  if (!editor) {
    return null;
  }

  return (
    <form
      onSubmit={createNewPost}
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        style={{ width: "100%", padding: "10px", margin: "5px 0" }}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
        style={{ width: "100%", padding: "10px", margin: "5px 0" }}
      />
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
        style={{ margin: "10px 0" }}
      />

      <div
        className="tiptap-editor-container"
        style={{ border: "1px solid #ccc", marginBottom: "10px" }}
      >
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#333",
          color: "white",
          border: "none",
        }}
      >
        Create Post
      </button>
    </form>
  );
}
