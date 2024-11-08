const myLibrary = [];
const libraryDiv = document.querySelector('.library');
const dialog = document.querySelector('#myModal');
const showButton = document.querySelector('#newBookBtn');
const closeButton = document.querySelector('.close');
const addBookBtn = document.querySelector('#bRegister');
const cancelBookBtn = document.querySelector('#bCancel');
const bTitle = document.querySelector('#bTitle');
const bAuthor = document.querySelector('#bAuthor');
const bPages = document.querySelector('#bPages');
const bRead = document.querySelector('#bRead');
const formBook = document.querySelector('#newBookForm');
const inputs = [
    document.querySelector('#bTitle'),
    document.querySelector('#bAuthor'),
    document.querySelector('#bPages'),
];

class Book {
    constructor(title, author, pages, read) {
        this._title = title;
        this._author = author;
        this._pages = pages;
        this._read = read;
    }

    get title() {
        return this._title;
    }
    get author() {
        return this._author;
    }
    get pages() {
        return this._pages;
    }
    get read() {
        return this._read;
    }
}

function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
}

const book1 = new Book('Flowers for Algernon', 'Daniel Keyes', 288, false);
const book2 = new Book('The Hobbit', 'J.R.R. Tolkien', 295, true);
const book3 = new Book(
    'Harry Potter and the Philosophers Stone',
    'J.K. Rowling',
    342,
    true
);
const book4 = new Book('To Kill a Mockingbird', 'Harper Lee', 281, true);

addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);
addBookToLibrary(book4);

function showLibrary() {
    for (let i = 0; i < myLibrary.length; i++) {
        console.log(myLibrary[i]);
    }
}

class BookCard {
    constructor(book) {
        this._book = book;
    }

    buildCard() {
        const bookCard = document.createElement('div');
        bookCard.classList.add('library-item');

        const remBtn = document.createElement('span');
        remBtn.innerHTML = `<img src="./img/trash-can-outline.svg" alt="Remove book" class="trash">`;
        remBtn.classList.add('remove-btn');

        const bookTitle = document.createElement('p');
        bookTitle.classList.add('originalTitle');
        bookTitle.innerText = this._book.title;
        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = `Author: ${this._book.author}`;
        const bookPages = document.createElement('p');
        bookPages.innerText = `${this._book.pages} pages`;
        const bookRead = document.createElement('p');
        bookRead.classList.add('originalRead');
        bookRead.innerText = this._book.read ? 'Is read.' : 'Not read yet.';
        const bookReadChange = document.createElement('span');
        const bookReadImg = document.createElement('img');
        bookReadImg.src = './img/check.svg';
        bookReadImg.classList.add('read-check');
        bookReadImg.classList.add(
            this._book.read ? 'check-green' : 'check-grey'
        );

        bookCard.appendChild(remBtn);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookPages);
        bookCard.appendChild(bookRead);
        bookRead.appendChild(bookReadChange);
        bookReadChange.appendChild(bookReadImg);

        return bookCard;
    }
}

function addBookCards() {
    libraryDiv.innerHTML = '';
    for (let i = 0; i < myLibrary.length; i++) {
        let addEachBook = new BookCard(myLibrary[i]);
        libraryDiv.appendChild(addEachBook.buildCard());
    }
}

addBookCards();

// Show dialog modal
showButton.addEventListener('click', () => {
    dialog.style.display = 'flex';
    dialog.showModal();
});
// Close the dialog modal
closeButton.addEventListener('click', () => {
    dialog.close();
    dialog.style.display = 'none';
});
// Close the dialog modal
cancelBookBtn.addEventListener('click', () => {
    dialog.close();
    dialog.style.display = 'none';
});
// Close the dialog modal if clicked outside of it
dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    ) {
        dialog.close();
        dialog.style.display = 'none';
    }
});

function cleanForm() {
    bTitle.value = '';
    bAuthor.value = '';
    bPages.value = '';
    bRead.checked = false;
}

addBookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let formValidation = true;

    inputs.forEach((input) => {
        // Removes style at each try on submit
        input.style.border = '';
        input.ariaPlaceholder = '';

        if (input.value.trim() === '') {
            input.style.border = '2px solid red';
            input.placeholder = 'Required';
            formValidation = false;
        } else {
            input.placeholder = '';
        }
    });

    if (formValidation === true) {
        const newTitle = bTitle.value;
        const newAuthor = bAuthor.value;
        const newPages = bPages.value;
        const newRead = bRead.checked;

        const newBookRegister = new Book(
            newTitle,
            newAuthor,
            newPages,
            newRead
        );
        addBookToLibrary(newBookRegister);
        addBookCards();

        cleanForm();
        dialog.close();
        dialog.style.display = 'none';
    }
});

libraryDiv.addEventListener('click', (e) => {
    // botao TRASH
    if (e.target.classList.contains('trash')) {
        const card = e.target.closest('.library-item');
        const titleToRemove = card.querySelector('.originalTitle').innerText;

        const foundBook = myLibrary.findIndex(
            (book) => book.title === titleToRemove
        );

        if (foundBook !== -1) {
            myLibrary.splice(foundBook, 1);
        }
        card.remove();
    }
    // botao READ
    if (e.target.classList.contains('read-check')) {
        // O elemento clicado é a imagem com a classe .read-check
        const clickedCheck = e.target;
        const card = clickedCheck.closest('.library-item');
        const readTextToToggle = card.querySelector('.originalRead'); // linha 177

        // Alternar classes de cor
        clickedCheck.classList.toggle('check-green');
        clickedCheck.classList.toggle('check-grey');

        // Alterar texto de status de leitura
        if (readTextToToggle.innerText === 'Is read.') {
            readTextToToggle.childNodes[0].textContent = 'Not read yet.';
        } else {
            readTextToToggle.childNodes[0].textContent = 'Is read.';
        }

        // Encontrar o título do livro no mesmo card
        const bookTitle = card.querySelector('.originalTitle').innerText;

        // Procurar o livro correspondente na array myLibrary
        const foundBook = myLibrary.find((book) => book.title === bookTitle);

        // Se o livro for encontrado, alternar o status 'read'
        if (foundBook) {
            foundBook.read = !foundBook.read;
        }
    }
});
