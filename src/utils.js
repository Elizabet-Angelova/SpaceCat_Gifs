import { apiKey } from "./navigation.js"
import { handleError } from "./views.js"

export const detailsFunction = (holder, el) => {
    let date = el.import_datetime.split(" ")[0].split("-").join(".")
    const iconDetails = document.createElement("div")
    iconDetails.innerHTML = "<i class=\"fas fa-ellipsis-v\"></i>"
    iconDetails.classList.add("iconDetails")

    const iconHeart = document.createElement("div")
    iconHeart.innerHTML = "<i class=\"fas fa-heart\"></i>"
    iconHeart.classList.add("iconHeart")

    let details = document.createElement("div")
    details.innerHTML = `${el.title} <br/><br/> 🞂 Rating: ${el.rating} <br/> 🞂 ${date} `
    details.classList.add("detailsText")
    holder.appendChild(iconDetails)
    holder.appendChild(iconHeart)
    holder.appendChild(details)

    iconDetails.addEventListener("click", () => {
        if (holder.firstChild.style.opacity === "0.3") {
            holder.firstChild.style.opacity = "1"
            details.style.opacity = "0"
        } else {
            holder.firstChild.style.opacity = "0.3"
            details.style.opacity = "1"
        }
    })

    iconHeart.addEventListener("click", () => {
        let check = localStorage.getItem("url")
        if (check !== null){
        if (check.includes(el.id)) {
            iconHeart.style.transition = "font-size 0.3s ease-in-out"
            iconHeart.style.fontSize = "3rem"
            setTimeout(() => {
                iconHeart.style.fontSize = "1.5rem"
            }, 300)
            let arr = JSON.parse(localStorage.getItem("url"));
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === el.id) {
                    arr.splice(i, 1)
                    break
                }
            }
            localStorage.setItem("url", JSON.stringify(arr))
            $("#favoritesContainer").empty()
            populateFavorites()
        } else {
            iconHeart.style.transition = "font-size 0.3s ease-in-out"
            iconHeart.style.fontSize = "3rem"
            setTimeout(() => {
                iconHeart.style.fontSize = "1.5rem"
            }, 300)
            storeFavorite(el)
        }
    } else {
        fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`)
        .then(res => res.json())
        .then((res) => {
        storeFavorite(res.data[0]) 
    })
       .catch(handleError)
   
}
        
    })

    holder.addEventListener("mouseover", () => {
        iconDetails.style.opacity = "1"
        iconHeart.style.opacity = "1"

    })
    holder.addEventListener("mouseout", () => {
        iconDetails.style.opacity = "0"
        iconHeart.style.opacity = "0"

    })
    return holder
}

let database = [];
export const storeTaskInLocalStorage = (data) => {
    let arr;
    if (localStorage.getItem("tasks") === null) {
        arr = [];
    } else {
        arr = JSON.parse(localStorage.getItem("tasks"));
    }
    
    arr.push(data);
    localStorage.setItem("tasks", JSON.stringify(arr));
    database = arr.slice();

    $("#uploadedGifs").empty()
    populateUploaded()
}

const storeFavorite = (data) => {
    let arr;
    if (localStorage.getItem("url") === null) {
        arr = [];
    } else {
        arr = JSON.parse(localStorage.getItem("url"));
    }
        arr.push(data);
        localStorage.setItem("url", JSON.stringify(arr));
        $("#favoritesContainer").empty()
        populateFavorites()
    }



export const populateUploaded = () => {
    let arr = JSON.parse(localStorage.getItem("tasks"))
    arr.reverse().forEach((el) => {
        let gif = document.createElement("img")
        gif.src = `https://media.giphy.com/media/${el}/giphy.gif`
        gif.style.height = "200px"
        $("#uploadedGifs").append(gif)
    })
}

export const populateFavorites = () => {
    let arr = JSON.parse(localStorage.getItem("url"))
    if (arr === null || arr.length === 0) {
        fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`)
        .then(res => res.json())
        .then((res) => {
        let randomSrc = `https://media.giphy.com/media/${res.data.id}/giphy.gif`
        let imgRandom = document.getElementsByClassName('givFav')[0]
        imgRandom.setAttribute('src', randomSrc)
        })
        .catch(handleError)
    } else {
        let imgRandom = document.getElementsByClassName("givFav")[0]
        imgRandom.setAttribute("src", `https://media.giphy.com/media/${arr[arr.length-1].id}/giphy.gif`)
        // imgRandom.style.borderRadius = "55px"
    }

    arr.reverse()
    for (let el of arr) {
        let imgHolder = document.createElement("div")
        imgHolder.classList.add("imgHolder")
        let gif = document.createElement("img")
        gif.src = `https://media.giphy.com/media/${el.id}/giphy.gif`
        gif.style.height = `${Number(el.images.fixed_height_downsampled.height)}px`

        if (Number(el.images.fixed_height_downsampled.width) - Number(el.images.fixed_height_downsampled.height) > 100) {
            imgHolder.style.gridColumn = "span 2"
        }
        imgHolder.appendChild(gif)
        imgHolder = detailsFunction(imgHolder, el)

        $("#favoritesContainer").append(imgHolder)
    }
}