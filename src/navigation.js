/* eslint-disable no-loop-func */
import { functionTrending, functionSearch, containerSearch } from "./views.js"
import { storeTaskInLocalStorage, populateUploaded, populateFavorites } from "./utils.js"
// ------------------- BUTTONS ----------------------
const homeBtn = document.getElementById("homeBtn")
const trendingBtn = document.getElementById("trendingBtn")
const uploadBtn = document.getElementById("uploadBtn")
const mygifsBtn = document.getElementById("mygifsBtn")
const favoriteBtn = document.getElementById("favoriteBtn")
const searchIcon = document.getElementById("fas1")

// ------------------- CONTAINERS ----------------------
const titleWrapper = document.getElementById("titleWrapper")
export const containerTrending = document.getElementById("containerTrending")
const containerUpload = document.getElementById("containerUpload")
const containerMygifs = document.getElementById("containerMygifs")
const containerFavorite = document.getElementById("containerFavorite")

// ------------------- UPLOAD ELEMENTS ----------------------
let upload = document.getElementById("upload")
let isThereFile = document.getElementById("isThereAfile")
const gifPreview = document.getElementById("gifPreview")
const failed = document.getElementsByClassName("uploadFail")[0]
const uploading = document.getElementsByClassName("uploading")[0]
const success = document.getElementsByClassName("uploadSuccess")[0]
let fetchingUpload = false
let CurrId = ""
let input = document.getElementById("inputUpload")

const icon = document.getElementsByClassName("fas")[0]
export const apiKey = "rSd3cHCNr6UxIxDzSRKNeBNnkDqRRys0"

export const containers = [titleWrapper, containerTrending, containerUpload, containerMygifs, containerFavorite]
export const buttons = [homeBtn, trendingBtn, uploadBtn, mygifsBtn, favoriteBtn]

export const showCat = () => {
    homeBtn.innerHTML = ""
    icon.style.top = "48px"
    homeBtn.innerHTML = "<img src=\"./img/Untitled.png\" alt=\"SPACE CAT *.*\" class=\"rotate\" id=\"catIcon\" style=\"width: 70px;\">"
    homeBtn.addEventListener("click", () => {
        homeBtn.innerHTML = "HOME"
        icon.style.top = "25px"
    })
}

const navigate = () => {
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        button.addEventListener("click", () => {
            const container = containers[i]
            container.style.display = "block"
            button.classList.add("purple")
            if (i !== 0) {
                container.style.display = "grid"
                showCat()
            }
            for (let j = 0; j < containers.length; j++) {
                if (containers[j] !== container) {
                    containers[j].style.display = "none"
                    buttons[j].classList.remove("purple")
                }
                if (containerSearch.style.display !== "none") {
                    containerSearch.style.display = "none"
                }
            }
        })
    }
}
navigate()
try {
    populateFavorites()
} catch(err) {
    alert(error.message)
}

functionTrending(trendingBtn)
if(localStorage.getItem('tasks') !== null) {
    populateUploaded()
}

searchIcon.addEventListener("click", functionSearch)
$("#inputSearch").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#fas1").click();
    }
});

const twinkle = () => {
    const starts = document.getElementsByClassName("stars")[0]
    setInterval(function () {
        starts.style.opacity = "0.2"
    }, 1000)
    setInterval(function () {
        starts.style.opacity = "0.9"
    }, 2000)

}
twinkle()

const functionUpload = async (ev) => {
    uploading.style.display = "inline-block"
    fetchingUpload = true
    ev.preventDefault(ev);
    let myFile = input.files[0];
    let formData = new FormData();

    formData.append("file", myFile);

    const url = "https://upload.giphy.com/v1/gifs?api_key=rSd3cHCNr6UxIxDzSRKNeBNnkDqRRys0";
    try {
        await fetch(url, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((response) => {
                CurrId = response.data.id
                storeTaskInLocalStorage(response.data.id)
            });

        $("#inputUpload").val(null)

        uploading.style.display = "none"
        success.style.display = "inline"
        isThereFile.textContent = "No file chosen"
        fetchingUpload = false

        
        gifPreview.innerHTML = `<img src="https://media.giphy.com/media/${CurrId}/giphy.gif">`

        setTimeout(function () {
            success.style.display = "none"
        }, 5000)
    } catch (err) {
        failed.style.display = "inline"
        alert(err.message)
        setTimeout(function () {
            failed.style.display = "none"

        }, 5000)
    }
}

input.addEventListener("change", () => {
    if (input.value) {
        let myFile = document.getElementById("inputUpload").files[0]
        isThereFile.textContent = myFile.name
    }
})
upload.addEventListener("click", (ev) => {
    if (input.value && !fetchingUpload) {
        functionUpload(ev)
    }
})

