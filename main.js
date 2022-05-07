const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";


function generateId(){
    return +new Date();
}

function generateBookObject(id, book, author, year, isComplete){
    return{
        id: +new Date(),
        book,
        author,
        year,
        isComplete
    }
}

function createBook(bookObject){

    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.book;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("action")
    textContainer.append(textTitle,textAuthor,textYear);

    const container = document.createElement("div");
    container.classList.add("book_item")
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener("click", function(){
        alert("anda ingin menghapus buku?");
        removeBookFromCompleted(bookObject.id);
    });

    if(bookObject.isComplete){

        const undoButton = document.createElement("button");
        undoButton.classList.add("green");
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener("click", function(){
            undoBookFromCompleted(bookObject.id);
        });

        container.append(undoButton,trashButton);
    } else {
        
        const checkButton = document.createElement("button");
        checkButton.classList.add("green");
        checkButton.innerText = "Selesai Dibaca";
        checkButton.addEventListener("click", function(){
            addBookToCompleted(bookObject.id);
        });
        container.append(checkButton, trashButton);
    }

    return container;
}

function addBook(){
    
    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;
    const checkBox = document.getElementById("inputBookIsComplete").checked;

    const generatedId = generateId();
    const bookObject = generateBookObject(generateId,titleBook,authorBook, +yearBook,checkBox);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null;
}

function removeBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget,1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId){

    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
}

document.addEventListener(RENDER_EVENT, function (){
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";

    for(bookItem of books){
        const bookElement = createBook(bookItem);
        if(bookItem.isComplete){
        completeBookshelfList.append(bookElement);
        }else{
        incompleteBookshelfList.append(bookElement);
        }
    }
});

document.addEventListener("DOMContentLoaded",function(){
    const submitBook = document.getElementById("inputBook");

    submitBook.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser tidak mendukung");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem (STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchButton = document.getElementById("searchSubmit");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  const bookList = document.getElementById("searchBookTitle").value;
  const filter = document.querySelectorAll(".book_item");
  for (buku of filter) {
    const judul = buku.innerText;

    if (judul.includes(bookList)) {
      buku.style.display = "block";
    } else {
      buku.style.display = "none";
    }
  }
});