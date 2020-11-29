// global csrfToken
let csrfToken;
// all the different streaming service filters
let filterArr = [];
// starting index of filtered array
let s1 = 1;
// ending index of filtered array
let s2 = 6;
// temporary variables for keeping track of pages once filtered
let tempS;
let pageNums = 1;
let currPage = 1;

// add react components for the app
const handleShow = (e) => {
    e.preventDefault();
    $("#showMessage").animate({width:'hide'},600);
    
    if($("#showName").val() == '' || $("#showRating").val()=='' || $("#showService").val()=='' || $("#showStatus").val()=='') {
        handleError("All fields are required");
        return false;
    }
    sendAjax('POST', $("#showForm").attr("action"), $("#showForm").serialize(), loadShowsFromServer);
    return false;
};

// handle clicks to the change pass button
const handleChangePass = (e) => {
  e.preventDefault();
    $("#showMessage").animate({width:'hide'},600);
    
    if($("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Passwords do not match");
        return false;
    }
    
    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
    return false;
};

// create React JSX for Add Input Show form
const ShowForm = (props) => {
  return (
    <form id="showForm" 
      onSubmit={handleShow}
      name="showForm"
      action="/maker"
      method="POST"
      className="showForm"
      >
          <div className="directions">
            <b>enterTAYment</b> is your streaming service assistant! Enter all of the shows you're dying to see, and then change the status to complete when you've happily completed your binge! Use the filters to search and refine your list.
              </div>
          <div className="inputFields">
            <input id="showName" type="text" name="name" placeholder="Title of Show"/>
              </div>
          <div className="inputFields">
              <select id="showRating" name="rating" defaultValue="Rating">
              <option value="Rating" disabled >Rating</option>
              <option value="TV-Y">TV-Y</option>
              <option value="TV-Y7">TV-Y7</option>
              <option value="TV-Y7-FV">TV-Y7-FV</option>
                  <option value="TV-G">TV-G</option>
                  <option value="TV-PG">TV-PG</option>
                  <option value="TV-14">TV-14</option>
                  <option value="TV-MA">TV-MA</option>
            </select>
              </div>
          <div className="inputFields">
            <select id="showService" name="service" defaultValue="Streaming Service">
            <option value="Streaming Service" disabled>Streaming Service</option>
            <option value="Netflix">Netflix</option>
            <option value="HBO">HBO</option>
                <option value="Disney+">Disney+</option>
                <option value="Hulu">Hulu</option>
                <option value="Amazon Prime">Amazon Prime</option>
                <option value="Sling TV">Sling TV</option>
                <option value="Other">Other</option>
            </select>
              </div>
          <div className="inputFields">
          <select id="showStatus" name="status" defaultValue="Watch Status">
              <option value="Watch Status" disabled >Watch Status</option>
              <option value="Watchlist">Watchlist</option>
              <option value="Complete">Complete</option>
            </select>
              </div>
          <div className="inputFields btnHolder">
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeShowSubmit" type="submit" value="Add Show" />
              </div>
    </form>
  );  
};

