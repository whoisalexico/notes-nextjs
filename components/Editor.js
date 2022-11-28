import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import React, {useContext} from 'react';
import dynamic from "next/dynamic";
import {EditorContext} from "../pages/index";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    {ssr: false}
);

function Editor() {
    const editorContext = useContext(EditorContext)
    return (
        <div>
            <MDEditor
                value={editorContext.currentNote.value}
                onChange={editorContext.updateNote}
                preview={'live'}
                height={928}
            />
        </div>
    );
}

export default Editor;