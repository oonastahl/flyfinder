//data, josta luodaan kortit
const destinations = [
  {
    code: "FR",
    nameFi: "Ranska",
    description: "Romantiikkaa, kulttuuria ja kahviloita.",
    price: 89,
    image: "images/paris.jpeg"
  },
  {
    code: "ES",
    nameFi: "Espanja",
    description: "Aurinkoa, rantaa ja upeaa arkkitehtuuria.",
    price: 119,
    image: "images/barcelona.jpeg"
  },
  {
    code: "IT",
    nameFi: "Italia",
    description: "Historiaa, italialaista ruokaa ja tunnelmaa.",
    price: 99,
    image: "images/rome.jpeg"
  }
];

//arvontamaat
const randomCountryCodes = [
  "PT", "JP", "GR", "IS", "TH",
  "CA", "BR", "ZA", "NZ", "MA",
  "HR", "MX", "NO", "KR", "ID"
];


const destinationList = document.getElementById("destination-list");

Promise.all(
  destinations.map(destination =>
    fetch(`https://countries.dev/alpha/${destination.code}`) //hakee maat
      .then(response => {
        if (!response.ok) {
          throw new Error("Maatietojen hakeminen epäonnistui");
        }
        return response.json();
      })
      .then(country => ({
        ...destination,
        capital: country.capital
        }))
  )
)
//muodostaa kortit
  .then(countries => {
    destinationList.innerHTML = countries.map(country => `
      <div class="col-md-4">
        <div class="card h-100">
        <img
            src="${country.image}"
            class="card-img-top destination-image"
            alt="Matkakohde: ${country.nameFi}"
        >
          <div class="card-body">
            <h3 class="card-title">${country.nameFi}</h3>
            <p class="text-muted">Pääkaupunki: ${country.capital}</p>
            <p class="card-text">${country.description}</p>
            <p><strong>Esimerkkihinta ${country.price} €</strong></p>
            <a href="#lentohaku" class="btn btn-primary">
              Tutustu kohteeseen
            </a>
          </div>
        </div>
      </div>
    `).join("");
  })
  .catch(error => {
    destinationList.textContent =
      "Matkakohteiden lataaminen epäonnistui. Yritä myöhemmin uudelleen.";
    console.error(error);
  });

//arvonnan toiminta
const randomButton = document.getElementById("arvo-kohde");
const randomResult = document.getElementById("arvottu-kohde");

randomButton.addEventListener("click", function () {
  const randomIndex = Math.floor(
    Math.random() * randomCountryCodes.length
  );

  const countryCode = randomCountryCodes[randomIndex];

  randomResult.textContent = "Arvotaan matkakohdetta...";

  fetch(`https://countries.dev/alpha/${countryCode}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Maan tietojen hakeminen epäonnistui");
      }
      return response.json();
    })
    .then(country => {
      randomResult.innerHTML = `
        <h3>${country.name}</h3>
        <img
          src="${country.flags.png}"
          alt="${country.name}n lippu"
          class="country-flag"
        >
        <p>Pääkaupunki: ${
          Array.isArray(country.capital)
            ? country.capital.join(", ")
            : country.capital || "Ei saatavilla"
        }</p>
        <p>Mitä jos seuraava seikkailusi olisi täällä?</p>
      `;
    })
    .catch(error => {
      randomResult.textContent =
        "Kohteen arvonta epäonnistui. Kokeile uudelleen.";
      console.error(error);
    });
});


//Lentohaku lomakkeen toiminta
const flightForm = document.getElementById("flight-form");
const flightResults = document.getElementById("flight-results");

flightForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const departure = document.getElementById("departure").value.trim();
  const destination = document.getElementById("destination").value;
  const travelDate = document.getElementById("travel-date").value;

  flightResults.innerHTML = `
    <div class="alert alert-info mt-3">
      <h3 class="h5">Hakusi tiedot</h3>
      <p>Lähtöpaikka: ${departure}</p>
      <p>Kohde: ${destination}</p>
      <p>Lähtöpäivä: ${travelDate}</p>
      <p class="mb-0">
        Tämä on hakuesimerkki. Oikeita lentotarjouksia ei vielä haeta.
      </p>
    </div>
  `;
});