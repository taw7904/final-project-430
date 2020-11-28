"use strict";

// global csrfToken
var csrfToken;
var filterArr = [];
var showLength;
var s1 = 1;
var s2 = 6;
var tempS; // add react components for the app

var handleShow = function handleShow(e) {
  e.preventDefault();
  $("#showMessage").animate({
    width: 'hide'
  }, 600);

  if ($("#showName").val() == '' || $("#showRating").val() == '' || $("#showService").val() == '' || $("#showStatus").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#showForm").attr("action"), $("#showForm").serialize(), loadShowsFromServer);
  return false;
}; // handle clicks to the change pass button


var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#showMessage").animate({
    width: 'hide'
  }, 600);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  return false;
}; // create React JSX for Add Input Show form


var ShowForm = function ShowForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "showForm",
    onSubmit: handleShow,
    name: "showForm",
    action: "/maker",
    method: "POST",
    className: "showForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions"
  }, /*#__PURE__*/React.createElement("b", null, "enterTAYment"), " is your streaming service assistant! Enter all of the shows you're dying to see, and then change the status to complete when you've happily completed your binge! Use the filters to search and refine your list."), /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("input", {
    id: "showName",
    type: "text",
    name: "name",
    placeholder: "Title of Show"
  })), /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("select", {
    id: "showRating",
    name: "rating",
    defaultValue: "Rating"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Rating",
    disabled: true
  }, "Rating"), /*#__PURE__*/React.createElement("option", {
    value: "TV-Y"
  }, "TV-Y"), /*#__PURE__*/React.createElement("option", {
    value: "TV-Y7"
  }, "TV-Y7"), /*#__PURE__*/React.createElement("option", {
    value: "TV-Y7-FV"
  }, "TV-Y7-FV"), /*#__PURE__*/React.createElement("option", {
    value: "TV-G"
  }, "TV-G"), /*#__PURE__*/React.createElement("option", {
    value: "TV-PG"
  }, "TV-PG"), /*#__PURE__*/React.createElement("option", {
    value: "TV-14"
  }, "TV-14"), /*#__PURE__*/React.createElement("option", {
    value: "TV-MA"
  }, "TV-MA"))), /*#__PURE__*/React.createElement("div", {
    className: "inputFields"
  }, /*#__PURE__*/React.createElement("select", {
    id: "showService",
    name: "service",
    defaultValue: "Streaming Service"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Streaming Service",
    disabled: true
  }, "Streaming Service"), /*#__PURE__*/React.createElement("option", {
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
  }, /*#__PURE__*/React.createElement("select", {
    id: "showStatus",
    name: "status",
    defaultValue: "Watch Status"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Watch Status",
    disabled: true
  }, "Watch Status"), /*#__PURE__*/React.createElement("option", {
    value: "Watchlist"
  }, "Watchlist"), /*#__PURE__*/React.createElement("option", {
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
}; // determine what to print out for each show


var ShowList = function ShowList(props) {
  if (props.shows.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "showList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyShow"
    }, "No shows yet"));
  }

  showLength = props.shows.length;
  console.log(showLength);
  var s = 0;
  var showNodes = props.shows.map(function (show) {
    //only return if the filters are empty, or if the show is in the filter
    if (filterArr.length == 0 || filterArr.includes(show.service)) {
      s++;
      tempS = s;

      if (s >= s1 && s <= s2) {
        return /*#__PURE__*/React.createElement("div", {
          key: show._id,
          className: "".concat(show.status, " show")
        }, /*#__PURE__*/React.createElement("img", {
          src: show.logo,
          alt: "Streaming Service Logo",
          className: "showLogo"
        }), /*#__PURE__*/React.createElement("h3", {
          className: "showName"
        }, show.name), /*#__PURE__*/React.createElement("h3", {
          className: "showRating"
        }, show.rating), /*#__PURE__*/React.createElement("h3", {
          className: "showStatus"
        }, show.status), /*#__PURE__*/React.createElement("input", {
          className: "editShow",
          type: "submit",
          value: "Change Status",
          onClick: editShow,
          "data-showid": show._id,
          "data-csrf": props.csrf,
          "data-name": show.name,
          "data-rating": show.rating,
          "data-service": show.service,
          "data-status": show.status,
          "data-logo": show.logo
        }));
      }
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "showList"
  }, /*#__PURE__*/React.createElement("span", {
    className: "next",
    onClick: scrollShow
  }, "Next"), /*#__PURE__*/React.createElement("span", {
    className: "prev",
    onClick: scrollShow
  }, "Previous"), showNodes, /*#__PURE__*/React.createElement("span", {
    className: "next",
    id: "belowNext",
    onClick: scrollShow
  }, "Next"), /*#__PURE__*/React.createElement("span", {
    className: "prev",
    id: "belowPrev",
    onClick: scrollShow
  }, "Previous"));
}; // create React JSX for Filtering - come back to this after the filter function is created


var FilterForm = function FilterForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "filterForm",
    name: "filterForm",
    method: "POST",
    className: "filterForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "premBtn",
    type: "button",
    name: "premMode",
    value: "Turn On Premium",
    onClick: premChange
  }), /*#__PURE__*/React.createElement("span", {
    id: "filterSpan"
  }, "Filter by:", /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "Netflix",
    value: "Netflix",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "Netflix"
  }, "Netflix"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "HBO",
    value: "HBO",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "HBO"
  }, "HBO"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "Disney+",
    value: "Disney+",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "Disney+"
  }, "Disney+"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "Hulu",
    value: "Hulu",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "Hulu"
  }, "Hulu"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "Amazon",
    value: "Amazon Prime",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "Amazon"
  }, "Amazon Prime"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "Sling",
    value: "Sling TV",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "Sling"
  }, "Sling TV"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "Other",
    value: "Other",
    className: "filterBoxes",
    onChange: checkFilters
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "Other",
    id: "otherLabel"
  }, "Other"), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "clearBtn",
    type: "button",
    name: "clearBtn",
    value: "Clear Filters",
    onClick: clearFilters
  })));
};

