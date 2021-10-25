const createForm = document.querySelector("#addNewNote");
const showNotes = document.querySelector('#showNotes');
const searchNotes = document.querySelector('#searchValue');
const checkbox = document.querySelector('input[type="checkbox"]');

const popup = document.querySelector('.popup-wrapper');
const popupForm = document.querySelector('.edit-add-notes');


//  Get documents 
 db.collection('notes').onSnapshot(snapshot => {
     // When we have the data 
     snapshot.docChanges().forEach(change => {

        const doc = change.doc;

        if(change.type ==  'added') {
            addNote(doc.data(), doc.id);
        }

        else if(change.type == 'removed') {
            deleteNote(doc.id);

            return;
        }

        let getNoteID = document.querySelector(`li[data-id="${ doc.id }"]`);
        let showImportant = getNoteID.querySelector('#importantNote');

        if(doc.get('important') === true) {
            showImportant.innerText = 'Important note';
        }

        else {
            showImportant.innerText = 'Not important note';
        }

     })
 });

// How we list them in our HTML page 
const addNote = (note, id) => {

    let time = new Date(note.created_at.toMillis());
    const dateString = time.toLocaleString();

    let html = `
    <li data-id="${ id }" class="noteDesign">
        <h4 class="title">${ note.title }</h4>
        <p class="description">${ note.body }</p>
        <p class="dateDesign"> ${ dateString } </p>
        <p id="importantNote"></p> 
        <i class="fas fa-trash"></i>
        <i class="fas fa-pen"></i>
    </li>
    `;

    showNotes.innerHTML += html;
}


// Add documents 
createForm.addEventListener('submit', e => {
    e.preventDefault(); 

    const dateNow = new Date();
    let importantMSGOutput = '';

    if(inputImportant.checked) {
        importantMSGOutput = true;
    }
    else {
        importantMSGOutput = false;
    }

    const newnote = {
        title: createForm.querySelector('#title').value,
        body: createForm.querySelector('#body').value,
        important: importantMSGOutput,
        created_at: firebase.firestore.Timestamp.fromDate(dateNow)
    };

    db.collection('notes').add(newnote).then(() => {
        // location.reload();
        console.log('Note added!');

        createForm.querySelector('#title').value = '';
        createForm.querySelector('#body').value = '';
        inputImportant.checked = false;

    }).catch(err => {
        console.log(err);
    });
});


const deleteNote = (id) => {

    const notes = document.querySelectorAll('li');

    notes.forEach(note => {

        if(note.getAttribute('data-id') === id){
            note.remove();
        }

    });

}

// Deleting Data 
showNotes.addEventListener('click', e => {

    if(e.target.className == 'fas fa-trash') {

        const id = e.target.parentElement.getAttribute('data-id');

        db.collection('notes').doc(id).delete().then(() => {
            console.log('deleted');
        });

    }
});

const filterNotes = (term) => {


    Array.from(showNotes.children)
     .filter((notesBow) => !notesBow.textContent.toLowerCase().includes(term))
     .forEach((notesBow) => notesBow.classList.add('filtered'));


    Array.from(showNotes.children)
    .filter((notesBow) => notesBow.textContent.toLowerCase().includes(term))
    .forEach((notesBow) => notesBow.classList.remove('filtered'));

};

searchNotes.addEventListener('keyup', () => {
    const term = searchNotes.value.trim().toLowerCase();
    filterNotes(term);
});



// Making a function that we have on our input in html "onclick showImpNotes"
function showImpNotes() {
    // Then we grab our filterImportant ID on our input and check if it is checked 
    if (document.getElementById('filterImportant').checked) {

        db.collection('notes').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
    
                const id = doc.id;
                const data = doc.data();
                const notesCard = document.querySelector(`li[data-id="${id}"]`);
                
            // If the checkbox isn't checked then display none, because we only want to see the important notes
            if (data.important != true) {
                notesCard.style.display = 'none';
            }
        })  
    });
}
    
    else {
        db.collection('notes').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
    
                const id = doc.id;
                const notesCard = document.querySelector(`li[data-id="${id}"]`);

                notesCard.style.display = 'inline-block';
            })  
        });
    }
}


// THE EDIT PART DOES NOT WORK 100% BUT ITS ALMOST THERE! 


// Edit data 
showNotes.addEventListener('click', e => {
    console.log('Your note has been edited')
    if(e.target.className === 'fas fa-pen'){
       const id = e.target.parentElement.getAttribute('data-id'); 
       db.collection('notes').doc(id).get().then(snapshot => {
       popup.style.display = 'block';
       popupForm.title.value = snapshot.data().title,
       popupForm.body.value = snapshot.data().body,
       popupForm.important.value = snapshot.data().important,
       popupForm.fireId.value = id
       }
    )
    }
});


// Edit data - save changes
popupForm.addEventListener('submit', e => { 
    e.preventDefault();
    let id = popupForm.fireId.value;
    console.log(e.target.tagName);
    if(e.target.tagName === 'FORM') { 
    
    db.collection('notes').doc(id).update({
        title: popupForm.title.value,
        body: popupForm.body.value,
        important: popupForm.important.value
    });
    popup.classList.remove();
};
});

showNotes.addEventListener('click', e => {
    if(e.target.id === 'fas fa-pen'){
       const id = e.target.parentElement.getAttribute('data-id'); 
       db.collection('Notes').doc(id).delete().then(() => {
           console.log('Notes edited');
       });
    }
});






















