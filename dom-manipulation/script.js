async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Convert server posts to quote format
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localQuotes = JSON.parse(localStorage.getItem("quoteGeneratorQuotes")) || [];
    const localTextSet = new Set(localQuotes.map(q => q.text));
    let updated = false;

    serverQuotes.forEach(sq => {
      if (!localTextSet.has(sq.text)) {
        localQuotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("quoteGeneratorQuotes", JSON.stringify(localQuotes));
      quotes = localQuotes;
      if (typeof populateCategories === "function") populateCategories();
      if (typeof filterQuotes === "function") filterQuotes();

      const notification = document.getElementById("conflictNotification");
      if (notification) {
        notification.style.display = "block";
        setTimeout(() => {
          notification.style.display = "none";
        }, 5000);
      }
    }
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// ⏱ Periodic sync every 30 seconds
setInterval(() => {
  fetchQuotesFromServer();
}, 30000);