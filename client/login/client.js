// call this when users attempt to login by clicking login button
// send AJAX request to login POST url
const handleLogin = (e) => {
  e.preventDefault();
    $("#showMessage").animate({width:'hide'},350);
    
    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }
    
    console.log($("input[name=_csrf]").val());
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

// handle clicks to the sign up button
const handleSignup = (e) => {
  e.preventDefault();
    $("#showMessage").animate({width:'hide'},350);
    
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("RAWR! Passwords do not match");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};

// here is where react starts, using JSX syntax to create HTML like objects in JS
// templating language in React to quickly create and render UI at higher speed/optimization
// secured against unsafe input and has 'this' context so each object made of it can have 
// own variable scope. Allows us to re-render/update something on screen on the fly
const LoginWindow = (props) => {
  return (
    <form id="loginForm" 
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
      >
      <input id="user" type="text" name="username" placeholder="Username"/>
      <input id="pass" type="password" name="pass" placeholder="Password"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="SIGN IN" />
    </form>
  );  
};

// same thing as above, but with sign up
const SignupWindow = (props) => {
  return (
    <form id="signupForm" 
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
      >
      <input id="user" type="text" name="username" placeholder="Username"/>
      <input id="pass" type="password" name="pass" placeholder="Password"/>
      <input id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="SIGN UP" />
    </form>
  );  
};

// create the login form and token with it
// ReactDOM.render first arg takes JSX of UI along with variables as attributes
// second argument is what container to add new React UI to
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// same as above, but sign up
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// attach events to page buttons. on click, UI will re-render
// default to the login page
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