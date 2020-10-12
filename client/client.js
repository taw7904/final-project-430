/*
On login and signup form submit, 
JS will make POST itself instead of form itself
JS will then wait for some server JSON reponse
Client side must communicate through AJAX or Websockets
*/

const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({width:'toggle'},350);
}

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      $("#domoMessage").animate({width:'hide'},350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
}

$(document).ready(() => {
    // waiting for signupSubmit button click from signup.handlebars
  $("#signupForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

      // validate the info
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;           
    }

      // post ajax request and serialize the form into key/value string
      // username=value&pass=value&pass2=value
    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });
  
  $("#domoForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());

    return false;
  });
});