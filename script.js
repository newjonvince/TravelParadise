function handleSearch(event) {
  event.preventDefault();
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const type = getSearchType(keyword);

  fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
      let results = [];
      if (type === "beach") {
        results = data.beaches;
      } else if (type === "temple") {
        results = data.temples;
      } else if (type === "country") {
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            results.push({
              name: city.name,
              imageUrl: city.imageUrl,
              description: city.description
            });
          });
        });
      }
      displayResults(results, type);
    })
    .catch(error => {
      console.error("Error fetching recommendations:", error);
      document.getElementById("results").innerHTML = "<p>Failed to load recommendations.</p>";
    });
}

function getSearchType(keyword) {
  if (keyword.includes("beach")) return "beach";
  if (keyword.includes("temple")) return "temple";
  if (keyword.includes("country")) return "country";
  return "";
}

function displayResults(results, type) {
  const container = document.getElementById("results");
  container.innerHTML = "";
  if (results.length === 0) {
    container.innerHTML = "<p>No recommendations found.</p>";
    return;
  }
  const heading = document.createElement("h2");
  heading.textContent = `Recommended ${capitalize(type)} Destinations`;
  container.appendChild(heading);
  results.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("result-card");
    card.innerHTML = `
      <h3>${item.name}</h3>
      <img src="${item.imageUrl}" alt="${item.name}">
      <p>${item.description}</p>
    `;
    container.appendChild(card);
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function resetSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("results").innerHTML = "";
}