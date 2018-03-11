let dropdownSelected;
let neighborhoodSelect = document.getElementById("neighborhoods-select");
let cuisineSelect = document.getElementById("cuisines-select");
if (neighborhoodSelect != null) {
    dropdownSelected = neighborhoodSelect;
    dropdownSelected.addEventListener("change", function() {
        updateRestaurants();
        resetFocusToFiltersContainer();
    });
}
if (cuisineSelect != null) {
    dropdownSelected = cuisineSelect;
    dropdownSelected.addEventListener("change", function() {
        updateRestaurants();
        resetFocusToFiltersContainer();
    });
}

function resetFocusToFiltersContainer() {
    const filtersContainer = document.getElementById("filters");
    filtersContainer.focus();
}