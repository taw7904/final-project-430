"use strict";

// call this when users attempt to login by clicking login button
// send AJAX request to login POST url
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $('#showMessage').fadeIn(4000);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  } //console.log($("input[name=_csrf]").val());


  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; // handle clicks to the sign up button


var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#showMessage").fadeIn(4000);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; // create login window template


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("img", {
    id: "frontLogo",
    src: "/assets/img/favicon.png",
    alt: "entertayment logo"
  }), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "Username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "SIGN IN"
  }));
}; // same thing as above, but with sign up


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("img", {
    id: "frontLogo",
    src: "/assets/img/favicon.png",
    alt: "entertayment logo"
  }), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "Username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "Retype Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "SIGN UP"
  }));
}; // create the login form and token with it and render it to the content area


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // same as above, but sign up


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // attach events to page buttons. on click, UI will re-render


var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  }); // default login view

  createLoginWindow(csrf);
}; // get new token whenever needed


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; // call our token on page load. setup the rest of the page
// to allow React components to show various pages without leaving page


$(document).ready(function () {
  getToken();
});
"use strict";

// functions to be shared across bundles
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#showMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#showMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
