const url = `http://localhost:3000`;
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) {
    console.log(`all mandotry are required`);
  } else {
    const obj = {
      username,
      password,
    };
    const user = await axios.post(`${url}/user/login`, obj);
    console.log(user);
    if (user.data.statusCode == 200) {
      //save user creaditials in localStorage
      const {accessToken,refreshToken}=user.data.data;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      window.location = "/";
    } else alert("Something went wrong");
  }
});
