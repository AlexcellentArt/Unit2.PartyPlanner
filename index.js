const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events `;

const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  // TODO
  try {
    const response = await fetch(API_URL);
    console.log(response);
    const json = await response.json();
    console.log(json.data);
    state.parties = json.data;
  }
  catch (error){
    console.error("%c"+error,"color:red")
  }
}

function renderParties() {
  // TODO
  if (!state.parties.length){
    partiesList.innerHTML =
    /*html*/
    `<li>No Parties Found</li>`;
    return;
  }
  console.log("parties found")
  console.log(state.parties)
  const partiesUI = state.parties.map((party)=>{
    const ui  = document.createElement("li");
    ui.innerHTML = /*html*/ `
    <h2>${party.name}</h2>
    <h3>${party.date}</h2>
    <h3>${party.location}</h2>
    <p>${party.description}</p>`
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    ui.append(deleteButton);
    deleteButton.addEventListener("click",()=> deleteParty)
    return ui
  })
  // id description imageUrl
  partiesList.replaceChildren(...partiesUI)
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();
  const name = event.target[0].value;
  const location = event.target[1].value;
//   const time = event.target[2].value;
  const date = new Date(event.target[2].value);
  const description = event.target[3].value;
  console.log(`Name: ${name} Location: ${location} Time: ${time} Date: ${date} Desc: ${description} Url: ${url}`)
  console.log(name)
  // TODO
  try {
    const response = await fetch(API_URL,{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body:JSON.stringify({date,description,location,name,}),
      //names, dates, times, locations, and descriptions
    });
    const json = await response.json()
    console.log(json)
  }
  catch (error){
    console.error("%c"+error,"color:red")
  }
}
function deleteParty(){
    console.log("DELETE PARTY PRESSED")
}
