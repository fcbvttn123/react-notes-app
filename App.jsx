import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([]) 
    const [currentNoteId, setCurrentNoteId] = React.useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    // Tutorial: 
        // const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here", 
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
    }
    
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, snapShot => {
            const notesArray = snapShot.docs.map(doc => {
                return {
                    ...doc.data(), 
                    id: doc.id
                }
            })
            setNotes(notesArray.sort((a, b) => b.updatedAt - a.updatedAt))
        })
        return unsubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
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
                    // Tutorial: notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    trashIconClickEvent={deleteNote}
                />

                <Editor 
                    currentNote={currentNote} 
                    updateNote={updateNote} 
                />
                
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
