let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverData: []
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    let { roverData } = state;

    root.innerHTML = App(state);

    RoverImages(roverData);
}

// create content
const App = (state) => {
    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            

            <section id="roverData">
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

const RoverImages = roverData => {
    let roverArr = [];
    let main = document.getElementById("roverData");

    if (roverData.length < 3) {
        getRoverImages(store);

        main.appendChild(LoadingMessage());
    } else {
        for(let i = 0; i < roverData.length; i++) {
            const roverName = roverData[i].rover.name;
            const launchDate = roverData[i].rover.launch_date;
            const landingDate = roverData[i].rover.landing_date;
            const status = roverData[i].rover.status;
            const img_taken = roverData[i].earth_date;
            const img = roverData[i].img_src;

            roverArr.push(CreateRover(roverName, launchDate, landingDate, status, img_taken, img));
        }

        roverArr.forEach(el => main.appendChild(el));
    }

}

// Create Rover div with content
function CreateRover(roverName, launchDate, landingDate, status, img_taken, img) {
    let t;    // Global text node

    // Create parent div
    let parentDiv = document.createElement('div');

    // Add Rover name with h1 tags and append to parentDiv
    let h1 = document.createElement('h1');
    t = document.createTextNode(`Rover name: ${roverName}`);
    h1.appendChild(t);
    parentDiv.appendChild(h1);

    // Add launch date with p tags and append to parentDiv
    let p = document.createElement('p');
    t = document.createTextNode(`Launch Date: ${launchDate}`);
    p.appendChild(t);
    parentDiv.appendChild(p);

    // Add landing date with p tags and append to parentDiv
    let landingDateText = document.createElement('p');
    t = document.createTextNode(`Landing Date: ${landingDate}`);
    landingDateText.appendChild(t);
    parentDiv.appendChild(landingDateText);

    // Add status with h2 tags and append to parentDiv
    let h2 = document.createElement('h2');
    t = document.createTextNode(`Status: ${status}`);
    h2.appendChild(t);
    parentDiv.appendChild(h2);

    // Add image taken with p tags and append to parentDiv
    let imageTakenText = document.createElement('p');
    t = document.createTextNode(img_taken);
    imageTakenText.appendChild(t);
    parentDiv.appendChild(imageTakenText);

    // Add image
    let image = document.createElement('img');
    image.src = img;
    image.height = 100;
    image.width = 100;
    parentDiv.appendChild(image);

    return parentDiv;
}

function LoadingMessage() {
    let p = document.createElement('p');
    p.appendChild(document.createTextNode('Loading...'));

    return p;
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state;

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }));
}

const getRoverImages = state => {
    let { roverData } = state;

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(roverData => updateStore(store, { roverData }));
}