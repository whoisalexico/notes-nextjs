import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Layout, Button} from "antd";
import {notesdb} from "../components/db";
import NotesList from "../components/NotesList";
import {createContext, useEffect, useState} from "react";
import Editor from "../components/Editor";

const {Sider, Content} = Layout;

export const NotesContext = createContext();
export const EditorContext = createContext();

export default function Home() {
    let notesList = [];

    const [notes, setNotes] = useState([]);

    const [currentNoteId, setCurrentNoteId] = useState((notesList[0] && notesList[0].id) || '');

    useEffect(() => {
        notesdb.toArray().then((data) => {
            notesList = data;
            setNotes(notesList);
        })
    }, [currentNoteId]);

    function addNote() {
        notesdb.add({
            value: "Type your note here🤨🤨🙂",
        }).then((data) => {
            setCurrentNoteId(data);
        })
        setNotes(notesList);
    }

    function updateNote(text) {
        setNotes((oldNotes) => {
            const newArray = [];
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i];
                if (oldNote.id === currentNoteId)
                    newArray.unshift({...oldNote, value: text});
                else
                    newArray.push(oldNote);
            }
            return newArray;
        })
        notesdb.update(currentNoteId, {"value": text});
    }

    function findCurrentNote() {
        return (
            notes.find((currentNote) => {
                return currentNote.id === currentNoteId;
            }) || notes[0])
    }

    function deleteNote(event, noteId) {
        notesdb.delete(noteId);
        setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId))
    }

    const notesContext = {
        notes: notes,
        currentNote: findCurrentNote(),
        setCurrentNoteId: setCurrentNoteId,
        newNote: addNote,
        deleteNote: deleteNote
    }

    const editorContext = {
        currentNote: findCurrentNote(),
        updateNote: updateNote
    }

    return (
        <div>
            <Head>
                <title>Notes App</title>
                <meta name="description" content="Notes app made by nextjs"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                {notes.length > 0 ? (
                    <Layout>
                        <Sider width={350}>
                            <NotesContext.Provider value={notesContext}>
                                <NotesList/>
                            </NotesContext.Provider>
                        </Sider>
                        <Content>
                            {currentNoteId && notes.length > 0 && (
                                <EditorContext.Provider value={editorContext}>
                                    <Editor/>
                                </EditorContext.Provider>
                            )}
                        </Content>
                    </Layout>
                ) : (
                    <div className={styles.noNotes}>
                        <h1 className={styles.noNotesTitle}>You have no notes</h1>
                        <Button onClick={addNote}>Add new one</Button>
                    </div>
                )}
            < /main>
        </div>
    )
}
