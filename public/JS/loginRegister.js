   const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const formTitle = document.getElementById("formTitle"); 
    const systemMessage=document.getElementById('system-message');

    loginTab.addEventListener("click", () => {
      loginForm.classList.remove("hidden");
      loginForm.classList.add("fade-in");
      registerForm.classList.add("hidden");
      loginTab.classList.add("border-[#2D2B22]");
      loginTab.classList.remove("border-transparent");
      registerTab.classList.remove("border-[#2D2B22]");
      registerTab.classList.add("border-transparent");
      formTitle.textContent = "Welcome Back"; 
    });

    registerTab.addEventListener("click", () => {
      registerForm.classList.remove("hidden");
      registerForm.classList.add("fade-in");
      loginForm.classList.add("hidden");
      registerTab.classList.add("border-[#2D2B22]");
      registerTab.classList.remove("border-transparent");
      loginTab.classList.remove("border-[#2D2B22]");
      loginTab.classList.add("border-transparent");
      formTitle.textContent = "Heyy Friend"; 
    });

    function registerUser(event){  //Function to handle registration
    event.preventDefault();
    const newUsername= document.getElementById('new-username').value; //Getting the field values
    const newEmail=document.getElementById('new-email').value;
    const newPassword=document.getElementById('new-password').value;


    if (!newUsername || !newEmail || !newPassword) {  //Checking for empty fields
        systemMessage.innerText='❌ All fields must be filled';
        systemMessage.style.opacity='1';
        setTimeout(closeMessage,2000);
    } else {
        const user = {
            username: newUsername,
            email: newEmail,
            password: newPassword,
          };
        
          // using Fetch to make the AJAX post request
          fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          })
          .then(response => response.json())
          .then(data => {
            if (data.userId) {
                window.location.href = '/create.html';  
            };
            if(data.error){  //Validation failed
              systemMessage.innerText=' ❌ ' + data.error;
              systemMessage.style.opacity = '1';
              setTimeout(closeMessage,2000);
            } 
          })
          .catch(error => {
            console.error('Error:', error);
            systemMessage.innerText='❌ Error' + error;
            systemMessage.style.opacity='1';
            setTimeout(closeMessage,2000);
          });
    }
}

function loginUser(event){  //Function to login a user
    event.preventDefault();
    const newEmail=document.getElementById('email').value; //getting the field values
    const newPassword=document.getElementById('password').value;

    const user={
        email:newEmail,
        password:newPassword
    }

    fetch('http://localhost:8000/login', {  //POST request to login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(data => {
        if (data.userId) {
          window.location.href = '/create.html';
        } else {  //Validation failed
          if(data.error){
            systemMessage.innerText=' ❌ ' + data.error;
             systemMessage.style.opacity='1';
          } 
        }
      })
      .catch(error => {
        console.error('Error:', error);
        systemMessage.innerText='❌ Error: ' + error;
        systemMessage.style.opacity='1';
        setTimeout(closeMessage,2000);
      });
}


function closeMessage(){  //Function to close the system message
    systemMessage.style.opacity='0';
}