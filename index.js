const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events `;

const state = {
  parties: [],
  //   inputs: { invalid: [], valid: [], neutral: [] },
  inputs: {},
};

const inputState = Object.freeze({ NEUTRAL: 0, VALID: 1, INVALID: 2 });
const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);
addPartyForm.addEventListener("input", updateFormInput);

// const inputs = addPartyForm.querySelectorAll("input")
// inputs.forEach((input) => {input.addEventListener("input", function (event){validateInput(event.target.value,event.target.type)});})

async function render() {
  await getParties();
  renderParties();
  renderInputs();
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
  } catch (error) {
    console.error("%c" + error, "color:red");
  }
}

function renderParties() {
  // TODO
  if (!state.parties.length) {
    partiesList.innerHTML =
      /*html*/
      `<li>No Parties Found</li>`;
    return;
  }
  console.log("parties found");
  console.log(state.parties);
  const partiesUI = state.parties.map((party) => {
    const ui = document.createElement("li");
    ui.innerHTML = /*html*/ `
    <h2>${party.name}</h2>
    <h3>${party.date}</h2>
    <h3>${party.location}</h2>
    <p>${party.description}</p>`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    ui.append(deleteButton);
    deleteButton.addEventListener("click", () => deleteParty);
    return ui;
  });
  // id description imageUrl
  partiesList.replaceChildren(...partiesUI);
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
  //    Time: ${time}
  console.log(
    `Name: ${name} Location: ${location} Date: ${date} Desc: ${description}`
  );
//   if (
//     name === "" ||
//     location === "" ||
//     description === "" ||
//     isNaN(date) === false
//   ) {
//     console.log("ERROR");
//     return;
//   }

// Check if inputs are valid before going through with post
let errorMsg = '';
const inputs = [event.target[0],event.target[1],event.target[2],event.target[3]]
for (i in inputs){
    if (validateInput(inputs[i].value,inputs[i].type) === false){
        errorMsg += ","+inputs[i].name
    }
}
// Error message will only not be blank if an input was found invalid, so after printing the error message, return, thus aborting the function
if (errorMsg != '')
{
    console.error("These inputs are invalid, aborting addToParty: "+errorMsg.substring(1))
    return
}
  // check if only numbers

  console.log(name);
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
  } catch (error) {
    console.error("%c" + error, "color:red");
  }
}
function deleteParty() {
  console.log("DELETE PARTY PRESSED");
}
function updateFormInput(event) {
  console.log(event.target);
  console.log(event.target.type);
  console.log(event.target.id + "is ID")
  const isValid = validateInput(event.target.value, event.target.type);
//   let addToKey = "";
//   let removeFromKey = "";
  if (isValid) {
    state.inputs[event.target.id] = inputState.VALID;
  } else {
    state.inputs[event.target.id] = inputState.INVALID;
  }
  // get which key to move from
  //   if (isValid) {
  //     addToKey = "valid";
  //     removeFromKey = "invalid";
  //   } else {
  //     addToKey = "invalid";
  //     removeFromKey = "valid";
  //   }
  //   // handle moving inputs
  //   if (state.inputs[addToKey].findIndex(event.target.id) === -1) {
  //     state.inputs[addToKey].push(event.target.id);
  //   }
  //   const removeIdx = state.inputs[removeFromKey].findIndex(event.target.id);
  //   if (removeIdx !== -1) {
  //     state.inputs[removeFromKey].splice(removeIdx,1);
  //   }
  render();
}
function validateInput(value, type) {
  // console.log(event.target)
  // console.log(event.target.type)
  // event.target.type === "date"
  // console.log(
  //   `Name: ${name} Location: ${location} Date: ${date} Desc: ${description}`
  // );
  let isValid = true;
  if (type === "submit"){return true}
  if (type === "date") {
    if (isNaN(new Date(value)) === true) {
      isValid = false;
    }
  } else {
    if (value.trim() === "") {
      isValid = false;
    }
  }
  return isValid;
}
function updateInputClasses(target, state) {
  console.log(`Updating input state for ${target} to ${state}`)
  console.log(state)
  if (state == inputState.VALID) {
    console.log("VALID")
    target.classList.add("valid");
    target.classList.remove("invalid");
    target.classList.remove("neutral");
  } else if (state == inputState.INVALID) {
    target.classList.add("invalid");
    target.classList.remove("valid");
    target.classList.remove("neutral");
    console.log("INVALID")
  } else if (state == inputState.NEUTRAL) {
    target.classList.remove("invalid");
    target.classList.remove("valid");
    target.classList.add("neutral");
    console.log("Neutral")
  }
}
function renderInputs() {
    console.table(state.inputs)
  const keys = Object.keys(state.inputs);
  for (i in keys) {
    updateInputClasses(addPartyForm.querySelector("#"+keys[i]),state.inputs[keys[i]]);
  }
}
// if (
//     name === "" ||
//     location === "" ||
//     description === "" ||
//     isNaN(date) === false
//   )
//   {
//     console.log("ERROR");
//     return;
//   }
