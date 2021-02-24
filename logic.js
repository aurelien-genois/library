const newBookButton = document.querySelector('#new-book-btn');
const addBookForm = document.querySelector('#add-book-form');
const booksList = document.querySelector('#books-list');
const defaultData = [
    {"title":"The Hobbit","author":"J. R. R. Tolkien","nbPages":"320","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780547928227_p0_v2_s550x406.jpg"},
    {"title":"Concrete Rose","author":"Angie Thomas","nbPages":"320","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780063046788_p0_v2_s550x406.jpg"},
    {"title":"Fofo's Life","author":"Fofo","nbPages":"0","read":true,"coverLink":"https://i.ebayimg.com/images/g/-s4AAOSw90le2SMx/s-l400.jpg"},
    {"title":"Grown","author":"Tiffany D Jackson","nbPages":"384","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780062840356_p0_v2_s550x406.jpg"},
    {"title":"Brave New Worl","author":"Aldous Huxley","nbPages":"288","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780060850524_p0_v3_s550x406.jpg"},
    {"title":"Jujutsu Kaisen, Vol. 1","author":"Gege Akutami","nbPages":"192","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9781974710027_p0_v1_s550x406.jpg"},
    {"title":"To Kill a Mockingbird","author":"Harper Lee","nbPages":"384","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780446310789_p0_v6_s550x406.jpg"},
    {"title":"The Great Gatsby","author":"F. Scott Fitzgerald","nbPages":"208","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780743273565_p0_v8_s550x406.jpg"},
    {"title":"Felix Ever After","author":"Kacen Callender","nbPages":"368","read":false,"coverLink":"https://prodimage.images-bn.com/pimages/9780062820259_p0_v2_s550x406.jpg"}]
let myLibrary = JSON.parse(localStorage.getItem('books')) || defaultData;

// Book constructor

function Book(title, author, nbPages, coverLink) {
    this.title = title;
    this.author = author;
    this.nbPages = nbPages;
    this.read = false;
    this.coverLink = coverLink;
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
    Object.setPrototypeOf(book, Book.prototype);

});



function createBookItem(title, author, nbPages, read, bookIndex, coverLink) {
    
    const bookTitleText = document.createElement('p');
    bookTitleText.classList.add('book-title');
    bookTitleText.textContent = title;
    
    const bookCover = document.createElement('img');
    bookCover.classList.add('book-cover');
    // need to manage when the link is not a link or is dead
    bookCover.src = coverLink || "https://ravenspacepublishing.org/wp-content/uploads/2019/04/default-book.jpg"; 
    
    const bookAuthorText = document.createElement('p');
    bookAuthorText.classList.add('book-author');
    bookAuthorText.textContent = author;
    
    const bookNbPagesText = document.createElement('p');
    bookNbPagesText.classList.add('book-nb-pages');
    bookNbPagesText.textContent = "Number of pages: " + nbPages;
    
    const button = document.createElement('button');
    button.classList.add('btn-change-status');
    button.setAttribute('data-action', "change-status");
    button.textContent = read ? 'read' : 'unread';
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('btn-remove');
    removeButton.setAttribute('data-action', "remove");
    removeButton.textContent = "Remove";
    
    const bookButtons = document.createElement('div');
    bookButtons.classList.add('book-btns');
    bookButtons.appendChild(button);
    bookButtons.appendChild(removeButton);
    
    const li = document.createElement('li');
    li.setAttribute("data-book-index",bookIndex);
    li.appendChild(bookTitleText);
    li.appendChild(bookAuthorText);
    li.appendChild(bookCover);
    li.appendChild(bookNbPagesText);
    li.appendChild(bookButtons);
    
    return li;
}

// NewBook Form, remove and change

function displayBooks(library) {
    while (booksList.firstChild) {    
        booksList.removeChild(booksList.firstChild);
    }
    library.forEach((book,bookIndex) => {
        const bookItem = createBookItem(book.title, book.author, book.nbPages, book.read, bookIndex, book.coverLink);
        booksList.appendChild(bookItem); 
    });
}

function addBookToLibrary(title, author, nbPages, read, coverLink) {
    const newBook = new Book(title, author, nbPages, coverLink);
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
    displayBooks(myLibrary);
    localStorage.setItem('books', JSON.stringify(myLibrary));
}

function manageNewBookSubmit(e) {
    e.preventDefault();
    const bookTitle = addBookForm.querySelector('#form-book-title').value;
    const bookAuthor = addBookForm.querySelector('#form-book-author').value;
    const bookNbPages = addBookForm.querySelector('#form-book-nb-page').value;
    const bookCoverLink = addBookForm.querySelector('#form-book-cover-link').value;
    let bookRead = addBookForm.querySelector('#form-book-read');
    bookRead.checked ? bookRead = true :bookRead = false;

    addBookToLibrary(bookTitle, bookAuthor, bookNbPages, bookRead, bookCoverLink);
    displayBooks(myLibrary);
    // reset the inputs
    addBookForm.querySelectorAll('.add-input').forEach(input => input.value = "");
    addBookForm.querySelector('[type="checkbox"]').checked = false;
    addBookForm.classList.remove('display');
    newBookButton.classList.remove('collapse');
}


newBookButton.addEventListener('click', () => {
    newBookButton.classList.add('collapse');
    addBookForm.classList.add('display')
});
addBookForm.addEventListener('submit', manageNewBookSubmit);
booksList.addEventListener('click', (e) => {
    const bookIndex = e.target.parentNode.parentNode.dataset.bookIndex;
    switch(e.target.dataset.action) {
        case "remove": 
            removeBook(bookIndex);
            break;
        case "change-status":
            toggleReadStatus(bookIndex);
        }
    });

displayBooks(myLibrary)
