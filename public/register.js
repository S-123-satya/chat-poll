const registerBtn = document.getElementById('registerBtn');
const url="http://localhost:3000"
registerBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if(!username || !email || !password){
        alert(`all mandotry are required`);
    }
    else{
        const obj={
            username,
            password,
            email,
        }
        const user=await axios.post(`${url}/user/register`,obj);
        if(user.data.statusCode==201){
            //save user creaditials in localStorage
            const {accessToken,refreshToken}=user.data.data;
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accessToken", accessToken);
            window.location='/';
        }
        else alert("Something went wrong");
    }
    
})
