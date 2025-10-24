// DOM Elements
const quoteForm = document.getElementById("quote-form");
const quoteInput = document.getElementById("quote-input");
const quoteList = document.getElementById("quote-list");
const syncButton = document.getElementById("sync-button");
const notificationBox = document.getElementById("notification-box");

// Load quotes from local storage on page load
document.addEventListener("DOMContentLoaded", loadQuotes);

// Add Quote
quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newQuote = quoteInput.value.trim();

    if (newQuote !== "") {
        addQuoteToDOM(newQuote);
        saveQuoteToLocalStorage(newQuote);
        quoteInput.value = "";
        showNotification("Quote added locally!");
    } else {
        showNotification("Please enter a quote!");
    }
});

// Sync quotes button (example function)
syncButton.addEventListener("click", function () {
    syncQuotesWithServer();
});

// Add quote to DOM
function addQuoteToDOM(quote) {
    const li = document.createElement("li");
    li.textContent = quote;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
        deleteQuote(quote, li);
    });

    li.appendChild(deleteBtn);
    quoteList.appendChild(li);
}

// Save quote to local storage
function saveQuoteToLocalStorage(quote) {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes.push(quote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes.forEach(addQuoteToDOM);
}

// Delete quote
function deleteQuote(quote, element) {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes = quotes.filter(q => q !== quote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    element.remove();
    showNotification("Quote deleted!");
}

// Sync with server (placeholder for actual logic)
function syncQuotesWithServer() {
    // Simulate a successful sync after a delay
    setTimeout(() => {
        showNotification("Quotes synced with server!");
    }, 1000);
}

// Notification function
function showNotification(message) {
    notificationBox.textContent = message;
    notificationBox.classList.add("show");

    setTimeout(() => {
        notificationBox.classList.remove("show");
    }, 3000);
}
