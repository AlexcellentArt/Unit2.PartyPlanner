const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
  inputs: {},
};

const inputState = Object.freeze({ NEUTRAL: 0, VALID: 1, INVALID: 2 });
const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);
addPartyForm.addEventListener("input", updateFormInput);

async function render() {
  await getParties();
  renderParties();
  renderInputs();
}
render();

async function getParties() {
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
  if (!state.parties.length) {
    partiesList.innerHTML =
      /*html*/
      `<li>No Parties Found</li>`;
    return;
  }
  console.log("parties found");
  console.log(state.parties);
  const partiesUI = state.parties.map((party) => {
    //make and fill out ui
    const ui = document.createElement("li");
    ui.innerHTML = /*html*/ `
    <h2>${party.name}</h2>
    <h3>${party.date}</h2>
    <h3>${party.location}</h2>
    <p>${party.description}</p>`;

    // make delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    ui.append(deleteButton);
    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return ui;
  });
  partiesList.replaceChildren(...partiesUI);
}

async function addParty(event) {
  event.preventDefault();
  const name = event.target[0].value;
  const location = event.target[1].value;
  const date = new Date(event.target[2].value);
  const description = event.target[3].value;
  console.log(
    `Name: ${name} Location: ${location} Date: ${date} Desc: ${description}`
  );

  // Check if inputs are valid before going through with post
  let errorMsg = "";
  const inputs = [
    event.target[0],
    event.target[1],
    event.target[2],
    event.target[3],
  ];
  for (i in inputs) {
    if (validateInput(inputs[i].value, inputs[i].type) === false) {
      errorMsg += "," + inputs[i].name;
    }
  }
  // Error message will only not be blank if an input was found invalid, so after printing the error message, return, thus aborting the function
  if (errorMsg != "") {
    console.error(
      "These inputs are invalid, aborting addToParty: " + errorMsg.substring(1)
    );
    return;
  }

  console.log(name);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, description, location, name }),
    });
    const json = await response.json();
    console.log(json);

    //clean form
    for (i in inputs) {
      inputs[i].value = "";
    }
    // reset class to neutral state
    const keys = Object.keys(state.inputs);
    for (i in keys) {
      state.inputs[keys[i]] = inputState.NEUTRAL;
    }
  } catch (error) {
    console.error("%c" + error, "color:red");
  }
}
async function deleteParty(id) {
  console.log("DELETE PARTY PRESSED");
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    console.log(response.status);
    if (!response.ok) {
      throw new Error("Party couldn't be deleted!");
    }
  } catch (error) {
    console.error(error);
  }
}
function updateFormInput(event) {
  console.log(event.target);
  console.log(event.target.type);
  console.log(event.target.id + "is ID");
  const isValid = validateInput(event.target.value, event.target.type);
  if (isValid) {
    state.inputs[event.target.id] = inputState.VALID;
  } else {
    state.inputs[event.target.id] = inputState.INVALID;
  }
  render();
}
function validateInput(value, type) {
  let isValid = true;
  if (type === "submit") {
    return true;
  }
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
  console.log(`Updating input state for ${target} to ${state}`);
  console.log(state);
  if (state == inputState.VALID) {
    console.log("VALID");
    target.classList.add("valid");
    target.classList.remove("invalid");
    target.classList.remove("neutral");
  } else if (state == inputState.INVALID) {
    target.classList.add("invalid");
    target.classList.remove("valid");
    target.classList.remove("neutral");
    console.log("INVALID");
  } else if (state == inputState.NEUTRAL) {
    target.classList.remove("invalid");
    target.classList.remove("valid");
    target.classList.add("neutral");
    console.log("Neutral");
  }
}
function renderInputs() {
  console.table(state.inputs);
  const keys = Object.keys(state.inputs);
  for (i in keys) {
    updateInputClasses(
      addPartyForm.querySelector("#" + keys[i]),
      state.inputs[keys[i]]
    );
  }
}