// determine what to print out for each show
const ShowList = function(props) {
  if(props.shows.length===0) {
      return (
      <div className="showList">
          <h3 className="emptyShow">No shows yet</h3>
          </div>
      );
  }
    //count how many shows are in the array
    let s = 0;
    
    const showNodes = props.shows.map(function(show) {
        //only return if the filters are empty, or if the show is in the filter
        if(filterArr.length == 0 || filterArr.includes(show.service)) {
        s++;
        tempS = s;
        // calculate the page number & current page
        pageNums = Math.ceil(tempS/6);
        if(pageNums==0) { pageNums = 1 }
            
        //display the shows if theyre in the page range
        if(s >= s1 && s <= s2) {
        return (
            <div key={show._id} className={`${show.status} show`}>
            <img src={show.logo} alt="Streaming Service Logo" className="showLogo" />
                <h3 className="showName">{show.name}</h3>
                <h3 className="showRating">{show.rating}</h3>
                <h3 className="showStatus">{show.status}</h3>
                <input className="editShow" type="submit" value="Change Status" onClick={editShow} data-showid={show._id} data-csrf={props.csrf} data-name={show.name} data-rating={show.rating} data-service={show.service} data-status={show.status} data-logo={show.logo}/>
            </div>
        );
    }
        }
    });
    
    return (
    <div className="showList">
        <span className="next" onClick={scrollShow}>Next</span>
        <span className="prev" onClick={scrollShow}>Previous</span>
        <span className="page" >Page {currPage} of {pageNums}</span>
            {showNodes}
        <span className="next" id="belowNext" onClick={scrollShow}>Next</span>
        <span className="prev" id="belowPrev" onClick={scrollShow}>Previous</span>
        </div>
    );
};

// create React JSX for Filtering 
const FilterForm = (props) => {
  return (
    <form id="filterForm" 
      name="filterForm"
      method="POST"
      className="filterForm"
      >
          <input id="premBtn" type="button" name="premMode" value="Turn On Premium" onClick={premChange} />
          
          <span id="filterSpan">Filter by:
          <input type="checkbox" name="Netflix" value="Netflix" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="Netflix">Netflix</label>
          <input type="checkbox" name="HBO" value="HBO" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="HBO">HBO</label>
          <input type="checkbox" name="Disney+" value="Disney+" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="Disney+">Disney+</label>
          <input type="checkbox" name="Hulu" value="Hulu" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="Hulu">Hulu</label>
          <input type="checkbox" name="Amazon" value="Amazon Prime" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="Amazon">Amazon Prime</label>
          <input type="checkbox" name="Sling" value="Sling TV" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="Sling">Sling TV</label>
          <input type="checkbox" name="Other" value="Other" className="filterBoxes" onChange={checkFilters}/>
          <label htmlFor="Other" id="otherLabel">Other</label>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input id="clearBtn" type="button" name="clearBtn" value="Clear Filters" onClick={clearFilters}/>
          </span>
    </form>
  );  
};

// create React JSX for deleting all form/button
const DeleteForm = (props) => {
  return (
    <form id="deleteForm" 
      name="deleteForm"
      action="/delete"
      method="POST"
      className="deleteForm"
      >
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input id="deleteBtn" type="button" name="deleteBtn" value="Delete All Shows" onClick={deleteAll} />
    </form>
  );  
};

// create content area for the ads to appear and cycle through
const AdBox = (props) => {
  return (
    <div id="slideshow">
    <div>
     <img src="/assets/img/ads/wellness.png" alt="Wellness Tracker" />
    </div>
    <div>
     <img src="/assets/img/ads/igme430.png" alt="IGME340, Everyone's Favorite Online Class" />
    </div>
    <div>
     <img src="/assets/img/ads/holiday.png" alt="Holiday Deals" />
    </div>
    </div>
  );  
};

// called when delete all shows button is clicked
// will delete all the shows from this users database
const deleteAll = (e) => {
    sendAjax('POST', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), loadShowsFromServer);
};

// controlls going to the next page of shows when next or previous is hit
const scrollShow = (e) => {
    if(e.target.className==='next' && s2 < tempS) {
        s1 += 6;
        s2 += 6;
        currPage++;
    }
    if(e.target.className==='prev')  {
        if(s2<=6) {
            s1 = 1;
            s2 = 6;
        }
        else {
        s1 -= 6;
        s2 -= 6;
        currPage--;
        }
    }
    loadShowsFromServer();
};

// get the filters from the checkboxes and add them to array
const checkFilters = (e) => {
    currPage=1;
    s1=1;
    s2=6;
    if(e.target.checked) {
        filterArr.push(e.target.value);
    }
    else {
        filterArr = filterArr.filter(el => el !== e.target.value);
    }
    loadShowsFromServer();
};

