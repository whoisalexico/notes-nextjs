import React, {useContext, useState} from 'react';
import {Input, Button, Modal} from "antd";
import {NotesContext} from "../pages";
import styles from '../styles/notesList.module.css'

const {confirm} = Modal;

const {Search} = Input;


function NotesList() {
    const notesContext = useContext(NotesContext)
    const [searchValue, setSearchValue] = useState("");

    const showConfirm = (event, id) => {
        confirm({
            title: 'Do you Want to delete this item?',
            content: 'This item will be deleted immediately. You can\'t undo this action.',
            onOk() {
                notesContext.deleteNote(event, id);
            }
        });
    };

    const noteElements = notesContext.notes.filter(note=>{
        if(searchValue == "") {
            return note;
        }else if(note.value.toLowerCase().includes(searchValue.toLowerCase())){
            return note;
        }
    }).map((note, index) => (
        <div key={note.id}>
            <div
                className={styles.title}
                onClick={() => notesContext.setCurrentNoteId(note.id)}
            >
                <h3 className={styles.textSnippet}>{note.value.split('\n')[0]}</h3>
                <Button className={styles.deleteBtn} onClick={(event) => showConfirm(event, note.id)}>Delete</Button>
            </div>
        </div>
    ))

    return (
        <section className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div>
                    <h2>Markdown Notes</h2>
                    <Button className={styles.addBtn} onClick={notesContext.newNote}>Add</Button>
                </div>
                <Search onChange={event=> setSearchValue(event.target.value)} value={searchValue} placeholder={"Search..."} className={styles.search}/>
            </div>
            {noteElements}
        </section>
    );
}

export default NotesList;