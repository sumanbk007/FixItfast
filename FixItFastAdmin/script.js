//initialize firebase
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

// Firestore database reference
var db = firebase.firestore();

// Reference to the users collection
var pendingUsersRef = db.collection("pendingUsers");

// Get the table body element
var tableBody = document.querySelector("#usersTable tbody");

// Function to extract latitude and longitude from location string
function extractLocationCoordinates(location) {
  var regex = /Lat:\s*(-?\d+\.\d+),\s*Lon:\s*(-?\d+\.\d+)/;
  var matches = regex.exec(location);
  if (matches && matches.length === 3) {
    var lat = parseFloat(matches[1]);
    var lon = parseFloat(matches[2]);
    return { lat, lon };
  }
  return null;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}



// Function to generate HTML for a user row
function createUserRow(user) {

  var row = document.createElement("tr");
  console.log(`userLocation: ${user.Location}`)

  row.innerHTML = `
    <td>${user.Name}</td>
    <td>${user.PhoneNumber}</td>
    <td>${user.location}</td>
    <td>${user.Experience}</td>
    <td>${user.Expertise}</td>
    <td>${user.Availability}</td>
    <td class="actions">
      <button class="verify" data-id="${user.id}">Verify</button>
    </td>
  `;
  return row;
}

// Function to generate HTML for a user row
function createUserRow(user) {
  var row = document.createElement("tr");
  row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.phoneNumber}</td>
      <td>${user.location.lat}, ${user.location.lon}</td>
      <td>${user.experience}</td>
      <td>${user.expertise}</td>
      <td>${capitalize(user.availability.replace("_", " "))}</td>
      <td><img src="${user.imageUrl}" alt="User Image" class="user-image"></td>
      <td class="actions">
        <button class="verify" data-id="${user.id}">Verify</button>
      </td>
    `;
  return row;
}

// Function to fetch and display pending users
function displayPendingUsers() {
  pendingUsersRef.get().then((querySnapshot) => {
    tableBody.innerHTML = "";

    if (querySnapshot.size === 0) {
      var noUsersRow = document.createElement("tr");
      noUsersRow.innerHTML = `
          <td colspan="7" class="no-users">No Pending Users</td>
        `;
      tableBody.appendChild(noUsersRow);
    } else {
      querySnapshot.forEach((doc) => {
        var user = doc.data();
        user.id = doc.id;
        user.location = extractLocationCoordinates(user.location); // Extract latitude and longitude
        var row = createUserRow(user);
        tableBody.appendChild(row);
      });
    }
  });
}


// Event listener for the "Verify" button clicks
tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("verify")) {
    var userId = event.target.dataset.id;
    verifyUser(userId);
  }
});

// Function to verify a user
function verifyUser(userId) {
  // Get the user document from the pendingUsers collection
  pendingUsersRef
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var user = doc.data();
        // Set the userType field to "provider"
        user.userType = "provider";

        // Create a new document in the users collection with the updated user data
        db.collection("users")
          .doc(userId)
          .set(user)
          .then(() => {
            console.log("User migrated successfully!");

            // Delete the user from the pendingUsers collection
            return pendingUsersRef.doc(userId).delete();
          })
          .then(() => {
            console.log("User verified and removed from pendingUsers!");

            // Refresh the table after verification
            displayPendingUsers();
          })
          .catch((error) => {
            console.error("Error migrating user: ", error);
          });
      } else {
        console.log("User document not found!");
      }
    })
    .catch((error) => {
      console.error("Error verifying user: ", error);
    });
}

// Display pending users on page load
displayPendingUsers();


// Click user image
// Get the modal and close button elements
var modal = document.getElementById("imageModal");
var modalImage = document.getElementById("modalImage");
var closeButton = document.getElementsByClassName("close")[0];

// Add event listener to close the modal when the close button is clicked
closeButton.addEventListener("click", function () {
  modal.style.display = "none";
});

// Function to open the modal and display the clicked image
function openImage(imageUrl) {
  modalImage.src = imageUrl;
  modal.style.display = "block";
}

// Attach an event listener to each user image
var userImages = document.getElementsByClassName("user-image");
Array.from(userImages).forEach(function (userImage) {
  userImage.addEventListener("click", function () {
    var imageUrl = this.getAttribute("src");
    openImage(imageUrl);
  });
});

