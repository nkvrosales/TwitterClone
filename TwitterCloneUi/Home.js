//FUNCTION FOR DISPLAYING CURRENT USERNAME

function getUsernameFromLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username;
    }
    return null;
  }
  
  var logged_username = getUsernameFromLocalStorage();
  
  function displayUsername(){
  
    //validation
    if (logged_username) {
        console.log("Username retrieved from localStorage:", logged_username);
    } else {
        console.log("No username found in localStorage.");
    }
  
    //display username of logged user
    const usernameElement = document.getElementById('nav-user');
    if (usernameElement !== null){
        usernameElement.innerHTML = `<h3>${logged_username}</h3>`; 
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    displayUsername();
  });

//TWEET FUNCTION

function postTextAreaValueToAPI(event) {
  event.preventDefault();
  
  const textareaElement = document.getElementById("text-area");
  const textAreaValue = textareaElement.value;

  const apiUrl = "/api/v1/posts"; 
  const token = localStorage.getItem('token');

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`
    },
    body: JSON.stringify({ "content": textAreaValue }),
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API response:", data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error posting to API:", error);
    });
}



// FUNCTION FOR GETTING USER POSTS AND LIKES
const token = localStorage.getItem('token');
fetch('api/v1/posts', {
    method: 'GET',
    headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
    }
}).then(function(response) {
    return response.json();
}).then(function(posts) {
    // Assuming 'posts' is an array of post objects received from the API
    const postMainContainer = document.querySelector('.feed');

    posts.forEach(function(post) {
        // Create the post container div
        const postContainer = document.createElement('div');
        postContainer.classList.add('post');

        // Create the post avatar div and add it to the post container
        const postAvatar = document.createElement('div');
        postAvatar.classList.add('post__avatar');
        postAvatar.innerHTML = '<img src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"/>';
        postContainer.appendChild(postAvatar);

        // Create the post body div and add it to the post container
        const postBody = document.createElement('div');
        postBody.classList.add('post__body');

        // Create the post header div and add it to the post body
        const postHeader = document.createElement('div');
        postHeader.classList.add('post__header');

        // Create the post header text div and add it to the post header
        const postHeaderText = document.createElement('div');
        postHeaderText.classList.add('post__headerText');
        postHeaderText.innerHTML = `<h3>${post.postedBy}</h3>`; // Assuming 'username' is a property of the post object
        postHeader.appendChild(postHeaderText);

        // Create the post header description div and add it to the post header
        const postHeaderDescription = document.createElement('div');
        postHeaderDescription.classList.add('post__headerDescription');
        postHeaderDescription.innerHTML = `<p>${post.content}</p>`; // Assuming 'content' is a property of the post object
        postHeader.appendChild(postHeaderDescription);

        // Add the post header to the post body
        postBody.appendChild(postHeader);

        // Create the post footer div and add it to the post body
        const postFooter = document.createElement('div');
        postFooter.classList.add('post__footer');
        postFooter.innerHTML = `
          <span class="material-icons"> repeat </span>
          <span class="material-icons like-icon"> favorite_border </span>
          <span class="material-icons"> publish </span>
        `;
        postBody.appendChild(postFooter);

        // Get the like icon element
        const likeIcon = postFooter.querySelector('.like-icon');

        // Check if there is a saved state for the like icon
        const savedLikeState = localStorage.getItem('likeState_' + post.id);
        if (savedLikeState === 'liked') {
          likeIcon.textContent = 'favorite';
          likeIcon.style.color = 'red';
        }

        // Add event listener to handle like functionality
        likeIcon.addEventListener('click', function() {
          if (likeIcon.textContent === 'favorite_border') {
            likeIcon.textContent = 'favorite';
            likeIcon.style.color = 'red';
            // Save the state of the like icon as liked
            localStorage.setItem('likeState_' + post.id, 'liked');
            
          } else {
            likeIcon.textContent = 'favorite_border';
            likeIcon.style.color = ''; // Reset color
            // Remove the saved state of the like icon
            localStorage.removeItem('likeState_' + post.id);
            
          }
        });



        // Add the post body to the post container
        postContainer.appendChild(postBody);

        // Add the post container to the post main container
        postMainContainer.appendChild(postContainer);
    });
});



// FUNCTION FOR LIKES
const favoriteIcons = document.querySelectorAll('.favorite-icon');

favoriteIcons.forEach(function(icon) {
  icon.addEventListener('click', function() {
    // Toggle the class to change the appearance of the icon
    icon.classList.toggle('liked');

  
  });
});

