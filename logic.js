// function Book(title, author, nbPages) {
//     this.title = title;
//     this.author = author;
//     this.nbPages = nbPages;
//     this.read = false;
//     // this.info = function() {
//     //     return `${this.title} by ${this.author}, ${this.nbPages} pages, ${this.read ? 'read' : 'not read yet'}`;
//     // }
// }
// // If we declare the function directly in the constructor, that function would be duplicated every time a new Book is created
// Book.prototype.info = function() {
//     return `${this.title} by ${this.author}, ${this.nbPages} pages, ${this.read ? 'read' : 'not read yet'}`;
//     }

// const theHobbit = new Book("The Hobbit", "J. R. R. Tolkien", 295);

/////////////////////////////////////////////////////////////////////////////:

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
    this.read = this.read ? false : true;
}

const addBookForm = document.querySelector('#add-book-form');
const booksList = document.querySelector('#books-list');
let myLibrary = JSON.parse(localStorage.getItem('books')) || [];
myLibrary.map(book => {
    // TEMP add Book.prototype to the objects from the localStorage
    book.__proto__ = Book.prototype;
})

displayBooks(myLibrary);
console.log(myLibrary);

function addBookToLibrary(title, author, nbPages, read) {
    const newBook = new Book(title, author, nbPages);
    newBook.read = read;
    myLibrary.push(newBook);
    localStorage.setItem('books', JSON.stringify(myLibrary));
}

function displayBooks(library) {
    while (booksList.firstChild) {    
        booksList.removeChild(booksList.firstChild);
    }
    library.map(book => {
        // create a list item and add them (=> to group in its own function)
        const li = document.createElement('li');
        const bookTitleText = document.createElement('p');
        bookTitleText.textContent = book.title;
        const bookAuthorText = document.createElement('p');
        bookAuthorText.textContent = book.author;
        const bookNbPagesText = document.createElement('p');
        bookNbPagesText.textContent = book.nbPages;
        // const bookReadText = document.createElement('p');
        // bookReadText.textContent = "is read: " + book.read;
        const button = document.createElement('button');
        button.textContent = book.read ? 'read' : 'unread';
        
        button.addEventListener('click', function() {
            console.log(book);
            book.toggleRead();
            this.textContent = book.read ? 'read' : 'unread';
            localStorage.setItem('books', JSON.stringify(myLibrary));
        })
        // add the list item to the ul
        li.appendChild(bookTitleText);
        li.appendChild(bookAuthorText);
        li.appendChild(bookNbPagesText);
        // li.appendChild(bookReadText);
        li.appendChild(button);

        booksList.appendChild(li);    
    });
}


addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookTitle = addBookForm.querySelector('#book-title').value;
    const bookAuthor = addBookForm.querySelector('#book-author').value;
    const bookNbPages = addBookForm.querySelector('#book-nb-page').value;
    let bookRead = addBookForm.querySelector('#book-read');
    bookRead.checked ? bookRead = true :bookRead = false;

    addBookToLibrary(bookTitle, bookAuthor, bookNbPages, bookRead);
    displayBooks(myLibrary);

    addBookForm.querySelectorAll('.add-input').forEach(input => input.value = "");
    addBookForm.querySelector('[type="checkbox"]').checked = false;
})