var DeleteForm = function DeleteForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "deleteForm",
    name: "deleteForm",
    action: "/delete",
    method: "POST",
    className: "deleteForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "deleteBtn",
    type: "button",
    name: "deleteBtn",
    value: "Delete All Shows",
    onClick: deleteAll
  }));
};

var deleteAll = function deleteAll(e) {
  console.log("delete all");
  sendAjax('POST', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), loadShowsFromServer);
};

var scrollShow = function scrollShow(e) {
  console.log("test" + tempS);

  if (e.target.className === 'next' && s2 < tempS) {
    s1 += 6;
    s2 += 6;
  }

  if (e.target.className === 'prev') {
    if (s2 <= 6) {
      s1 = 1;
      s2 = 6;
    } else {
      s1 -= 6;
      s2 -= 6;
    }
  }

  loadShowsFromServer();
}; // get the filters from the checkboxes and add them to array


var checkFilters = function checkFilters(e) {
  if (e.target.checked) {
    filterArr.push(e.target.value);
  } else {
    filterArr = filterArr.filter(function (el) {
      return el !== e.target.value;
    });
  }

  console.log(e.target.value);
  loadShowsFromServer();
}; // clear all filters on button click


var clearFilters = function clearFilters(e) {
  filterArr = [];
  var boxes = document.querySelectorAll('.filterBoxes');

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = false;
  }

  loadShowsFromServer();
}; // toggle premium mode on and off


var premChange = function premChange(e) {
  if (e.target.value === 'Turn On Premium') {
    e.target.value = 'Turn Off Premium';
    e.target.style.fontWeight = 'normal';
    document.querySelector('#filterSpan').style.display = 'inline';
  } else {
    e.target.value = 'Turn On Premium';
    e.target.style.fontWeight = 'bold';
    document.querySelector('#filterSpan').style.display = 'none';
  }
}; // Change the status of the show depending on if it was on the watchlist or complete


var editShow = function editShow(e) {
  var newStatus;

  if (e.target.dataset.status === 'Watchlist') {
    newStatus = "Complete";
  } else {
    newStatus = "Watchlist";
  }

  var newData = {
    id: e.target.dataset.showid,
    status: newStatus,
    _csrf: csrfToken,
    name: e.target.dataset.name,
    rating: e.target.dataset.rating,
    service: e.target.dataset.service,
    logo: e.target.dataset.logo
  };
  sendAjax('POST', '/update', newData, loadShowsFromServer);
}; // add the shows from the server and render the list


var loadShowsFromServer = function loadShowsFromServer() {
  sendAjax('GET', '/getShows', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ShowList, {
      shows: data.shows
    }), document.querySelector("#shows"));
  });
};

var ChangePassWindow = function ChangePassWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleChangePass,
    action: "/changePass",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("img", {
    id: "frontLogo",
    src: "/assets/img/favicon.png",
    alt: "entertayment logo"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "New Password"
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
    value: "CHANGE"
  }));
};

var createChangePassWindow = function createChangePassWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, {
    csrf: csrf
  }), document.querySelector("#passChange"));
}; // setup to call server to get the shows


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FilterForm, {
    csrf: csrf
  }), document.querySelector("#filtering"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ShowForm, {
    csrf: csrf
  }), document.querySelector("#makeShow"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DeleteForm, {
    csrf: csrf
  }), document.querySelector("#deleteAll"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ShowList, {
    shows: []
  }), document.querySelector("#shows"));
  var changePassButton = document.querySelector("#changePassButton");
  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePassWindow(csrf);
    document.querySelector("#mainShowDiv").style.opacity = 0.3;
    return false;
  });
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
