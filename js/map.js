let map = L.map("map").setView([43.4025, 10.8615], 14);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let marker = L.marker([43.4025, 10.8615]).addTo(map);

const $searchInput = document.querySelector(".search-input");
const $ipAddress = document.getElementById("ipAddress");
const $location = document.getElementById("location");
const $timeZone = document.getElementById("timeZone");
const $isp = document.getElementById("isp");

$searchInput.addEventListener("input", function () {
  // Obtener el valor actual del input
  let value = $searchInput.value;

  // Aplicar la expresión regular para validar y ajustar el valor
  let newValue = value.replace(/[^\d.]/g, ""); // Mantener solo dígitos y puntos
  newValue = newValue.replace(/\.{2,}/g, "."); // Reemplazar más de un punto con solo uno

  // Actualizar el valor del input
  $searchInput.value = newValue;
});

const ipEncontrado = async function (url) {
  try {
    let res = await fetch(url);
    let json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    if (json.status === "fail") {
      const $message = document.getElementById("message");
      $message.textContent = "INVALID IP";
      setTimeout(() => {
        $message.textContent = "";
      }, 3000);
    } else {
      $ipAddress.textContent = json.query;
      $location.textContent = `${json.city}, ${json.country}`;
      $timeZone.textContent = `${json.timezone}`;
      $isp.textContent = `${json.isp}`;

      const newLatLng = new L.LatLng(json.lat, json.lon);
      map.setView(newLatLng, 13); // Actualizar la vista del mapa
      marker.setLatLng(newLatLng); // Mover el marcador a las nuevas coordenadas
    }
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".search-button")) {
    if ($searchInput.value === "") {
      const $message = document.getElementById("message");
      $message.textContent = "Ingrese una IP";
      setTimeout(() => {
        $message.textContent = "";
      }, 3000);
    } else {
      let $query = $searchInput.value;
      let ipAPI = `http://ip-api.com/json/${$query}`;
      ipEncontrado(ipAPI);
    }
  }
});
