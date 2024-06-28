
const containerDiv=document.querySelector('container');
const searchForm=document.querySelector('form');
const searchResultsDiv=document.querySelector('searchResults');

// toggle-bar  
const toggleButton = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("sidebar");
const flexBox = document.getElementById('flex-box');
const searchbar = document.getElementById('search-bar');

// Define favorite list variable 
const dbObjectFavoriteList = "favoritesList";

// If the favorite list doesn't exist in the localStorage, initialize it as an empty array
if (localStorage.getItem(dbObjectFavoriteList) == null) {
    localStorage.setItem(dbObjectFavoriteList, JSON.stringify([]));
}

let strQuery='';
//fetch meal records from api
const fetchMealsRecord = async (url, value) => {
    const apiUrl=`${url}${value}`;
    const response = await fetch(apiUrl);
    const meals = await response.json();
    return meals;
}
// Update the task counter with the number of items in the favorite list
function updateTask() {
    const favCounter = document.getElementById('total-counter');
    const db = JSON.parse(localStorage.getItem(dbObjectFavoriteList));
    if (favCounter.innerText != null) {
        favCounter.innerText = db.length;
    }
}
// Generate a random single-character string
function generateOneCharString() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}
// Display a list of meals based on the search input value
async function showMealList(){
    let generatedHTML='';

    const list = JSON.parse(localStorage.getItem(dbObjectFavoriteList));
    const strQuery = document.getElementById("search-input").value;
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const results = await fetchMealsRecord(url, strQuery);

    
    results.meals.map((result)=>{
        generatedHTML+=`
        <div class="card">
        <div class="card-top"  onclick="showMealDetails(${result.idMeal}, '${strQuery}')">
            <div class="dish-photo" >
                <img src="${result.strMealThumb}" alt="">
            </div>
            <div class="dish-name">
                ${result.strMeal}
            </div>
            <div class="dish-details">
                ${truncate(result.strInstructions, 50)}
                
                <span class="button" onclick="showMealDetails(${result.idMeal}, '${strQuery}')">Read More</span>
             
            </div>
        </div>
        <div class="card-bottom">
            <div class="like">

            <i class="fa-solid fa-heart ${isFavoriteDish(list, result.idMeal) ? 'active' : ''} " onclick="addRemoveToFavList(${result.idMeal})"></i>
            
            </div>
            <div class="play">
                <a href="${result.strYoutube}">
                    <i class="fa-brands fa-youtube"></i>
                </a>
            </div>
        </div>
    </div>
        `
    });

    document.getElementById('cards-holder').innerHTML = generatedHTML;
}

// display meal details
async function showMealDetails(mealID,strQuery){
    const list=JSON.parse(localStorage.getItem(dbObjectFavoriteList));
    flexBox.scrollTo({top:0, behavior:"smooth"});
    const apiUrl="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    
    const mealList=await fetchMealsRecord(searchUrl,strQuery);
    const mealDetail=await fetchMealsRecord(apiUrl,mealID);

    let html='';
    if(mealDetail.meals){
        html=`
        <div class="container remove-top-margin">

            <div class="header hide">
                <div class="title">
                    Let's Eat Something New
                </div>
            </div>
            <div class="fixed" id="search-bar">
                <div class="icon">
                    <i class="fa-solid fa-search "></i>
                </div>
                <div class="new-search-input">
                    <form onkeyup="showMealList()">
                        <input id="search-input" type="text" placeholder="Search Your Fav Meal..." />
                    </form>
                </div>
            </div>
        </div>
        <div class="item-details">
        <div class="item-details-left">
        <img src="  ${mealDetail.meals[0].strMealThumb}" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Name: </strong>
            <span class="item-text">
            ${mealDetail.meals[0].strMeal}
            </span>
         </div>
        <div class="item-category">
            <strong>Category: </strong>
            <span class="item-text">
            ${mealDetail.meals[0].strCategory}
            </span>
        </div>
        <div class="item-ingredient">
            <strong>Ingredient: </strong>
            <span class="item-text">
            ${mealDetail.meals[0].strIngredient1},${mealDetail.meals[0].strIngredient2},
            ${mealDetail.meals[0].strIngredient3},${mealDetail.meals[0].strIngredient4}
            </span>
        </div>
        <div class="item-instruction">
            <strong>Instructions: </strong>
            <ul class="item-text">
            ${mealDetail.meals[0].strInstructions}
            </ul>
        </div>
        <div class="item-video">
            <strong>Video Link:</strong>
            <div id="watch-btn" class="item-text">
            <a href="${mealDetail.meals[0].strYoutube}">Watch Here</a>
            </div>
            <div id="like-button" onclick="addRemoveToFavList(${mealDetail.meals[0].idMeal})"> 
             ${isFav(list, mealDetail.meals[0].idMeal) ? 'Remove From Favorite' : 'Add To Favorite'} </div>
        </div>
    </div>
</div> 
        <div class="card-name">
        Related Items
    </div>
    <div id="cards-holder" class=" remove-top-margin ">`
    }

    if(mealList.meals != null){
        html+=mealList.meals.map(element => {
            return `       
            <div class="card">
                <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${strQuery}')">
                    <div class="dish-photo" >
                        <img src="${element.strMealThumb}" alt="">
                    </div>
                    <div class="dish-name">
                        ${element.strMeal}
                    </div>
                    <div class="dish-details">
                        ${truncate(element.strInstructions, 50)}
                        <span class="button" onclick="showMealDetails(${element.idMeal}, '${strQuery}')">Know More</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <div class="like">
                       
                        <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " 
                        onclick="addRemoveToFavList(${element.idMeal})"></i>
                    </div>
                    <div class="play">
                        <a href="${element.strYoutube}">
                            <i class="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
        `
        }).join('');
    }
    html = html + '</div>';

    document.getElementById('flex-box').innerHTML = html;
}

// Add or remove a meal from the favorite list
function addRemoveToFavList(id) {
    const detailsPageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(dbObjectFavoriteList));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;
        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);
    } else {
        db.push(id);
    }

    localStorage.setItem(dbObjectFavoriteList, JSON.stringify(db));
    if (detailsPageLikeBtn != null) {
        detailsPageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favorite' : 'Add To Favorite';
    }

    showMealList();
    showFavMealList();
    updateTask();
}


// check if meal is favorite
function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}

// display favorite meal details in sidebar
async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(dbObjectFavoriteList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Add Your Fav Meal Here</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsRecord(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item" onclick="showMealDetails(${element.idMeal},'${generateOneCharString()}')">

              
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong></strong>
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                    <i class="fa-regular fa-trash-can" style="color: #ed1e07;"></i>
                    </div>

                </div>

            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}

updateTask();
// event listener to the toggle button click event
toggleButton.addEventListener("click", function () {
    showFavMealList();
    sidebar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});

function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}
// check if dish is favorite
function isFavoriteDish(list,id){
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}