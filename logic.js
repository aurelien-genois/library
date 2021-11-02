// Book constructor
class Book {
  constructor(title, author, nbPages, coverLink) {
    this.title = title;
    this.author = author;
    this.nbPages = nbPages;
    this.coverLink = coverLink;
    this.read = false;
    this.like = undefined;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.nbPages} pages, ${
      this.read ? 'read' : 'not read yet'
    }`;
  }
  toggleRead() {
    this.read = !this.read;
  }
  edit(title, author, nbPages, coverLink, read, like) {
    this.title = title;
    this.author = author;
    this.nbPages = nbPages;
    this.coverLink = coverLink;
    this.read = read;
    this.like = like;
  }
}

function createBookItem(
  title,
  author,
  nbPages,
  coverLink,
  read,
  like,
  bookIndex,
) {
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

  // create btns
  const readButton = document.createElement('button');
  readButton.classList.add('btn-change-status', 'fas');
  readButton.setAttribute('data-action', 'change-read-status');
  readButton.textContent = read
    ? readButton.classList.add('fa-eye')
    : readButton.classList.add('fa-eye-slash');

  const likeLabel = document.createElement('div');

  const likeRadio = document.createElement('input');
  likeRadio.type = 'radio';
  likeRadio.name = `like${bookIndex}`;
  likeRadio.value = 'like';
  likeRadio.classList.add('like-radio', 'fa', 'fa-thumbs-up');
  likeRadio.setAttribute('data-action', 'like');
  const unlikeRadio = document.createElement('input');
  unlikeRadio.type = 'radio';
  unlikeRadio.name = `like${bookIndex}`;
  unlikeRadio.value = 'unlike';
  unlikeRadio.classList.add('unlike-radio', 'fa', 'fa-thumbs-down');
  unlikeRadio.setAttribute('data-action', 'like');
  if (like === true) {
    likeRadio.checked = true;
  } else if (like === false) {
    unlikeRadio.checked = true;
  }

  likeLabel.append(likeRadio, unlikeRadio);

  const editButton = document.createElement('button');
  editButton.classList.add('btn-edit', 'fa', 'fa-edit');
  editButton.setAttribute('data-action', 'edit');

  const removeButton = document.createElement('button');
  removeButton.classList.add('btn-remove', 'fa', 'fa-trash');
  removeButton.setAttribute('data-action', 'remove');

  const bookButtons = document.createElement('div');
  bookButtons.classList.add('book-btns');
  bookButtons.append(readButton, likeLabel, editButton, removeButton);

  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book-div');
  bookDiv.setAttribute('data-book-index', bookIndex);
  bookDiv.append(
    bookTitleText,
    bookAuthorText,
    bookNbPagesText,
    bookCover,
    bookButtons,
  );

  const li = document.createElement('li');
  li.append(bookDiv);

  return li;
}

function updateLocalStorage() {
  localStorage.setItem('books', JSON.stringify(myLibrary));
}

// manage library
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
      book.coverLink,
      book.read,
      book.like,
      bookIndex,
    );
    booksList.appendChild(bookItem);
  });
  const addBookZone = document.createElement('li');
  addBookZone.id = 'add-book-zone';
  addBookZone.append(createAddBookBtn());

  booksList.append(addBookZone);
}

function addBookToLibrary(title, author, nbPages, coverLink, read, like) {
  const newBook = new Book(title, author, nbPages, coverLink);
  newBook.read = read;
  newBook.like = like;
  myLibrary.push(newBook);
}

function sortLibrary(e) {
  switch (e.target.value) {
    case 'title-down':
      myLibrary.sort((a, b) => {
        return b.title.localeCompare(a.title);
      });
      break;
    case 'title-up':
      myLibrary.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      break;
    case 'author-down':
      myLibrary.sort((a, b) => {
        return b.author.localeCompare(a.author);
      });
      break;
    case 'author-up':
      myLibrary.sort((a, b) => {
        return a.author.localeCompare(b.author);
      });
      break;
    case 'nb-pages-down':
      myLibrary.sort((a, b) => {
        return b.nbPages - a.nbPages;
      });
      break;
    case 'nb-pages-up':
      myLibrary.sort((a, b) => {
        return a.nbPages - b.nbPages;
      });
      break;
    case 'likes':
      myLibrary.sort((a, b) => {
        // sort like first, undefined medium, unlike last
        if (a.like === true) {
          if (b.like === true) {
            return 0;
          }
          if (b.like === false) {
            return -1;
          }
          if (b.like === undefined) {
            return -1;
          }
        }
        if (a.like === false) {
          if (b.like === true) {
            return 1;
          }
          if (b.like === false) {
            return 0;
          }
          if (b.like === undefined) {
            return 1;
          }
        }
        if (a.like === undefined) {
          if (b.like === true) {
            return 1;
          }
          if (b.like === false) {
            return -1;
          }
          if (b.like === undefined) {
            return 0;
          }
        }
      });
      break;
    case 'dislikes':
      myLibrary.sort((a, b) => {
        // sort dislike first, undefined medium, like last
        if (a.like === true) {
          if (b.like === true) {
            return 0;
          }
          if (b.like === false) {
            return 1;
          }
          if (b.like === undefined) {
            return 1;
          }
        }
        if (a.like === false) {
          if (b.like === true) {
            return -1;
          }
          if (b.like === false) {
            return 0;
          }
          if (b.like === undefined) {
            return -1;
          }
        }
        if (a.like === undefined) {
          if (b.like === true) {
            return -1;
          }
          if (b.like === false) {
            return 1;
          }
          if (b.like === undefined) {
            return 0;
          }
        }
      });
      break;
    case 'read':
      myLibrary.sort((a, b) => {
        if (a.read & !b.read) {
          return -1;
        }
        if (!a.read & b.read) {
          return 1;
        }
        return 0;
      });
      break;
    case 'unread':
      myLibrary.sort((a, b) => {
        if (a.read & !b.read) {
          return 1;
        }
        if (!a.read & b.read) {
          return -1;
        }
        return 0;
      });
      break;
  }
  document.querySelector('#sort-text').textContent = `Sorted by ${
    e.target.querySelector(`option[value=${e.target.value}]`).textContent
  }`;
  e.target.querySelector('option').selected = true;
  displayBooks(myLibrary);
  updateLocalStorage();
}

// manage books
function removeBook(index) {
  myLibrary.splice(index, 1);
  displayBooks(myLibrary);
  updateLocalStorage();
}

function toggleReadStatus(index) {
  myLibrary[index].toggleRead();
  displayBooks(myLibrary);
  updateLocalStorage();
}

function editBook(index, formDatas) {
  myLibrary[index].edit(...formDatas);
  displayBooks(myLibrary);
  updateLocalStorage();
}

function displayEditBookForm(index, thisBookDiv) {
  const currBook = myLibrary[index];
  const editForm = createBookForm(
    currBook.title,
    currBook.author,
    currBook.nbPages,
    currBook.coverLink,
    currBook.read,
    currBook.like,
  );
  editForm.addEventListener('submit', function () {
    const formDatas = getBookFormDatas(this);
    editBook(index, formDatas);
  });
  thisBookDiv.replaceWith(editForm);
}

function changeLikeStatus(index, radioBtn) {
  if (radioBtn.value === 'like') {
    if (myLibrary[index].like) {
      // if already true
      radioBtn.checked = false;
      myLibrary[index].like = undefined;
    } else {
      myLibrary[index].like = true;
    }
  } else if (radioBtn.value === 'unlike') {
    if (myLibrary[index].like === false) {
      // if already false
      radioBtn.checked = false;
      myLibrary[index].like = undefined;
    } else {
      myLibrary[index].like = false;
    }
  }
  updateLocalStorage();
}

// AddBook form
function createBookForm(
  bookTitle,
  bookAuthor,
  bookNbPages,
  bookCoverLink,
  bookRead,
  bookLike,
) {
  const form = document.createElement('form');
  form.id = 'add-book-form';

  const formTitle = document.createElement('h3');
  formTitle.id = 'add-book-form-title';
  formTitle.textContent = "Complete the book's infos";

  const titleInput = document.createElement('input');
  titleInput.placeholder = 'Title:';
  titleInput.value = bookTitle ?? '';
  titleInput.type = 'text';
  titleInput.id = 'title-input';
  titleInput.classList.add('form-input');
  titleInput.name = 'title';
  titleInput.setAttribute('maxlength', '30');
  titleInput.required = true;

  const authorInput = document.createElement('input');
  authorInput.placeholder = 'Author:';
  authorInput.value = bookAuthor ?? '';
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
  nbPagesInput.value = bookNbPages ?? '';
  nbPagesInput.max = '5000';
  nbPagesInput.min = '0';
  nbPagesInput.id = 'nb-pages-input';
  nbPagesInput.classList.add('form-input');
  nbPagesInput.name = 'nb-pages';
  nbPagesInput.setAttribute('maxlength', '6');
  nbPagesInput.required = true;

  nbPagesDiv.append(nbPagesLabel, nbPagesInput);

  const coverLinkInput = document.createElement('input');
  coverLinkInput.placeholder = 'Cover link (opt):';
  coverLinkInput.value = bookCoverLink ?? '';
  coverLinkInput.type = 'text';
  coverLinkInput.id = 'cover-link-input';
  coverLinkInput.classList.add('form-input');
  coverLinkInput.name = 'cover-link';
  coverLinkInput.setAttribute('maxlength', '2000');

  // read input
  const readDiv = document.createElement('div');
  readDiv.id = 'read-div';
  const readLabel = document.createElement('label');
  readLabel.id = 'read-label';
  readLabel.setAttribute('for', 'read-input');
  readLabel.textContent = 'Read? (opt):';
  const readInput = document.createElement('input');
  readInput.type = 'checkbox';
  readInput.checked = bookRead ?? false;
  readInput.id = 'read-input';
  readInput.classList.add('form-input');
  readInput.name = 'read';
  readDiv.append(readLabel, readInput);

  // like input
  const likeDiv = document.createElement('div');
  likeDiv.id = 'like-div';
  const likeLabel = document.createElement('label');
  likeLabel.id = 'read-label';
  likeLabel.setAttribute('for', 'like-input');
  likeLabel.textContent = 'Like it? (opt):';
  const likeInput = document.createElement('input');
  likeInput.type = 'radio';
  likeInput.checked = (bookLike === true);
  likeInput.id = 'like-input';
  likeInput.classList.add('form-input');
  likeInput.name = 'like';
  likeInput.value = 'like';
  const unlikeInput = document.createElement('input');
  unlikeInput.type = 'radio';
  unlikeInput.checked = (bookLike === false);
  unlikeInput.id = 'unlike-input';
  unlikeInput.classList.add('form-input');
  unlikeInput.name = 'like';
  unlikeInput.value = 'unlike';

  likeDiv.append(likeLabel, likeInput, 'Yes', unlikeInput, 'No');

  const btnsDiv = document.createElement('div');
  btnsDiv.id = 'form-btns';
  const submitInput = document.createElement('input');
  submitInput.type = 'submit';
  // if no title argument => Add new book, else => edit curr book
  submitInput.value = !bookTitle ? 'Add the book' : 'Edit the book';
  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancel-form-btn';
  cancelBtn.textContent = 'cancel';
  cancelBtn.addEventListener('click', () => {
    displayBooks(myLibrary);
  });
  btnsDiv.append(submitInput, cancelBtn);

  form.append(
    formTitle,
    titleInput,
    authorInput,
    nbPagesDiv,
    coverLinkInput,
    readDiv,
    likeDiv,
    btnsDiv,
  );
  return form;
}
function createAddBookForm() {
  const addBookForm = createBookForm();
  addBookForm.addEventListener('submit', manageNewBookSubmit);
  return addBookForm;
}

function getBookFormDatas(form) {
  const data = new FormData(form);
  let bookTitle, bookAuthor, bookNbPages, bookCoverLink;
  let bookLike = undefined;
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
      case 'like':
        if (entry[1] === 'like') {
          bookLike = true;
        } else if (entry[1] === 'unlike') {
          bookLike = false;
        }
        break;
    }
  }
  return [
    bookTitle,
    bookAuthor,
    bookNbPages,
    bookCoverLink,
    bookRead,
    bookLike,
  ];
}
function manageNewBookSubmit(e) {
  e.preventDefault();
  addBookToLibrary(...getBookFormDatas(this));
  displayBooks(myLibrary);
  updateLocalStorage();
}

// ? move this event on the btns in createBookItem() ?
const booksList = document.querySelector('#books-list');
booksList.addEventListener('click', (e) => {
  if (!e.target.closest('.book-div')) {
    console.log('not a target in a book item');
    return;
  }
  const bookIndex = e.target.closest('.book-div').dataset.bookIndex;

  let confirmRemove;
  switch (e.target.dataset.action) {
    case 'remove':
      confirmRemove = confirm(
        `Are you sure you want to remove ${myLibrary[bookIndex].title}`,
      );
      break;
    case 'change-read-status':
      toggleReadStatus(bookIndex);
      break;
    case 'edit':
      displayEditBookForm(bookIndex, e.target.parentNode.parentNode);
      break;
    case 'like':
      changeLikeStatus(bookIndex, e.target);
      break;
  }
  if (confirmRemove) {
    removeBook(bookIndex);
  }
});

const sortSelect = document.querySelector('#sort-select');
sortSelect.addEventListener('input', sortLibrary);
sortSelect.querySelector('option').selected = true;

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
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    nbPages: '208',
    read: false,
    coverLink:
      'https://prodimage.images-bn.com/pimages/9780743273565_p0_v8_s550x406.jpg',
  },
];
let myLibrary = JSON.parse(localStorage.getItem('books')) || defaultData;
// when the book is in the local storage, it looses is prototype, so its methods too
// set the Book prototype to local storage objects
myLibrary.map((book) => {
  Object.setPrototypeOf(book, Book.prototype);
});

displayBooks(myLibrary);
