import { containerTrending, apiKey, containers, buttons, showCat } from "./navigation.js"
import { detailsFunction } from "./utils.js"

export const containerSearch = document.getElementById("containerSearch")
export const url = "https://api.giphy.com/v1/gifs/trending?api_key=rSd3cHCNr6UxIxDzSRKNeBNnkDqRRys0"
let offsetTrending = 25
let offsetSearch = 25
let fetchingTrending = false
let fetchingSearch = false

const handleSuccessSearch = (res) => {
    containerSearch.style.display = "grid"

    for (let j = 0; j < containers.length; j++) {
        if (containers[j].style.display !== "none") {
            containers[j].style.display = "none"
            buttons[j].classList.remove("purple")
        }
    }
    showCat()
    for (let el of res.data) {
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

        containerSearch.appendChild(imgHolder)
        offsetSearch += 25
        fetchingSearch = false
    }
}

const handleSuccessTrending = (res) => {
    containerTrending.style.display = "grid"
    for (let el of res.data) {
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

        containerTrending.appendChild(imgHolder)
        offsetTrending += 25
        fetchingTrending = false
    }
}

export const handleError = (error) => {
    alert(error.message)
}

export const functionTrending =  (button) => {
    button.addEventListener("click", async () => {
        $("#containerTrending").empty()
        await fetch(url)
            .then((res) => res.json())
            .then(handleSuccessTrending)
            .catch(handleError)

        $(window).on("scroll", () => {
            const scrollHeight = $(document).height();
            const scrollPos = $(window).height() + $(window).scrollTop();
            if (((scrollHeight - 600) >= scrollPos) / scrollHeight == 0 && !fetchingTrending && containerTrending.style.display !== "none") {
                fetchingTrending = true
                fetch(`${url}&offset=${offsetTrending}`)
                    .then((res) => res.json())
                    .then(handleSuccessTrending)
                    .catch(handleError)
            }
        });

    })
}

const searchInput = document.getElementById("inputSearch")

export const functionSearch = async () => {
    $("#containerSearch").empty()
    let searchTitle = searchInput.value
    await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTitle}`)
        .then((res) => res.json())
        .then(handleSuccessSearch)
        .catch(handleError)

    $(window).on("scroll", () => {
        const scrollHeight = $(document).height();
        const scrollPos = $(window).height() + $(window).scrollTop();
        if (((scrollHeight - 600) >= scrollPos) / scrollHeight === 0 && !fetchingSearch && containerSearch.style.display !== "none") {
            fetchingSearch = true
            searchTitle = searchInput.value
            fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTitle}&offset=${offsetSearch}`)
                .then((res) => res.json())
                .then(handleSuccessSearch)
                .catch(handleError)
        }
    });
}
