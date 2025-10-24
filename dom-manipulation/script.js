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

function updateCategoryOptions() {
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
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    updateCategoryOptions();
    filterQuotes();
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
        updateCategoryOptions();
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

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteForm.addEventListener("submit", createAddQuoteForm);
exportBtn.addEventListener("click", exportQuotes);
importFileInput.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", filterQuotes);

loadQuotes();
