import { NOTES_DATA, CATEGORIES } from '../data/mock.js';
import { getDateList, formatDate } from '../helpers/date.js';
import { getCategoryIcon, countNotesByCategory, formatCategory } from '../helpers/categories.js';

const notesTableElement = document.querySelector('.notes-table tbody');
const summaryTableElement = document.querySelector('.summary-table tbody');

const showArchivedNotesButton = document.querySelector('.show-archived-notes-button');
const showActiveNotesButton = document.querySelector('.show-active-notes-button');

const addNoteButton = document.querySelector('.add-button');
const popUpElement = document.querySelector('.popup');

let notesList = [];
let isArchiveMode = false;

const showNotesTable = () => {
    let noteTableElements = '';

    notesList.map((note) => {
        if (note.isArchived == isArchiveMode) {
            noteTableElements += `
            <tr>
                <td>
                    ${getCategoryIcon(note.category, CATEGORIES)}
                </td>
                <td>${note.name}</td>
                <td>${formatDate(note.created)}</td>
                <td>${note.category}</td>
                <td>${note.content}</td>
                <td>${getDateList(note.content)}</td>
                ${showControlPanel(note)}
            </tr> `;
        }
    });

    notesTableElement.innerHTML = noteTableElements;
};

const showControlPanel = (note) => {
    if (!isArchiveMode) {
        return `
        <td class="control-panel">
            <button onclick=showEditForm(${note.id})>
                <i class="fa-solid fa-pencil"></i>
            </button>
            <button onclick=archiveNote(${note.id})>
                <i class="fa-solid fa-box-archive"></i></button>
             <button onclick=deleteNote(${note.id})>
                <i class="fa-solid fa-trash"></i>
            </button>
        </td> `;
    }

    return `
    <td class="control-panel">
        <button onclick=unarchiveNote(${note.id})>
            <i class="fa-solid fa-box-open"></i>
        </button>
        <button onclick=deleteNote(${note.id})>
            <i class="fa-solid fa-trash"></i>                    
        </button>
    </td>`;
};

const showButtonsCategory = () => {
    let radioButtonElements = '';

    CATEGORIES.map((category) => {
        radioButtonElements += `
        <input type="radio" class="edit-note-category-${formatCategory(category.name)}"
        name="category" value="${category.name}">            
        <label for="edit-note-category-${formatCategory(category.name)}">${category.name}</label>`;
    });
    return radioButtonElements;
};

const showSummaryTable = () => {
    let summaryTableElements = '';

    CATEGORIES.map((category) => {
        const notesCount = countNotesByCategory(category.name, notesList);

        summaryTableElements += `
        <tr>
            <td>${category.icon}</td>
            <td>${category.name}</td>
            <td>${notesCount.activeNotes}</td>
            <td>${notesCount.archivedNotes}</td>
        </tr> `;
    });

    summaryTableElement.innerHTML = summaryTableElements;
};

const showAddForm = () => {
    popUpElement.classList.remove('d-none');

    popUpElement.innerHTML = `
    <div class="popup-add">
        <div class="card">
            <div class="card-header">Add new note</div>
            <div class="card-body">
                <form class="add-note-form" onsubmit="addNote(event)">
                    <div>
                        <label for="add-note-name-input">Name:</label>
                        <input type="text" name="name" id="add-note-name-input">
                    </div>
                    <div>
                        <label for="add-note-content-input">Content:</label>
                        <textarea name="content" id="add-note-content-input"></textarea>
                    </div>
                    <div>
                        <p>Please select a note category:</p>
                        ${showButtonsCategory()}
                    </div>
                    <button type="submit">Save</button>
                    <button type="reset" class="close-add-note-form" onclick="dismissForm()">Close</button>
                </form>
            </div>
        </div>
    </div>`;
};

let noteId = 1;

const fillMockedNotes = (mockedNotes) => {
    mockedNotes.map((note) => {
        notesList.push({
            id: noteId++,
            created: new Date(),
            isArchived: false,
            ...note
        });
    });
};

const validateForm = (formData) => {
    const category = CATEGORIES.find((category) => category.name === formData.getAll('category')[0]);

    return formData.getAll('name')[0] && category && formData.getAll('content')[0];
};

window.deleteNote = (id) => {
    const noteIndex = notesList.find(note => note.id === id);
    notesList.splice(noteIndex, 1);

    showNotesTable();
    showSummaryTable();
};

window.archiveNote = (id) => {
    notesList.find(note => note.id === id).isArchived = true;

    showNotesTable();
    showSummaryTable();
};

window.unarchiveNote = (id) => {
    notesList.find(note => note.id === id).isArchived = false;

    showNotesTable();
    showSummaryTable();
};

window.addNote = (event) => {
    event.preventDefault();

    const formData = new FormData(document.querySelector('.add-note-form'));

    if (validateForm(formData)) {
        notesList.push({
            id: noteId++,
            created: new Date(),
            name: formData.getAll('name')[0],
            category: formData.getAll('category')[0],
            content: formData.getAll('content')[0],
            isArchived: false,
        });

        dismissForm();
        showNotesTable();
        showSummaryTable();
    } else {
        alert('Fill in the fields correctly!');
    }
};

window.editNote = (event, id) => {
    event.preventDefault();

    const noteToEditIndex = notesList.findIndex(note => note.id === id)
    const formData = new FormData(document.querySelector('.edit-note-form'));

    if (validateForm(formData)) {
        notesList[noteToEditIndex] = {
            ...notesList[noteToEditIndex],
            name: formData.getAll('name')[0],
            category: formData.getAll('category')[0],
            content: formData.getAll('content')[0],
        }

        dismissForm();
        showNotesTable();
        showSummaryTable();
    } else {
        alert('Fill in the fields correctly!');
    }
};

window.dismissForm = () => {
    popUpElement.innerHTML = '';
    popUpElement.classList.add('d-none');
};

window.showEditForm = (id) => {
    popUpElement.classList.remove('d-none');
    const editNote = notesList.find(note => note.id === id);

    popUpElement.innerHTML = `
    <div class="popup-edit">
        <div class="card">
            <div class="card-header">Edit Note 
                <button class="close-edit-note-form" onclick="dismissForm()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="card-body">
                 <form class="edit-note-form" onsubmit="return editNote(event, ${id})">
                     <div>
                            <label for="edit-note-name-input">Name:</label>
                            <input type="text" name="name" id="edit-note-name-input" value="${editNote.name}">
                        </div>
                        <div>
                            <label for="edit-note-content-input">Content:</label>
                            <textarea name="content" id="edit-note-content-input">
                                ${editNote.content}
                            </textarea>
                        </div>
                        <div>
                            <p>Please select a note category:</p>
                            ${showButtonsCategory()}
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>`;

    document.querySelector(`.edit-note-category-${formatCategory(editNote.category)}`).checked = true;
};

showArchivedNotesButton.addEventListener('click', (e) => {
    e.preventDefault();
    showArchivedNotesButton.classList.add('d-none');
    showActiveNotesButton.classList.remove('d-none');
    isArchiveMode = true;
    showNotesTable();
});

showActiveNotesButton.addEventListener('click', (e) => {
    e.preventDefault();
    showActiveNotesButton.classList.add('d-none');
    showArchivedNotesButton.classList.remove('d-none');
    isArchiveMode = false;
    showNotesTable();
});

addNoteButton.addEventListener('click', (e) => {
    e.preventDefault();
    showAddForm();
});

fillMockedNotes(NOTES_DATA);
showNotesTable();
showSummaryTable();
