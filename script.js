//   https://free.ratesdb.com/v1/rates?from=EUR&to=GBP
//   https://flagsapi.com/US/flat/64.png

const base_url = "https://api.freecurrencyapi.com/v1/latest";
const api_key = "fca_live_cnTpq9O3HWrfRNAJvggfMpu8tZavmdpHWXPNb4r1";

let dropdowns = document.querySelectorAll(".country-list-access");
dropdowns.forEach(dropdown => {
    for (let c in country_list) {
        let newEle = document.createElement("option");
        newEle.value = country_list[c];
        newEle.innerText = country_list[c];
        if (dropdown.name === "from" && country_list[c] === "USD") {
            newEle.selected = "selected";
        }
        else if (dropdown.name === "to" && country_list[c] === "INR") {
            newEle.selected = "selected";
        }
        dropdown.append(newEle);
    }

    dropdown.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
});

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = Object.keys(country_list).find(key => country_list[key] === currCode);
    let flagURL = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let p = element.parentNode.parentNode;
    let image = p.querySelector("img");
    image.src = flagURL;
}

const swapBtn = document.querySelector("#swap-btn");
swapBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    let all_country_list_class = document.querySelectorAll(".country-list-access");
    let fromCurr = all_country_list_class[0].value;
    let toCurr = all_country_list_class[1].value;

    // swapping the values
    let temp = fromCurr;
    all_country_list_class[0].value = toCurr;
    all_country_list_class[1].value = temp;

    //updating the flags
    updateFlag(all_country_list_class[0]);
    updateFlag(all_country_list_class[1]);
})


const amountButton = document.querySelector("#btn");
amountButton.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amt = document.querySelector("#input_value");
    let amtVal = amt.value;
    if (amtVal === "" || amtVal < 1) {
        amt.value = 1;
        amt.innerText = 1;
    }

    let all_country_list_class = document.querySelectorAll(".country-list-access");
    let fromCurr = all_country_list_class[0].value;
    let toCurr = all_country_list_class[1].value;

    let rate_value = await convertCurrency(fromCurr, toCurr);
    if (rate_value) {
        let totalAmt = (rate_value * amtVal).toFixed(2);
        console.log("total:", totalAmt);
        document.querySelector("#message-box").innerText = `1 ${fromCurr} = ${rate_value.toFixed(4)} ${toCurr}`;
        document.querySelector("#result-value").innerText = `${totalAmt} ${toCurr}`;
    }

})

async function convertCurrency(fromCurr, toCurr) {
    try {
        // Fetch the latest rates with the base currency
        let response = await fetch(`${base_url}?apikey=${api_key}&base_currency=${fromCurr}`);
        let actual_data = await response.json();

        // Access the specific rate from the data object
        let rate_value = actual_data.data[toCurr];
        console.log("rate:", rate_value);
        return rate_value;
    }
    catch (error) {
        console.log("Error in fetching currency data: ", error);
    }

}
