function fetchFromServer() {
  const serverQuotes = [
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
    { text: "Be yourself; everyone else is already taken.", category: "Wisdom" }
  ];

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
    populateCategories();
    filterQuotes();
    conflictNotification.style.display = "block";
    setTimeout(() => {
      conflictNotification.style.display = "none";
    }, 5000);
  }
}

setInterval(fetchFromServer, 30000); // Sync every 30 seconds