let notes = JSON.parse(localStorage.getItem("notes")) || [];
function displayNotes() {
    let notesList = document.getElementById("notesList");
    notesList.innerHTML="";
    notes.forEach((note, index) =>{
        let card = document.createElement("div");
        card.className="guest-card";

        card.innerHTML = `
        <p>${note}</p>
        <button onclick="editNote(${index})">Edit</button>
        <button onclick="deleteNote(${index})">Delete</button>
        `;

        notesList.appendChild(card);
    });
}
function addNote() {
    let content = document.getElementById("noteContent").value.trim();
    if(content === ""){
        alert("Please write something!");
        return;
    }

    notes.push(content);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();

    document.getElementById("noteContent").value="";
}

function deleteNote(index) {
    if(confirm("Delete this note?")) {
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        displayNotes();
        
    }
}

function editNote(index){
    let content = notes[index];
    document.getElementById("noteContent").value = content;
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();

}
window.onload = displayNotes;

//Rituals MANAGER
let rituals = JSON.parse(localStorage.getItem("rituals")) || [];
function displayRituals() {
    let ritualList  = document.getElementById("ritualList");
    ritualList.innerHTML = "";

    rituals.forEach((ritual, index) => {
        let card = document.createElement("div");
        card.className = "guest-card";
        let doneClass = ritual.done ? "text-decoration: line-through; opacity: 0.7;" : "";

        card.innerHTML = `
        <p style="${doneClass}">${ritual.name}</p>
        <button onclick="toggleDone(${index})">${ritual.done ? 'Undo' : 'Done'}</button>
        <button onclick="editRitual(${index})">Edit</button>
        <button onclick="deleteRitual(${index})">Delete</button>
        `;
        ritualList.appendChild(card);
    });
}
function addRitual(){
    let name = document.getElementById("ritualItem").value.trim();
    if(name === "") {
        alert("Please enter an item!");
        return;
    }

    rituals.push({name, done:false});
    localStorage.setItem("rituals", JSON.stringify(rituals));
    displayRituals();
    document.getElementById("ritualItem").value="";
}

function toggleDone(index){
    rituals[index].done = !rituals[index].done;
    localStorage.setItem("rituals", JSON.stringify(rituals));
    displayRituals();
}

function deleteRitual(index) {
    if(confirm("Delete this item?")) {
        rituals.splice(index, 1);
        localStorage.setItem("rituals", JSON.stringify(rituals));
        displayRituals();
    }
}

function editRitual(index){
    let ritual = rituals[index];
    document.getElementById("ritualItem").value=ritual.name;
    rituals.splice(index, 1);
    localStorage.setItem("rituals", JSON.stringify(rituals));
    displayRituals();
}

window.onload=displayRituals;