   const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const formTitle = document.getElementById("formTitle"); 

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