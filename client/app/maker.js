// global csrfToken
let csrfToken;

// add react components for our Domo app
const handleShow = (e) => {
    e.preventDefault();
    $("#showMessage").animate({width:'hide'},350);
    
    if($("#showName").val() == '' || $("#showRating").val()=='' || $("#showService").val()=='' || $("#showStatus").val()=='') {
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST', $("#showForm").attr("action"), $("#showForm").serialize(), function() {
        loadShowsFromServer();
    });
    return false;
};

// create React JSX for Add Domo form
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
      <input id="showRating" type="text" name="rating" placeholder="Rating"/>
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
              <option value="Watch Status" disabled>Watch Status</option>
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

// determine what to draw
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
                <h3 className="showRating">Rated {show.rating}</h3>
                <h3 className="showStatus">{show.status}</h3>
                <input className="editShow" type="submit" value="Edit Show" onClick={editShow} data-showid={show._id} data-csrf={props.csrf} data-name={show.name} data-rating={show.rating} data-service={show.service} data-logo={show.logo}/>
            </div>
        );
    });
    
    return (
    <div className="showList">{showNodes}</div>
    );
};

// COME BACK TO EDIT THIS
const editShow = (e) => {
    const newStatus = window.prompt("What's the status?");
    
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
    //return false;
};

// add domos from server and render a domo list
const loadShowsFromServer = () => {
    sendAjax('GET', '/getShows', null, (data) => {
       ReactDOM.render(
       <ShowList shows={data.shows} />, document.querySelector("#shows")
       ); 
    });
};

// setup to call server to get domos
const setup = function(csrf) {
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