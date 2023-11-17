import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot } from "firebase/firestore"
import { notesCollection } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState(JSON.parse(localStorage.getItem("notes")) || [])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => {
            let updatedArr = oldNotes.map(oldNote => {
                return oldNote.id === currentNoteId
                    ? { ...oldNote, body: text }
                    : oldNote
            })
            let updatedElement = updatedArr.find(e => e.id == currentNoteId)
            return [updatedElement, ...updatedArr.filter(e2 => e2.id !== updatedElement.id)]
        })
    }
    
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, snapShot => {
            const notesArray = snapShot.docs.map(doc => {
                return {
                    ...doc.data(), 
                    id: doc.id
                }
            })
            setNotes(notesArray)
        })
        return unsubscribe
    }, [])

    function deleteNote(e, noteId) {
        e.stopPropagation()
        setNotes(prev => prev.filter(e => e.id !== noteId))
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    trashIconClickEvent={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={currentNote} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
