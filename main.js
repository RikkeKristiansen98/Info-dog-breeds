const apiUrl = 'https://api.thedogapi.com/v1/';
const apiKey = 'live_eCmovF2psPcaPUdSlm1v0sBFrgq3YYfZ4OlXVnHJqbO9WszV2JwQsqHLTtRXZRAD';
const breedDropdown = document.getElementById('breeds');
const dogImg = document.getElementById('dogImage');
const breedInfo = document.getElementById('breedInfo');

// Hämtar listan över hundraser och fyller dropdown meny
async function fetchBreeds() {
    try {
        const url = `${apiUrl}breeds?api_key=${apiKey}`;
        const response = await fetch(url);
        const breeds = await response.json();

        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.text = breed.name;
            option.dataset.breedId = breed.id;
            breedDropdown.appendChild(option);
        });
// kallar på funktionen som ger information om hundras när använder väljer ras, samt visar eventuell felmeddelande.
        breedDropdown.addEventListener('change', fetchBreedInfo);
    } catch (error) {
        console.error('Error fetching dog breeds.', error);
        alert('Error fetching dog breeds. Please try again later.');
    }
}

// funktionen som hanterar information och bild, lägger till info i html div 'breedInfo', eventuellt visar felmeddelande
async function fetchBreedInfo() {
    const { breedId } = breedDropdown.options[breedDropdown.selectedIndex].dataset;

    try {
        const breedInfoUrl = `${apiUrl}breeds/${breedId}?api_key=${apiKey}`;
        const breedInfoResponse = await fetch(breedInfoUrl);
        const breed = await breedInfoResponse.json();

        const breedImageId = breed.reference_image_id;
        const breedImageUrl = `${apiUrl}images/${breedImageId}?api_key=${apiKey}`;
        const breedImageResponse = await fetch(breedImageUrl);
        const breedImage = await breedImageResponse.json();

        if (breedImage && breedImage.url) {
            dogImg.style.width = '400px';
            dogImg.src = breedImage.url;
        } else {
            breedInfo.innerHTML = "Can't find photo";
        }

        breedInfo.innerHTML = `
            <p><strong>Name of breed:</strong> ${breed.name}</p>
            <p><strong>Height:</strong> ${breed.height.imperial} inches</p>
            <p><strong>Weight:</strong> ${breed.weight.imperial} pounds</p>
            <p><strong>Life span:</strong> ${breed.life_span}</p>
            <p><strong>Bred for:</strong> ${breed.bred_for}</p>
            <p><strong>Temperament:</strong> ${breed.temperament}</p>
        `;

        breedInfo.style.textAlign = "center";

    } catch (error) {
        console.error('Error fetching dog breed information:', error);
        alert('Error fetching information about the dog breed. Please try another breed or try agian later');
    }
}

// Hämtar hundbilder från APIet och visar, tar sen bort så att bara 1 bild visas om använderen trycker på knappen igen. 
// visar eventuellt felmeddelande.
async function fetchRandomDogImages() {
    try {
        const url = `${apiUrl}images/search?api_key=${apiKey}`;
        const response = await fetch(url);
        const images = await response.json();

        if (images && images.length > 0) {
            const imageSlider = document.getElementById('imageSlider');

            imageSlider.innerHTML = '';

            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imageSlider.appendChild(imgElement);
            });
            
        } else {
            console.log('Dog images are not available.');
            alert('Could not get dog photos, please try again later.');
        }
    } catch (error) {
        console.error('Error fetching dog images:', error);
    }
}

document.getElementById('loadImgBtn').addEventListener('click', fetchRandomDogImages);

document.addEventListener('DOMContentLoaded', function () {
    fetchBreeds();
});
