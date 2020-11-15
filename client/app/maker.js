// global csrfToken
let csrfToken;

// add react components for the app
const handleShow = (e) => {
    e.preventDefault();
    $("#showMessage").fadeIn(4000);
    
    if($("#showName").val() == '' || $("#showRating").val()=='' || $("#showService").val()=='' || $("#showStatus").val()=='') {
        handleError("All fields are required");
        return false;
    }
    sendAjax('POST', $("#showForm").attr("action"), $("#showForm").serialize(), function() {
        loadShowsFromServer();
    });
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
    
    const showNodes = props.shows.map(function(show) {
        return (
            <div key={show._id} className="show">
            <img src={show.logo} alt="Streaming Service Logo" className="showLogo" />
                <h3 className="showName">{show.name}</h3>
                <h3 className="showRating">{show.rating}</h3>
                <h3 className="showStatus">{show.status}</h3>
                <input className="editShow" type="submit" value="Change Status" onClick={editShow} data-showid={show._id} data-csrf={props.csrf} data-name={show.name} data-rating={show.rating} data-service={show.service} data-status={show.status} data-logo={show.logo}/>
            </div>
        );
    });
    
    return (
    <div className="showList">{showNodes}</div>
    );
};

// create React JSX for Filtering - come back to this after the filter function is created
const FilterForm = (props) => {
  return (
    <form id="filterForm" 
      name="filterForm"
      action="/filter"
      method="POST"
      className="filterForm"
      >
          Filter by:
          <input type="checkbox" name="Netflix" value="Netflix" className="filterBoxes"/>
          <label htmlFor="Netflix">Netflix</label>
          <input type="checkbox" name="HBO" value="HBO" className="filterBoxes"/>
          <label htmlFor="HBO">HBO</label>
          <input type="checkbox" name="Disney+" value="Disney+" className="filterBoxes"/>
          <label htmlFor="Disney+">Disney+</label>
          <input type="checkbox" name="Hulu" value="Hulu" className="filterBoxes"/>
          <label htmlFor="Hulu">Hulu</label>
          <input type="checkbox" name="Amazon" value="Amazon Prime" className="filterBoxes"/>
          <label htmlFor="Amazon">Amazon Prime</label>
          <input type="checkbox" name="Sling" value="Sling TV" className="filterBoxes"/>
          <label htmlFor="Sling">Sling TV</label>
          <input type="checkbox" name="Other" value="Other" className="filterBoxes"/>
          <label htmlFor="Other">Other</label>
          <input type="hidden" name="_csrf" value={props.csrf} />
    </form>
  );  
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

// setup to call server to get the shows
const setup = function(csrf) {
  ReactDOM.render(
  <FilterForm csrf={csrf} />, document.querySelector("#filtering")
  );
  ReactDOM.render(
  <ShowForm csrf={csrf} />, document.querySelector("#makeShow")
  );
    ReactDOM.render(
    <ShowList shows={[]} />, document.querySelector("#shows")
    );
    loadShowsFromServer();
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