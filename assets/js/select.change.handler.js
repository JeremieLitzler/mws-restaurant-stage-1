let dropdownSelected;
let neighborhoodSelect = document.getElementById("neighborhoods-select");
let cuisineSelect = document.getElementById("cuisines-select");
const applyFiltersBtn = document.querySelector(".js-apply-filters");
applyFiltersBtn.addEventListener("click", applyFilters);

function applyFilters() {
    updateRestaurants();
    resetFocusToFiltersContainer();
}

function resetFocusToFiltersContainer() {
    const filtersContainer = document.getElementById("filters");
    filtersContainer.focus();
}