export const getCategoryIcon = (category, categories) =>
    categories.find((c) => c.name === category).icon;

export const formatCategory = (category) =>
    category.toLowerCase().replace(" ", "-");

export const countNotesByCategory = (category, notes) => {
    let activeNotes = 0;
    let archivedNotes = 0;

    notes.forEach((note) => {
        if (note.category === category)
            note.isArchived ? archivedNotes++ : activeNotes++;
    })
    return {
        activeNotes,
        archivedNotes
    };
};