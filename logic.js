// Book constructor
class Book {
  constructor(title, author, nbPages, coverLink) {
    this.title = title;
    this.author = author;
    this.nbPages = nbPages;
    this.read = false;
    this.coverLink = coverLink;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.nbPages} pages, ${
      this.read ? 'read' : 'not read yet'
    }`;
  }
  toggleRead() {
    this.read = !this.read;
  }
}

function createBookItem(title, author, nbPages, read, bookIndex, coverLink) {
  const bookTitleText = document.createElement('p');
  bookTitleText.classList.add('book-title');
  bookTitleText.textContent = title;

  const bookCover = document.createElement('img');
  bookCover.classList.add('book-cover');
  // need to manage when the link is not a link or is dead
  bookCover.src =
    coverLink ||
    'https://ravenspacepublishing.org/wp-content/uploads/2019/04/default-book.jpg';

  const bookAuthorText = document.createElement('p');
  bookAuthorText.classList.add('book-author');
  bookAuthorText.textContent = author;

  const bookNbPagesText = document.createElement('p');
  bookNbPagesText.classList.add('book-nb-pages');
  bookNbPagesText.textContent = `${nbPages} pages`;

  const button = document.createElement('button');
  button.classList.add('btn-change-status');
  button.setAttribute('data-action', 'change-status');
  button.textContent = read ? 'R' : 'r';

  const removeButton = document.createElement('button');
  removeButton.classList.add('btn-remove');
  removeButton.setAttribute('data-action', 'remove');
  removeButton.textContent = 'X';

  const bookButtons = document.createElement('div');
  bookButtons.classList.add('book-btns');
  bookButtons.appendChild(button);
  bookButtons.appendChild(removeButton);

  const li = document.createElement('li');
  li.setAttribute('data-book-index', bookIndex);
  li.append(
    bookTitleText,
    bookAuthorText,
    bookNbPagesText,
    bookCover,
    bookButtons,
  );

  return li;
}

// manage books
function createAddBookBtn() {
  const addBookBtn = document.createElement('button');
  addBookBtn.id = 'new-book-btn';
  addBookBtn.textContent = '+';
  addBookBtn.addEventListener('click', function () {
    this.replaceWith(createAddBookForm());
  });

  return addBookBtn;
}
function displayBooks(library) {
  while (booksList.firstChild) {
    booksList.removeChild(booksList.firstChild);
  }
  library.forEach((book, bookIndex) => {
    const bookItem = createBookItem(
      book.title,
      book.author,
      book.nbPages,
      book.read,
      bookIndex,
      book.coverLink,
    );
    booksList.appendChild(bookItem);
  });
  const addBookZone = document.createElement('li');
  addBookZone.id = 'add-book-zone';
  addBookZone.append(createAddBookBtn());

  booksList.append(addBookZone);
}

function addBookToLibrary(title, author, nbPages, read, coverLink) {
  const newBook = new Book(title, author, nbPages, coverLink);
  newBook.read = read;
  console.log(newBook.read);
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

// AddBook form
function createAddBookForm() {
  const form = document.createElement('form');
  form.id = 'add-book-form';

  const formTitle = document.createElement('h3');
  formTitle.id = 'add-book-form-title';
  formTitle.textContent = "Complete the book's infos";

  const titleInput = document.createElement('input');
  titleInput.placeholder = 'Title:';
  titleInput.type = 'text';
  titleInput.id = 'title-input';
  titleInput.classList.add('form-input');
  titleInput.name = 'title';
  titleInput.setAttribute('maxlength', '30');
  titleInput.required = true;

  const authorInput = document.createElement('input');
  authorInput.placeholder = 'Author:';
  authorInput.type = 'text';
  authorInput.id = 'author-input';
  authorInput.classList.add('form-input');
  authorInput.name = 'author';
  authorInput.setAttribute('maxlength', '30');
  authorInput.required = true;

  const nbPagesDiv = document.createElement('div');
  nbPagesDiv.id = 'nb-pages-div';

  const nbPagesLabel = document.createElement('label');
  nbPagesLabel.id = 'nb-pages-label';
  nbPagesLabel.setAttribute('for', 'nb-pages-input');
  nbPagesLabel.textContent = 'Nb of pages:';

  const nbPagesInput = document.createElement('input');
  nbPagesInput.type = 'number';
  nbPagesInput.max = '5000';
  nbPagesInput.min = '0';
  nbPagesInput.id = 'nb-pages-input';
  nbPagesInput.classList.add('form-input');
  nbPagesInput.name = 'nb-pages';
  nbPagesInput.required = true;

  nbPagesDiv.append(nbPagesLabel, nbPagesInput);

  const coverLinkInput = document.createElement('input');
  coverLinkInput.placeholder = 'Cover link (opt):';
  coverLinkInput.type = 'text';
  coverLinkInput.id = 'cover-link-input';
  coverLinkInput.classList.add('form-input');
  coverLinkInput.name = 'cover-link';

  const readDiv = document.createElement('div');
  readDiv.id = 'read-div';

  const readLabel = document.createElement('label');
  readLabel.id = 'read-label';
  readLabel.setAttribute('for', 'read-input');
  readLabel.textContent = 'Read? (opt):';

  const readInput = document.createElement('input');
  readInput.type = 'checkbox';
  readInput.id = 'read-input';
  readInput.classList.add('form-input');
  readInput.name = 'read';

  readDiv.append(readLabel, readInput);

  const submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'Add the book';

  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancel-form-btn';
  cancelBtn.textContent = 'cancel';
  cancelBtn.addEventListener('click', () => {
    form.replaceWith(createAddBookBtn());
  });

  form.append(
    formTitle,
    titleInput,
    authorInput,
    nbPagesDiv,
    coverLinkInput,
    readDiv,
    submitInput,
    cancelBtn,
  );
  form.addEventListener('submit', manageNewBookSubmit);
  return form;
}

function manageNewBookSubmit(e) {
  e.preventDefault();
  const data = new FormData(this);
  let bookTitle, bookAuthor, bookNbPages, bookCoverLink;
  let bookRead = false;
  for (entry of data) {
    switch (entry[0]) {
      case 'title':
        bookTitle = entry[1];
        break;
      case 'author':
        bookAuthor = entry[1];
        break;
      case 'nb-pages':
        bookNbPages = entry[1];
        break;
      case 'cover-link':
        bookCoverLink = entry[1];
        break;
      case 'read':
        bookRead = true; // if the data exist, it's checked
        break;
    }
  }
  addBookToLibrary(bookTitle, bookAuthor, bookNbPages, bookRead, bookCoverLink);
  displayBooks(myLibrary);
}

const booksList = document.querySelector('#books-list');
booksList.addEventListener('click', (e) => {
  if (!e.target.parentNode) {
    return;
  }
  const bookIndex = e.target.parentNode.parentNode.dataset.bookIndex;
  let confirmRemove;
  switch (e.target.dataset.action) {
    case 'remove':
      confirmRemove = confirm(
        `Are you sure you want to remove ${myLibrary[bookIndex].title}`,
      );
      break;
    case 'change-status':
      toggleReadStatus(bookIndex);
  }
  if (confirmRemove) {
    removeBook(bookIndex);
  }
});

// set the library
const defaultData = [
  {
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    nbPages: '320',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780547928227_p0_v2_s550x406.jpg',
  },
  {
    title: 'Concrete Rose',
    author: 'Angie Thomas',
    nbPages: '320',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780063046788_p0_v2_s550x406.jpg',
  },
  {
    title: "Fofo's Life",
    author: 'Fofo',
    nbPages: '0',
    read: true,
    coverLink: 'https://i.ebayimg.com/images/g/-s4AAOSw90le2SMx/s-l400.jpg',
  },
  {
    title: 'Grown',
    author: 'Tiffany D Jackson',
    nbPages: '384',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780062840356_p0_v2_s550x406.jpg',
  },
  {
    title: 'Brave New Worl',
    author: 'Aldous Huxley',
    nbPages: '288',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780060850524_p0_v3_s550x406.jpg',
  },
  {
    title: 'Jujutsu Kaisen, Vol. 1',
    author: 'Gege Akutami',
    nbPages: '192',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9781974710027_p0_v1_s550x406.jpg',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    nbPages: '384',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780446310789_p0_v6_s550x406.jpg',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    nbPages: '208',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780743273565_p0_v8_s550x406.jpg',
  },
  {
    title: 'Felix Ever After',
    author: 'Kacen Callender',
    nbPages: '368',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780062820259_p0_v2_s550x406.jpg',
  },
];
let myLibrary = JSON.parse(localStorage.getItem('books')) || defaultData;
// when the book is in the local storage, it looses is prototype, so its methods too
// set the Book prototype to local storage objects
myLibrary.map((book) => {
  Object.setPrototypeOf(book, Book.prototype);
});

displayBooks(myLibrary);
