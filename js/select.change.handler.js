let dropdownSelected;
let neighborhoodSelect = document.getElementById("neighborhoods-select");
let cuisineSelect = document.getElementById("cuisines-select");
if (neighborhoodSelect != null) {
    dropdownSelected = neighborhoodSelect;
    dropdownSelected.addEventListener("change", selectOptionTrap);
}
if (cuisineSelect != null) {
    dropdownSelected = cuisineSelect;
    dropdownSelected.addEventListener("change", selectOptionTrap);
}

function selectOptionTrap(event) {
    console.log("event", event);
    const applyFiltersBtn = document.querySelector(".js-apply-filters");
    applyFiltersBtn.addEventListener("click", applyFilters);
}

function applyFilters() {
    updateRestaurants();
    resetFocusToFiltersContainer();
}

function resetFocusToFiltersContainer() {
    const filtersContainer = document.getElementById("filters");
    filtersContainer.focus();
}