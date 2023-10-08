const toggleButton = document.getElementsByClassName("toggle-button")[0]
const navbarLinks = document.getElementsByClassName("navbar-links")[0]
var marginToggle = false

toggleButton.addEventListener("click", () => {
  var banner = document.getElementById("banner")
  navbarLinks.classList.toggle("active")
  banner.style.marginTop = "215px"
  if (marginToggle) {
    banner.style.marginTop = "0"
    marginToggle = false
  } else {
    banner.style.marginTop = "215px"
    marginToggle = true
  }
})

// registrationFormContainer

const registerBtn = document.getElementById("registerBtn")

registerBtn.addEventListener("click", () => {
  var registrationFormContainer = document.getElementById(
    "registration-form-container"
  )
  registrationFormContainer.style.display = "block"
})

const crossBtn = document.getElementById("cross")
crossBtn.addEventListener("click", () => {
  var registrationFormContainer = document.getElementById(
    "registration-form-container"
  )
  registrationFormContainer.style.display = "none"
})

// FAQ section

const questions = document.querySelectorAll(".question-answer")

document.addEventListener("DOMContentLoaded", function () {
  questions.forEach(function (question) {
    const btn = question.querySelector(".question-btn")
    btn.addEventListener("click", function () {
      console.log("clicked button")
      questions.forEach(function (item) {
        if (item !== question) {
          item.classList.remove("show-text")
        }
      })
      question.classList.toggle("show-text")
    })
  })
})

// Get user Current location
const locationBtn = document.getElementById("getLocationBtn")
let userLocation

// Get current location button click event listener
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude.toFixed(2)
        const longitude = position.coords.longitude.toFixed(2)

        // Use the latitude and longitude values to save the user's location
        userLocation = latitude + longitude
        locationBtn.innerHTML = `     Lat: ${latitude}, Lon: ${longitude}`
      },
      function (error) {
        console.log("Error retrieving location:", error.message)
      }
    )
  } else {
    console.log("Geolocation is not supported by the browser.")
  }
})

// Searching based on user location

const searchBtn = document.getElementById("searchButton")
searchBtn.addEventListener("click", searchServiceProviders)

function searchServiceProviders() {
  const expertise = document.getElementById("expertise").value

  const firebaseConfig = {
    apiKey: "AIzaSyAjCj4qvrd-14h92Q5BOx25844Ojp-oid0",
    authDomain: "fixitfast-24307.firebaseapp.com",
    projectId: "fixitfast-24307",
    storageBucket: "fixitfast-24307.appspot.com",
    messagingSenderId: "142753407696",
    appId: "1:142753407696:web:cb948e9a7ec1953d48b4d5",
    measurementId: "G-P4B55N288F",
  }
  firebase.initializeApp(firebaseConfig)

  // Get a reference to the Firestore database
  const db = firebase.firestore()

  // Get the user's location
  navigator.geolocation.getCurrentPosition((position) => {
    const userLocation = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    }

    // Search for service providers with the given expertise and sort them by distance
    db.collection("users")
      .where("expertise", "==", expertise)
      .where("userType", "==", "provider")
      .get()
      .then((querySnapshot) => {
        // Calculate the distance between each service provider and the user's location
        const serviceProviders = []
        querySnapshot.forEach((doc) => {
          const serviceProvider = doc.data()
          const serviceProviderLocation = serviceProvider.location
          const distance = calculateDistance(
            userLocation,
            serviceProviderLocation
          )
          console.log(`distance: ${distance}`)
          serviceProviders.push({
            ...serviceProvider,
            distance,
          })
        })

        // Sort the service providers based on their distances in ascending order
        serviceProviders.sort((a, b) => a.distance - b.distance)

        // Encode the search results as a JSON string
        const searchResults = JSON.stringify(serviceProviders)

        // URL-encode the JSON string
        const encodedResults = encodeURIComponent(searchResults)

        // Redirect to the search results page with the encoded results as the query parameter
        window.location.href = `searchResults.html?results=${encodedResults}`
      })
      .catch((error) => {
        console.error("Error searching for service providers: ", error)
      })
  })
}

// Function to calculate the distance between two locations using the Haversine formula
function calculateDistance(location1, location2) {
  const earthRadius = 6371 // Earth's radius in kilometers

  // Extract latitude and longitude from location strings
  const [lat1, lon1] = extractLatLon(location1)
  const [lat2, lon2] = extractLatLon(location2)

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = toRadians(lat1)
  const lon1Rad = toRadians(lon1)
  const lat2Rad = toRadians(lat2)
  const lon2Rad = toRadians(lon2)

  // Calculate the differences between the latitudes and longitudes
  const deltaLat = lat2Rad - lat1Rad
  const deltaLon = lon2Rad - lon1Rad

  // Calculate the distance using the Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadius * c

  return distance
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

// Function to extract latitude and longitude from location
function extractLatLon(location) {
  let latitude, longitude

  if (typeof location === "string") {
    const latIndex = location.indexOf("Lat: ")
    const lonIndex = location.indexOf("Lon: ")
    const latStr = location.substring(latIndex + 5, lonIndex).trim()
    const lonStr = location.substring(lonIndex + 5).trim()
    latitude = parseFloat(latStr)
    longitude = parseFloat(lonStr)
  } else if (typeof location === "object" && location !== null) {
    latitude = parseFloat(location.lat)
    longitude = parseFloat(location.lon)
  }

  return [latitude, longitude]
}

// Email code

const contactForm = document.getElementById("contactForm")

contactForm.addEventListener("submit", function (event) {
  event.preventDefault()

  // Get the form values
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const message = document.getElementById("message").value
  const subject = document.getElementById("subject").value

  // Send the email
  emailjs
    .send("service_xphng9f", "template_3l0umdz", {
      from_name: name,
      from_email: email,
      message: message,
      subject: subject,
    })
    .then(
      function (response) {
        console.log("Email sent successfully!", response.status, response.text)
        // Reset the form
        contactForm.reset()
        alert("Email Sent Successfully")
      },
      function (error) {
        console.error("Error sending email:", error)
        alert(error)
      }
    )
})

// registration form validation
// Get the submit button
// const submitBtn = document.querySelector("#registration-form button[type='submit']");

// // Add event listener for button click
// submitBtn.addEventListener("click", function (event) {
//   // Get the input values
//   const nameInput = document.getElementById("name");
//   const phoneInput = document.getElementById("phone");

//   // Get the values
//   const nameValue = nameInput.value;
//   const phoneValue = phoneInput.value;

//   // Validate the name field
//   const nameRegex = /^[A-Za-z]+$/;
//   if (!nameRegex.test(nameValue)) {
//     alert("Name should only contain letters. Please enter a valid name.");
//     nameInput.focus();
//     event.preventDefault(); // Prevent form submission
//     return;
//   }

//   // Validate the phone number field
//   const phoneRegex = /^\d{10}$/;
//   if (!phoneRegex.test(phoneValue)) {
//     alert("Phone number must be 10 digits. Please enter a valid phone number.");
//     phoneInput.focus();
//     event.preventDefault(); // Prevent form submission
//     return;
//   }

//   // If all validations pass, the form will be submitted
//   alert("Form submitted successfully!");
// });
