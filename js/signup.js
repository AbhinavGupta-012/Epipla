let lname=localStorage.getItem('name');
let lemail=localStorage.getItem('email');
let lusername=localStorage.getItem('username');
let lpwd=localStorage.getItem('pwd');
let lcpwd=localStorage.getItem('cpwd');

lname ? lname = lname.split(",") : lname = [];
lemail ? lemail = lemail.split(",") : lemail = [];
lusername ? lusername = lusername.split(",") : lusername = [];
lpwd ? lpwd = lpwd.split(",") : lpwd = [];
lcpwd ? lcpwd = lcpwd.split(",") : lcpwd = [];

function sign(){
    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let username = document.querySelector('#username').value;
    let pwd = document.querySelector('#pwd').value;
    let cpwd = document.querySelector('#cpwd').value;
    if(lusername.includes(username)){
        alert('Username already exists. Please choose a different one.');
        return;
    }
    if(!name || !email || !username || !pwd || !cpwd){
        alert("Please fill all the fields");
    }
     else{
    if(pwd === cpwd){
        lname.push(name);
        lemail.push(email);
        lusername.push(username);
        lpwd.push(pwd);
        saveDataToLocal();
        alert("User Saved");
    }
    else{
        alert("Password do no match. Please try again");
    }
}
}

function saveDataToLocal(){
    localStorage.setItem('name',lname);
    localStorage.setItem('email',lemail);
    localStorage.setItem('username', lusername);
    localStorage.setItem('pwd', lpwd);
}

function login(){
    let counter=0;
    let username = document.querySelector('#username').value;
    let pwd = document.querySelector('#pwd').value;
    for (let i = 0; i < lusername.length; i++) {
        if (username == lusername[i] && pwd == lpwd[i]) {
            counter++;
        }
    }
    if (counter == 1) {
        alert("Login Granted!!")

    } else {
        alert("Try Again!!")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".toggle-btn");
    const signupSection = document.querySelector(".signup-section");
    const loginSection = document.querySelector(".login-section");

    toggleButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            signupSection.classList.toggle("active");
            loginSection.classList.toggle("active");
        });
    });
});