// clear all filters on button click
const clearFilters = (e) => {
    currPage=1;
    s1=1;
    s2=6;
    filterArr = [];
    const boxes = document.querySelectorAll('.filterBoxes');
    for(let i=0; i<boxes.length; i++) {
        boxes[i].checked = false;
    }
    loadShowsFromServer();
};

// toggle premium mode on and off
const premChange = (e) => {
    if(e.target.value==='Turn On Premium') {
        e.target.value = 'Turn Off Premium';
        e.target.style.fontWeight = 'normal';
        document.querySelector('#filterSpan').style.display = 'inline';
    }
    else {
        e.target.value = 'Turn On Premium';
        e.target.style.fontWeight = 'bold';
        document.querySelector('#filterSpan').style.display = 'none';
    }
};

// Change the status of the show depending on if it was on the watchlist or complete
const editShow = (e) => {
    let newStatus;
    if(e.target.dataset.status === 'Watchlist') {
        newStatus = "Complete";
    }
    else {
        newStatus = "Watchlist";
    }
    
    let newData = {
    id: e.target.dataset.showid,
    status: newStatus,
    _csrf: csrfToken,
    name: e.target.dataset.name,
    rating: e.target.dataset.rating,
    service: e.target.dataset.service,
    logo: e.target.dataset.logo,
    };
    
    sendAjax('POST', '/update', newData, loadShowsFromServer);
};

// add the shows from the server and render the list
const loadShowsFromServer = () => {
    sendAjax('GET', '/getShows', null, (data) => {
       ReactDOM.render(
       <ShowList shows={data.shows} />, document.querySelector("#shows")
       ); 
    });
};

// create React JSX for the password change pop up
const ChangePassWindow = (props) => {
  return (
    <form id="changePassForm" 
      name="changePassForm"
      onSubmit={handleChangePass}
      action="/changePass"
      method="POST"
      className="mainForm"
      >
      <img id="frontLogo" src="/assets/img/favicon.png" alt="entertayment logo"/>
      <input id="pass" type="password" name="pass" placeholder="New Password"/>
      <input id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="CHANGE" />
    </form>
  );  
};

// only render this on click of the change password button
const createChangePassWindow = (csrf) => {
    ReactDOM.render(
        <ChangePassWindow csrf={csrf} />,
        document.querySelector("#passChange")
    );
};

// setup to call server to get the shows
const setup = function(csrf) {
  ReactDOM.render(
  <FilterForm csrf={csrf} />, document.querySelector("#filtering")
  );
  ReactDOM.render(
  <ShowForm csrf={csrf} />, document.querySelector("#makeShow")
  );
  ReactDOM.render(
  <DeleteForm csrf={csrf} />, document.querySelector("#deleteAll")
  );
  ReactDOM.render(
  <AdBox csrf={csrf} />, document.querySelector("#adBox")
  );
  ReactDOM.render(
  <ShowList shows={[]} />, document.querySelector("#shows")
  );
    // set up the slideshow ad functionality
    setUpSlides();
    // hook up rendering the change password button to the click
    const changePassButton = document.querySelector("#changePassButton");
    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePassWindow(csrf);
        // make everything underneath opaque
        document.querySelector("#mainShowDiv").style.opacity = 0.3;
        return false;
    });
    loadShowsFromServer();
};

// set up the slideshow ad functionality
// to rotate through each ad every 7 seconds
const setUpSlides = () => {
    /* rotating through ad slideshow code help from here: 
    https://css-tricks.com/snippets/jquery/simple-auto-playing-slideshow/ 
    */
  $("#slideshow > div:gt(0)").hide();

    setInterval(function() { 
    $('#slideshow > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
    },  7000);  
};

// get token when you need it and load react components
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken;
        setup(result.csrfToken);
    });
};

// when page loads, call getToken method
$(document).ready(function() {
    getToken();
});