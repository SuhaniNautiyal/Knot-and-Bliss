//FOR GUEST-LIST
const guestCollection = db.collection("guests");

function displayGuests(){
    let guestList=document.getElementById("guestList");
    guestList.innerHTML="";

    guestCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            const guest = doc.data();
            const id = doc.id;
        
    
        let card = document.createElement("div");
        card.className="guest-card";

        card.innerHTML=`
        <h3>${guest.name}</h3>
        <p>${guest.phone}</p>
        <p>RSVP:${guest.rsvp}</p>
        <button onclick="editGuest('${id}', '${guest.name}', '${guest.phone}', '${guest.rsvp}')">Edit</button>
        <button onclick="deleteGuest('${id}')">Delete</button>
        `;

        guestList.appendChild(card);
    });
});
}

function addGuest(){
    let name=document.getElementById("guestName").value.trim();
    let phone=document.getElementById("guestPhone").value.trim();
    let rsvp=document.getElementById("guestRSVP").value;

    if(name === "" || phone === "") {
        alert("Please fill all fields!");
        return;
    }
    guestCollection.add({
        name: name,
        phone: phone,
        rsvp: rsvp
    }).then(() => {

    
    displayGuests();

    document.getElementById("guestName").value="";
    document.getElementById("guestPhone").value="";
    });
}

function deleteGuest(id) {
    if(confirm("Are you sure you want to delete this guest?")){
        guestCollection.doc(id).delete().then(() => {
        displayGuests();
    });
}
}

function editGuest(id, name, phone, rsvp) {
    
    document.getElementById("guestName").value=name;
    document.getElementById("guestPhone").value=phone;
    document.getElementById("guestRSVP").value=rsvp;
    guestCollection.doc(id).delete().then(() =>{
    displayGuests();
    });
}

window.onload=displayGuests;

//FOR BUDGET
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
 const expenseCollection = collection(window.db, "expenses");

