
const getLocationBtn = document.getElementById('getLocationBtn');
const locationInput = document.getElementById('location');

// Get current location button click event listener
getLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const latitude = position.coords.latitude.toFixed(2);
        const longitude = position.coords.longitude.toFixed(2);
        
        // Use the latitude and longitude values to save the user's location
        locationInput.innerHTML = `     Lat: ${latitude}, Lon: ${longitude}`;
      },
      function(error) {
        console.log('Error retrieving location:', error.message);
      }
    );
  } else {
    console.log('Geolocation is not supported by the browser.');
  }
});


const firebaseConfig = {
    apiKey: "AIzaSyAjCj4qvrd-14h92Q5BOx25844Ojp-oid0",
    authDomain: "fixitfast-24307.firebaseapp.com",
    projectId: "fixitfast-24307",
    storageBucket: "fixitfast-24307.appspot.com",
    messagingSenderId: "142753407696",
    appId: "1:142753407696:web:cb948e9a7ec1953d48b4d5",
    measurementId: "G-P4B55N288F"
  };

  firebase.initializeApp(firebaseConfig);

  // Get a reference to the Firestore database
  const db = firebase.firestore();
  
  // Get the registration form element
  const registrationForm = document.getElementById("registration-form");
  
  // Add event listener for form submission
  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    // Get the values from the form inputs
    const name = document.getElementById("name").value;
    const phoneNumber = document.getElementById("phone").value;
    const expertise = document.getElementById("expertise").value;
    const availability = document.getElementById("availability").value;
    const location = document.getElementById("location").textContent;
    const imageFile = document.getElementById("image").files[0];
  
    // Validate the form inputs
    if (!isValidName(name)) {
      alert("Invalid name. Please enter a valid name.");
      return;
    }
  
    if (!isValidPhone(phoneNumber)) {
      alert("Invalid phone number. Please enter a 10-digit phone number.");
      return;
    }
  
    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }
  
    // Create a new service provider object
    const serviceProvider = {
      name,
      phoneNumber,
      expertise,
      availability,
      location,
    };
  
    // Save the service provider data to Firestore
    db.collection("serviceProviders")
      .add(serviceProvider)
      .then((docRef) => {
        // Upload the image file to Firebase Storage
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${docRef.id}`);
        imageRef.put(imageFile).then(() => {
          console.log("Image uploaded successfully!");
  
          // Reset form inputs
          registrationForm.reset();
          updateRegisterButton(name);
          // Redirect to index page
          window.location.href = "index.html";
        });
      })
      .catch((error) => {
        console.error("Error registering service provider: ", error);
      });
  });
  
  // Function to validate the name input
  function isValidName(name) {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  }
  
  // Function to validate the phone input
  function isValidPhone(phone) {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  }

  
  function updateRegisterButton(name) {
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.innerHTML = `<a class="active" href="demo.html"><i class="fa fa-user"></i> ${name}</a>`;
      }
  }