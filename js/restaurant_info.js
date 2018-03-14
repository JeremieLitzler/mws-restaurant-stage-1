let restaurant;
var map;
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) {
            // Got an error!
            console.error(error);
        } else {
            self.map = new google.maps.Map(document.getElementById("map"), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });
};
/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = callback => {
    if (self.restaurant) {
        // restaurant already fetched!
        callback(null, self.restaurant);
        return;
    }
    const id = getParameterByName("id");
    if (!id) {
        // no id found in URL
        error = "No restaurant id in URL";
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant);
        });
    }
};
/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById("restaurant-name");
    name.innerHTML = restaurant.name;
    const address = document.getElementById("restaurant-address");
    address.innerHTML = `<i>Restaurant address:</i><p>${restaurant.address}</p>`;
    const image = document.getElementById("restaurant-img");
    image.className = "restaurant-img";
    image.alt = `Sneak peek inside the restaurant ${restaurant.name}`;
    image.src = DBHelper.imageUrlForRestaurant(restaurant, 128);
    image.srcset = buildSrcSet(restaurant);
    const cuisine = document.getElementById("restaurant-cuisine");
    cuisine.innerHTML = `<i>Cuisine type:</i> ${restaurant.cuisine_type}`;
    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
};
/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById("restaurant-hours-table");
    for (let key in operatingHours) {
        const row = document.createElement("tr");
        const day = document.createElement("td");
        day.innerHTML = `${key}: `;
        row.appendChild(day);
        const time = document.createElement("td");
        time.innerHTML = operatingHours[key];
        row.appendChild(time);
        hours.appendChild(row);
    }
};
/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById("reviews-container");
    const title = document.createElement("h2");
    title.innerHTML = "Reviews";
    container.appendChild(title);
    if (!reviews) {
        const noReviews = document.createElement("p");
        noReviews.innerHTML = "No reviews yet!";
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById("reviews-list");
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
};
/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = review => {
    const li = document.createElement("li");
    const date = document.createElement("p");
    date.className = "review-date";
    date.innerHTML = `Published: ${review.date}`;
    li.appendChild(date);
    const name = document.createElement("h3");
    name.className = "review-author";
    name.tabIndex = "0"; //To help go through the review list using the keyboard.
    name.innerHTML = `Review of ${review.name}`;
    li.appendChild(name);
    const rating = document.createElement("p");
    rating.className = "review-rating";
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);
    const comments = document.createElement("p");
    comments.className = "review-comments";
    comments.innerHTML = review.comments;
    li.appendChild(comments);
    return li;
};
/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById("breadcrumb");
    const li = document.createElement("li");
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(addHomeLink());
    breadcrumb.appendChild(li);
};
/**
 *
 */
function addHomeLink() {
    const homeLi = document.createElement("li");
    homeLi.innerHTML = `<li><a title="Navigate to the Home page" href="${appAlias}">Home</a></li>`;
    return homeLi;
}
/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
/**
 * Build the string value of the srcset attribute of an image element.
 * @param {restaurant} restaurant
 */
function buildSrcSet(restaurant) {
    const img360w = DBHelper.imageUrlForRestaurant(restaurant, 360);
    const img480w = DBHelper.imageUrlForRestaurant(restaurant, 480);
    const imgOriginalImproved = DBHelper.imageUrlForRestaurant(restaurant);
    const srcsetVal = `${img360w} 360w, ${img480w} 480w, ${imgOriginalImproved} 800w`;
    return srcsetVal;
}