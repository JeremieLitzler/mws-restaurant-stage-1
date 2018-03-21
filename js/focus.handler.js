//Store the element focused before opening the modal.
//When the modal is closed, the focus will be restored to that element.
let focusedElementBeforeModal;
let openModalBtnTriggered;
let openSearchModalBtn = document.querySelector(".open-search-modal");
let openHoursModalBtn = document.querySelector(".open-hours-modal");
let openReviewsModalBtn = document.querySelector(".open-reviews-modal");
if (openSearchModalBtn != null) {
    openSearchModalBtn.addEventListener("click", function() {
        openModalBtnTriggered = openSearchModalBtn;
        openModal();
    });
}
if (openHoursModalBtn != null) {
    openHoursModalBtn.addEventListener("click", function() {
        openModalBtnTriggered = openHoursModalBtn;
        openModal();
    });
}
if (openReviewsModalBtn != null) {
    openReviewsModalBtn.addEventListener("click", function() {
        openModalBtnTriggered = openReviewsModalBtn;
        openModal();
    });
}

function openModal() {
    const targetModal = findTargetModal(openModalBtnTriggered);
    //Save the current active element.
    focusedElementBeforeModal = document.activeElement;
    //Listen for and trap the keyboard
    targetModal.addEventListener("keydown", trapTabKey);
    //Close button handler
    const closeModalBtn = targetModal.querySelector(".js-close-modal");
    closeModalBtn.addEventListener("click", function() {
        closeModal(targetModal);
    });
    //Find all focusable children that we can find in the modal.
    const focusableElementsString =
        `a[href], area[href],
  input:not([disabled]), select:not([disabled]),
  textarea:not([disabled]), button:not([disabled]), iframe,
  object, embed, [tabindex="0"], [contenteditable]`;
    let focusableElements = targetModal.querySelectorAll(focusableElementsString);
    //Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements);
    //Get the first item in the modal's focusable elements that we will use as sentinals
    //to restart the focus loop
    const firstTabStop = focusableElements[0];
    //... and the last one.
    const lastTabStop = focusableElements[focusableElements.length - 1];
    //Show the modal
    targetModal.style.display = "block";
    firstTabStop.focus();

    function trapTabKey(event) {
        //Check for TAB key press
        if (event.keyCode === 9) {
            if (handleShitfTab(event)) {
                return;
            }
            if (document.activeElement == lastTabStop) {
                event.preventDefault();
                firstTabStop.focus();
            }
        }
        if (event.keyCode === 27) {
            closeModal(targetModal);
        }
    }

    function handleShitfTab(event) {
        if (event.shiftKey && document.activeElement === firstTabStop) {
            event.preventDefault();
            lastTabStop.focus();
            return true;
        }
        return false;
    }
}

function findTargetModal(clickedBtn) {
    const openModalBtnClassesArray = Array.prototype.slice.call(clickedBtn.classList);
    const targetModalClass = openModalBtnClassesArray[openModalBtnClassesArray.length - 1];
    const availableModals = document.querySelectorAll(".c-modal");
    //console.log("availableModals", availableModals);
    let targetModal;
    for (const modal of availableModals) {
        const modalClassArray = Array.prototype.slice.call(modal.classList);
        if (modalClassArray.includes(targetModalClass)) {
            //console.log("found target", targetModal);
            return modal;
        }
    }
    throw "Modal wasn't found!";
}

function closeModal(targetModal) {
    targetModal.style.display = "none";
    //Restore focus to the element that was focused before opening the modal.
    focusedElementBeforeModal.focus();
}