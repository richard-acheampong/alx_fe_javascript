const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Do not be anxious about anything.", category: "Faith" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteForm = document.getElementById("addQuoteForm");
const quoteTextInput = document.getElementById("quoteText");
const quoteCategoryInput = document.getElementById("quoteCategory");

// Populate category dropdown
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show a random quote from selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}"`;
}

// Add new quote
function createAddQuoteForm(event) {
  event.preventDefault();
  const newText = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    updateCategoryOptions();
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
    alert("Quote added successfully!");
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteForm.addEventListener("submit", createAddQuoteForm);

// Initialize
updateCategoryOptions();