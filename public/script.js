function fetchBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(books => {
            const booksContainer = document.getElementById('booksContainer');
            booksContainer.innerHTML = '';

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');

                // Calculate the expected return time (1 hour after borrowing)
                const borrowTime = new Date(book.timestamp);
                const expectedReturnTime = new Date(borrowTime.getTime() + 60 * 60 * 1000); // 1 hour later

                const returnTimeHTML = book.return_timestamp 
                    ? `<p>Book Returned on: ${new Date(book.return_timestamp).toLocaleString()}</p>` 
                    : `<p>Expected Return Time: ${expectedReturnTime.toLocaleString()}</p>`;

                bookCard.innerHTML = `
                    <h3>Book Name: ${book.name}</h3>
                    <p>Book Taken on: ${borrowTime.toLocaleString()}</p>
                    ${returnTimeHTML}
                    ${!book.return_timestamp ? `<button onclick="returnBook(${book.id})">Return Book</button>` : ''}
                `;
                booksContainer.appendChild(bookCard);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}


function fetchReturnedBooks() {
    fetch('/books/returned')
        .then(response => response.json())
        .then(books => {
            const returnedBooksContainer = document.getElementById('returnedBooksContainer');
            returnedBooksContainer.innerHTML = '';

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                bookCard.innerHTML = `
                    <h3>Book Name: ${book.name}</h3>
                    <p>Book Taken on: ${new Date(book.timestamp).toLocaleString()}</p>
                    <p>Book Returned on: ${new Date(book.return_timestamp).toLocaleString()}</p>
                    <p>Fine: Rs. ${book.fine}</p>
                `;
                returnedBooksContainer.appendChild(bookCard);
            });
        })
        .catch(error => console.error('Error fetching returned books:', error));
}


function returnBook(bookId) {
    fetch(`/books/${bookId}/return`, {
        method: 'PUT',
    })
    .then(response => response.json())
    .then(data => {
       
        fetchBooks();
        fetchReturnedBooks();
    })
    .catch(error => {
        console.error('Error returning the book:', error);
    });
}


document.getElementById('addBookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('input[name="name"]').value;

    fetch('/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })  // Send JSON data
    }).then(() => {
        e.target.reset();  
        fetchBooks();  
    });
});


fetchBooks();
fetchReturnedBooks();