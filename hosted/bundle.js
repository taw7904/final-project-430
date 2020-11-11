"use strict";

// global csrfToken
var csrfToken; // add react components for our Domo app

var handleShow = function handleShow(e) {
  e.preventDefault();
  $("#showMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#showName").val() == '' || $("#showRating").val() == '' || $("#showService").val() == '' || $("#showStatus").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#showForm").attr("action"), $("#showForm").serialize(), function () {
    loadShowsFromServer();
  });
  return false;
}; // create React JSX for Add Domo form


var ShowForm = function ShowForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "showForm",
    onSubmit: handleShow,
    name: "showForm",
    action: "/maker",
    method: "POST",
    className: "showForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "showName",
    type: "text",
    name: "name",
    placeholder: "Show Name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rating"
  }, "Rating: "), /*#__PURE__*/React.createElement("input", {
    id: "showRating",
    type: "text",
    name: "rating",
    placeholder: "Show Rating"
  })), /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "service"
  }, "Service: "), /*#__PURE__*/React.createElement("select", {
    id: "showService",
    name: "service"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Netflix"
  }, "Netflix"), /*#__PURE__*/React.createElement("option", {
    value: "HBO"
  }, "HBO"), /*#__PURE__*/React.createElement("option", {
    value: "Disney+"
  }, "Disney+"), /*#__PURE__*/React.createElement("option", {
    value: "Hulu"
  }, "Hulu"), /*#__PURE__*/React.createElement("option", {
    value: "Amazon Prime"
  }, "Amazon Prime"), /*#__PURE__*/React.createElement("option", {
    value: "Sling TV"
  }, "Sling TV"), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "status"
  }, "Status: "), /*#__PURE__*/React.createElement("select", {
    id: "showStatus",
    name: "status"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Want to Watch"
  }, "Want to Watch"), /*#__PURE__*/React.createElement("option", {
    value: "Complete"
  }, "Complete"))), /*#__PURE__*/React.createElement("div", {
    className: "inputFields btnHolder"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeShowSubmit",
    type: "submit",
    value: "Add Show"
  })));
}; // determine what to draw


var ShowList = function ShowList(props) {
  if (props.shows.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "showList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyShow"
    }, "No shows yet"));
  }

  var showNodes = props.shows.map(function (show) {
    return /*#__PURE__*/React.createElement("div", {
      key: show._id,
      className: "show"
    }, /*#__PURE__*/React.createElement("img", {
      src: show.logo,
      alt: "show face",
      className: "showFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "showName"
    }, "Name: ", show.name), /*#__PURE__*/React.createElement("h3", {
      className: "showRating"
    }, "Rating: ", show.rating), /*#__PURE__*/React.createElement("h3", {
      className: "showService"
    }, "Service: ", show.service), /*#__PURE__*/React.createElement("h3", {
      className: "showStatus"
    }, "Status: ", show.status), /*#__PURE__*/React.createElement("input", {
      className: "editShow",
      type: "submit",
      value: "Edit Show",
      onClick: editShow,
      "data-showid": show._id,
      "data-csrf": props.csrf,
      "data-name": show.name,
      "data-rating": show.rating,
      "data-service": show.service,
      "data-logo": show.logo
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "showList"
  }, showNodes);
}; // COME BACK TO EDIT THIS


var editShow = function editShow(e) {
  var newStatus = window.prompt("What's the status?");
  var newData = {
    id: e.target.dataset.showid,
    status: newStatus,
    _csrf: csrfToken,
    name: e.target.dataset.name,
    rating: e.target.dataset.rating,
    service: e.target.dataset.service,
    logo: e.target.dataset.logo
  };
  sendAjax('POST', '/update', newData, loadShowsFromServer); //return false;
}; // add domos from server and render a domo list


var loadShowsFromServer = function loadShowsFromServer() {
  sendAjax('GET', '/getShows', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ShowList, {
      shows: data.shows
    }), document.querySelector("#shows"));
  });
}; // setup to call server to get domos


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ShowForm, {
    csrf: csrf
  }), document.querySelector("#makeShow"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ShowList, {
    shows: []
  }), document.querySelector("#shows"));
  loadShowsFromServer();
}; // get token when you need it and load react components


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    csrfToken = result.csrfToken;
    setup(result.csrfToken);
  });
}; // when page loads, call getToken method


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
