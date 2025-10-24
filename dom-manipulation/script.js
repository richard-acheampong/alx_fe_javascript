const LOCAL_STORAGE_KEY = "quoteGeneratorQuotes";
const FILTER_STORAGE_KEY = "quoteGeneratorFilter";
const SESSION_STORAGE_KEY = "lastViewedQuote";

let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");
const filteredQuotesDiv = document.getElementById("filteredQuotes");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteForm = document.getElementById("addQuoteForm");
const quoteTextInput = document.getElementById("quoteText");
const quoteCategoryInput = document.getElementById("quoteCategory");
const exportBtn = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");
const conflictNotification = document.getElementById("conflictNotification");

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option1 = document.createElement("option");
    option1.value = cat;
    option1.textContent = cat;
    categorySelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = cat;
    option2.textContent = cat;
    categoryFilter.appendChild(option2);
  });
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Do not be anxious about anything.", category: "Faith" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, quote);
}

function loadLastViewedQuote() {
  return sessionStorage.getItem(SESSION_STORAGE_KEY);
}

function saveFilterCategory(category) {
  localStorage.setItem(FILTER_STORAGE_KEY, category);
}

function loadFilterCategory() {
  return localStorage.getItem(FILTER_STORAGE_KEY) || "all";
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}"`;
  saveLastViewedQuote(randomQuote.text);
}

function createAddQuoteForm(event) {
  event.preventDefault();
  const newText = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    postQuoteToServer(newQuote); // ✅ Send to server
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
    alert("Quote added successfully!");
  }
}

function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function filterQuotes() {
  const selectedFilter = categoryFilter.value;
  saveFilterCategory(selectedFilter);
  let filtered = quotes;
  if (selectedFilter !== "all") {
    filtered = quotes.filter(q => q.category === selectedFilter);
  }
  filteredQuotesDiv.innerHTML = "";
  if (filtered.length === 0) {
    filteredQuotesDiv.textContent = "No quotes available for this category.";
    return;
  }
  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" (${q.category})`;
    filteredQuotesDiv.appendChild(p);
  });
}

// ✅ Fetch quotes from server using GET
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localTextSet = new Set(quotes.map(q => q.text));
    let updated = false;

    serverQuotes.forEach(sq => {
      if (!localTextSet.has(sq.text)) {
        quotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
     