async function displayExpenses() {
    const budgetList = document.getElementById("budgetList");
    budgetList.innerHTML="";
    let total = 0;
    const querySnapshot = await getDocs(expenseCollection);
    let categoryTotals = {};
    querySnapshot.forEach((docSnap) => {
        const expense = docSnap.data();
        const id = docSnap.id; 
        const card = document.createElement("div");  
        card.className = "guest-card";
        card.innerHTML=`
        <h3>${expense.name}</h3>
        <p>Rs ${expense.amount}</p>
        <p>Category: ${expense.category}</p>
        <button onclick="editExpense('${id}')">Edit</button>
        <button onclick="deleteExpense('${id}')">Delete</button>
        `;
        budgetList.appendChild(card);
        total += Number(expense.amount);
        
        if(!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
           categoryTotals[expense.category] += Number(expense.amount);
        
    });

    document.getElementById("totalBudget").innerText = total;
    updatePieChart(categoryTotals);
}

async function addExpense() {
    const name = document.getElementById("expenseName").value.trim();
    const amount = document.getElementById("expenseAmount").value.trim();
    const category = document.getElementById("expenseCategory").value;

    if(name === "" || amount === ""){
        alert("Please fill all fields!");
        return;
    }
    if(editingId) {
    await updateDoc(doc(expenseCollection, editingId), {
        name,
        amount: Number(amount),
        category
    });
    editingId = null;
} else {
    await addDoc(expenseCollection, {
        name,
        amount: Number(amount),
        category
    });
}

    displayExpenses();
    document.getElementById("expenseName").value="";
    document.getElementById("expenseAmount").value="";
}

async function deleteExpense(id) {
    if(confirm("Are you sure you want to delete this expense?")) {
        await deleteDoc(doc(expenseCollection, id));
        displayExpenses();
    }
}

let editingId = null;
async function editExpense(id) {
    const expenseDoc = await getDoc(doc(expenseCollection, id));
    const expense = expenseDoc.data();
    document.getElementById("expenseName").value=expense.name;
    document.getElementById("expenseAmount").value=expense.amount;
    document.getElementById("expenseCategory").value=expense.category;
    
    editingId = id;
}


let budgetChart;
function updatePieChart(categoryTotals) {
    const categories = Object.keys(categoryTotals);
    const totals = Object.values(categoryTotals);

    if(budgetChart){
        budgetChart.destroy();
    }
    const ctx= document.getElementById("budgetChart").getContext("2d");
    budgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: "Expense Breakdown",
                data: totals,
                backgroundColor: [
                    "#ffb4a2",
                    "#ffcdb2",
                    "#f4a261",
                    "#e5989b",
                    "#b5838d",
                    "#6d6875"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
window.onload = displayExpenses;
window.addExpense = addExpense;
window.deleteExpense = deleteExpense;
window.editExpense = displayExpenses
//MUSIC PLAYLIST
let songs =JSON.parse(localStorage.getItem("songs")) || [];
function displaySongs(){
    let playlist = document.getElementById("playlist");
        playlist.innerHTML = "";
        songs.forEach((song, index) => {
            let card = document.createElement("div");
            card.className = "guest-card";

            card.innerHTML =`
            <h3>${song.name}</h3>
            <p>Artist: ${song.artist}</p>
            <p>Category: ${song.category}</p>
            <button onclick="editSong(${index})">Edit</button>
            <button onclick="deleteSong(${index})">Delete</button>

            `;
            playlist.appendChild(card);
        });
    
}

function addSong(){
    let name = document.getElementById("songName").value.trim();
    let artist = document.getElementById("artistName").value.trim();
    let category= document.getElementById("songCategory").value;
    if(name === "" || artist === "") {
        alert("Please fill all fields!");
        return;
    }
    songs.push({name, artist, category});
    localStorage.setItem("songs", JSON.stringify(songs));
    displaySongs();

    document.getElementById("songName").value="";
    document.getElementById("artistName").value="";
}
function deleteSong(index) {
    if(confirm("Are you sure you want to delete this song?")) {
        songs.splice(index, 1);
        localStorage.setItem("songs", JSON.stringify(songs));
        displaySongs();
    }
}

function editSong(index){
    let song = songs[index];
    document.getElementById("songName").value = song.name;
    document.getElementById("artistName").value = song.artist;
    document.getElementById("songCategory").value = song.category;
    songs.splice(index, 1);
    localStorage.setItem("songs", JSON.stringify(songs));
    displaySongs();
}
window.onload=displaySongs;

//VENDOR LIST
let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

function displayVendors() {
    let vendorList = document.getElementById("vendorList");
    vendorList.innerHTML="";

    vendors.forEach((vendor, index) =>{
        let card = document.createElement("div");
        card.className = "guest-card";

        card.innerHTML = `
        <h3>${vendor.name}</h3>
        <p>Phone: ${vendor.phone}</p>
        <p>Email: ${vendor.email}</p>
        <p>Category: ${vendor.category}</p>
        <p>Notes: ${vendor.notes}</p>
        <button onclick="editVendor(${index})">Edit</button>
        <button onclick="deleteVendor(${index})">Delete</button>
        `;

        vendorList.appendChild(card);
    });
}

function addVendor() {
    let name=document.getElementById("vendorName").value.trim();
    let phone=document.getElementById("vendorPhone").value.trim();
    let email=document.getElementById("vendorEmail").value.trim();
    let notes=document.getElementById("vendorNotes").value.trim();
    let category=document.getElementById("vendorCategory").value;

    if(name === "" || phone === ""){
        alert("Please fill name and contact number!");
        return;
    }

    vendors.push({name, email, phone, notes, category});
    localStorage.setItem("vendors", JSON.stringify(vendors));
    displayVendors();

    document.getElementById("vendorName").value="";
    document.getElementById("vendorPhone").value="";
    document.getElementById("vendorEmail").value="";
    document.getElementById("vendorNotes").value="";

}

function deleteVendor(index) {
    if(confirm("Are you sure you want to delete this vendor?")) {
        vendors.splice(index, 1);
        localStorage.setItem("vendors", JSON.stringify(vendors));
        displayVendors();
    }
}

function editVendor(index) {
    let vendor = vendors[index];
    document.getElementById("vendorName").value=vendor.name;
    document.getElementById("vendorPhone").value=vendor.phone;
    document.getElementById("vendorEmail").value=vendor.email;
    document.getElementById("vendorNotes").value=vendor.notes;
    document.getElementById("vendorCategory").value=vendor.category;

    vendors.splice(index, 1);
    localStorage.setItem("vendors", JSON.stringify(vendors));
    displayVendors();

}
window.onload=displayVendors;

