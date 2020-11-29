// call this when users attempt to login by clicking login button
// send AJAX request to login POST url
const handleLogin = (e) => {
    e.preventDefault();
    $("#showMessage").animate({width:'hide'},600);
    
    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    
    return false;
};

// handle clicks to the sign up button
const handleSignup = (e) => {
  e.preventDefault();
    $("#showMessage").animate({width:'hide'},600);
    
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Passwords do not match");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};

// create login window template
const LoginWindow = (props) => {
  return (
    <form id="loginForm" 
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
      >
      <img id="frontLogo" src="/assets/img/favicon.png" alt="entertayment logo"/>   
      <input id="user" type="text" name="username" placeholder="Username"/>
      <input id="pass" type="password" name="pass" placeholder="Password"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="SIGN IN" />
    </form>
  );  
};

// create sign up window template
const SignupWindow = (props) => {
  return (
    <form id="signupForm" 
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
      >
      <img id="frontLogo" src="/assets/img/favicon.png" alt="entertayment logo"/>
      <input id="user" type="text" name="username" placeholder="Username"/>
      <input id="pass" type="password" name="pass" placeholder="Password"/>
      <input id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="SIGN UP" />
    </form>
  );  
};

// create the login form and token with it and render it to the content area
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// create the sign up form and token with it and render to content area
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// attach events to page buttons. on click, UI will re-render
const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    
    signupButton.addEventListener("click", (e) => {
       e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });
    
    loginButton.addEventListener("click", (e) => {
       e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
    
    // default login view
    createLoginWindow(csrf);
};

// get new token whenever needed
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// call our token on page load. setup the rest of the page
// to allow React components to show various pages without leaving page
$(document).ready(function() {
    getToken();
});