const newBookButton = document.querySelector('#new-book');
const addBookForm = document.querySelector('#add-book-form');
const booksList = document.querySelector('#books-list');
let myLibrary = JSON.parse(localStorage.getItem('books')) || [];

// Book constructor

function Book(title, author, nbPages) {
    this.title = title;
    this.author = author;
    this.nbPages = nbPages;
    this.read = false;
}
Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.nbPages} pages, ${this.read ? 'read' : 'not read yet'}`;
}
Book.prototype.toggleRead = function() {
    this.read = !this.read;
    //this.read = this.read ? false : true;
}

// Library

// when the book is in the local storage, it loosed is prototype, so its methods too
myLibrary.map(book => {
    // TEMP add Book.prototype to the objects from the localStorage
    book.__proto__ = Book.prototype;
});



function createBookItem(title, author, nbPages, read, bookIndex) {
    const li = document.createElement('li');
    li.setAttribute("data-book-index",bookIndex);
    const bookTitleText = document.createElement('p');
    bookTitleText.textContent = title;
    const bookAuthorText = document.createElement('p');
    bookAuthorText.textContent = author;
    const bookNbPagesText = document.createElement('p');
    bookNbPagesText.textContent = nbPages;
    const button = document.createElement('button');
    button.setAttribute('data-action', "change-status");
    button.textContent = read ? 'read' : 'unread';
    const removeButton = document.createElement('button');
    removeButton.setAttribute('data-action', "remove");
    removeButton.textContent = "Remove";

    li.appendChild(bookTitleText);
    li.appendChild(bookAuthorText);
    li.appendChild(bookNbPagesText);
    li.appendChild(button);
    li.appendChild(removeButton);
    
    return li;
}

// NewBook Form, remove and change

function displayBooks(library) {
    while (booksList.firstChild) {    
        booksList.removeChild(booksList.firstChild);
    }
    library.forEach((book,bookIndex) => {
        const bookItem = createBookItem(book.title, book.author, book.nbPages, book.read, bookIndex);
        booksList.appendChild(bookItem); 
    });
}

function addBookToLibrary(title, author, nbPages, read) {
    const newBook = new Book(title, author, nbPages);
    newBook.read = read;
    myLibrary.push(newBook);
    localStorage.setItem('books', JSON.stringify(myLibrary));
}

function removeBook(index) {
    myLibrary.splice(index, 1);
    displayBooks(myLibrary);
    localStorage.setItem('books', JSON.stringify(myLibrary));
}

function toggleReadStatus(index) {
    myLibrary[index].toggleRead();
    textContent = myLibrary[index].read ? 'read' : 'unread';
    displayBooks(myLibrary);
    localStorage.setItem('books', JSON.stringify(myLibrary));
}

function manageNewBookSubmit(e) {
    e.preventDefault();
    const bookTitle = addBookForm.querySelector('#book-title').value;
    const bookAuthor = addBookForm.querySelector('#book-author').value;
    const bookNbPages = addBookForm.querySelector('#book-nb-page').value;
    let bookRead = addBookForm.querySelector('#book-read');
    bookRead.checked ? bookRead = true :bookRead = false;

    addBookToLibrary(bookTitle, bookAuthor, bookNbPages, bookRead);
    displayBooks(myLibrary);
    // reset the inputs
    addBookForm.querySelectorAll('.add-input').forEach(input => input.value = "");
    addBookForm.querySelector('[type="checkbox"]').checked = false;
    addBookForm.classList.remove('display');
}


newBookButton.addEventListener('click', () => addBookForm.classList.add('display'));
addBookForm.addEventListener('submit', manageNewBookSubmit);
booksList.addEventListener('click', (e) => {
    const bookIndex = e.target.parentNode.dataset.bookIndex;
    switch(e.target.dataset.action) {
        case "remove": 
            removeBook(bookIndex);
            break;
        case "change-status":
            toggleReadStatus(bookIndex);
        }
    });

displayBooks(myLibrary)
