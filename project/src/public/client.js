let store = {
  user: { name: "Preetham Dalvay" },
  apod: "",
  //   rovers: ["APOD", "Curiosity", "Opportunity", "Spirit"],
  rovers: [],
  selectedRover: "",
  roverInfo: {},
  roverPhotos: [],
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod, selectedRover, roverInfo, roverPhotos } = state;

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3> Select a Mars Rover </h3>
                ${Rovers(rovers)}
            </section>
            <section>
                ${RoverInfo(selectedRover, roverInfo)}

                ${
                  selectedRover &&
                  roverPhotos.photos &&
                  !roverPhotos.photos.length > 0
                    ? `<h3>No Photos from ${selectedRover}</h3>`
                    : ShowRoverPhotos(selectedRover, roverPhotos)
                }
                    
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
const defaultHolder = (state) => {
  const { apod, rover, roverPhotos } = state;
  return `<h3>Put things on the page!</h3>
                    <p>Here is an example section.</p>
                    <p>
                        One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                        the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                        This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                        applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                        explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                        but generally help with discoverability of relevant imagery.
                    </p>
                    ${ImageOfTheDay(apod)}
                    <div id="rover-photos">
            <h2>${rover} Photos</h2>
            <div id="carouselPhotos" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                  ${roverPhotos.photos
                    .map((photo, index) => {
                      // console.log("index", index);
                      // console.log("photo", photo);
                      if (index === 0) {
                        return `<div class="carousel-item active" data-interval="500">
                          <img src="${photo}" class="d-block w-100" alt="photo">
                        </div>`;
                      } else if (index < 3) {
                        return `<div class="carousel-item"  data-interval="500">
                          <img src="${photo}" class="d-block w-100" alt="photo">
                        </div>`;
                      }
                    })
                    .join("")}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselPhotos" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselPhotos" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
        </div>
                    
                    `;
};

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

//Pure function that renders a list of rovers
const Rovers = (rovers) => {
  if (rovers.length > 0) {
    return `
                <ul class="nav nav-tabs">
                    ${rovers
                      .map(
                        (rover) =>
                          `<li class="nav-item"><a class="nav-link" href="#" onClick="handleClick(event)">${rover}</a></li>`
                      )
                      .join("")}
                </ul>                
            `;
  } else {
    getRovers(store);
    return `
                  <ul class="nav nav-tabs">
                      ${rovers
                        .map(
                          (rover) =>
                            `<li class="nav-item"><a class="nav-link" href="#" onClick="handleClick(event)">${rover}</a></li>`
                        )
                        .join("")}
                  </ul>
              `;
  }
};

// Function to handle click event
function handleClick(event) {
  event.preventDefault();
  const rover = event.target.textContent;
  // console.log(`Tab clicked: ${rover}`);
  // const roverInfo = document.getElementById("rover-info");
  // roverInfo.innerHTML = `<h3>${rover}</h3>`;
  updateStore(store, { selectedRover: rover, roverInfo: {}, roverPhotos: [] });
  // Add your custom logic here
}

// Function to initialize event listeners for tabs
function initializeTabEvents() {
  const tabs = document.querySelectorAll(".nav-item .nav-link");
  tabs.forEach((tab) => {
    tab.addEventListener("click", handleClick);
  });
}

// Call the function to initialize event listeners after the DOM is fully loaded
root.addEventListener("DOMContentLoaded", initializeTabEvents);

// const handleClick = (rover) => {
//   console.log("rover", rover);
//   updateStore(store, { selectedRover: rover });
//   console.log("store.selectedRover", store.selectedRover);
//   return;
// };

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  // console.log(photodate.getDate(), today.getDate());

  // console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

const RoverInfo = (rover, roverInfo) => {
  if (roverInfo && roverInfo.rover) {
    // console.log("roverInfo", roverInfo);
    return `<div id="rover-info">
            <h2>Rover ${roverInfo.rover.rover.name} Info</h2>
            <h3>Launch Date: ${roverInfo.rover.rover.launch_date}</h3>
            <h3>Landing Date: ${roverInfo.rover.rover.landing_date}</h3>
            <h3>Status: ${roverInfo.rover.rover.status}</h3>
            <h3>Most recently available photos: ${roverInfo.rover.rover.total_photos}</h3>
            <h3>Date the most recent photos were taken: ${roverInfo.rover.rover.max_date}</h3>
            </div>
        `;
  } else {
    if (rover) {
      getRoverInfo(store);
    }
  }
  return `
  <h4>Select a Rover to view its details</h4>
`;
};

const ShowRoverPhotos = (rover, roverPhotos) => {
  if (roverPhotos && roverPhotos.photos) {
    // console.log("roverPhotos", roverPhotos);
    return `
        <h3>Photos from ${rover}</h3>
        <div  id="listedPhotos" class="container-fluid">
          <div class="row">
              ${roverPhotos.photos
                .map(
                  (photo, arr) => {
                    if (arr.length == 0) {
                      return `<div class="column"><h3>No photos available</h3></div>`;
                    }
                    return `<div class="column"><img src="${photo}"/></div>`;
                  }
                  // ) => `  <div class="column" style="background-color:#aaa;">
                  //       <h2>Column 1</h2>
                  //       <p>Some text..</p>
                  //     </div>`
                )
                .join("")}
          </div>
        </div>

        `;
  } else {
    if (rover) {
      getRoverPhotos(store);
    }
  }
  return `
        <h4>Select a Rover to view its images</h4>
    `;
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  return;
};

//function to get the rovers data from the backend
const getRovers = (state) => {
  let { rovers } = state;

  fetch(`http://localhost:3000/rovers`)
    .then((res) => res.json())
    .then((rovers) => updateStore(store, { rovers }));

  return;
};

//function to get the rovers data from the backend
const getRoverInfo = (state) => {
  let { selectedRover } = state;

  fetch(`http://localhost:3000/rover/${selectedRover}`)
    .then((res) => res.json())
    .then((roverInfo) => updateStore(store, { roverInfo }));

  return;
};

//function to get the rovers data from the backend
const getRoverPhotos = (state) => {
  let { selectedRover, roverPhotos, roverInfo } = state;
  if (roverInfo && roverInfo.rover) {
    fetch(
      `http://localhost:3000/rover/photos/${selectedRover}/${roverInfo.rover.rover.max_date}`
    )
      .then((res) => res.json())
      .then((roverPhotos) => updateStore(store, { roverPhotos }));
  } else {
    getRoverInfo(store);
  }
  return;
};
