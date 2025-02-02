const storyNav = document.getElementById('storyNav');
const storyAdd = document.getElementById('storyAdd');
const storyList = document.getElementById('storyList');
const showForm = document.getElementById('showForm');
const storyForm = document.getElementById('storyForm');
const inputImg = document.getElementById('inputImg');
const imageDiv = document.getElementById('imageDiv');
const toast = document.getElementById('toast');
const toastAnime = document.getElementById('toastAnime');
const closeForm = document.getElementById('closeForm');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const deleteImage = document.getElementById('deleteImage');

let imageIndex = 0;
let imageSlideshowInterval;
let imagesArray = [];

showForm.addEventListener('click', function () {
    storyForm.style.display = (storyForm.style.display === 'none' || storyForm.style.display === '') ? 'grid' : 'none';
});

if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
        const imageUrl = localStorage.getItem(`imageUrl${i}`);
        if (imageUrl) {
            imagesArray.push(imageUrl);
            
            const newStory = document.createElement('div');
            newStory.className = 'w-14 h-14 overflow-hidden rounded-full border border-gray-600 grid place-content-center cursor-pointer';
            const newImage = document.createElement('img');
            newImage.src = imageUrl;
            newImage.className = 'w-full h-full object-cover rounded-full';
            
            newStory.appendChild(newImage);
            newStory.id = `newStory${i}`;
            
            newStory.addEventListener('click', function () {
                imageIndex = imagesArray.indexOf(imageUrl);
                modalImage.src = imageUrl;
                imageModal.style.display = 'flex';
                startImageSlideshow();
            });
            
            storyList.appendChild(newStory);
        }
    }
}

function startImageSlideshow() {
    clearInterval(imageSlideshowInterval);
    imageSlideshowInterval = setInterval(() => {
        imageIndex = (imageIndex + 1) % imagesArray.length;
        modalImage.src = imagesArray[imageIndex];
    }, 3000);
}

inputImg.addEventListener('change', function () {
    const file = inputImg.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            imageDiv.innerHTML = '';
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'w-full h-full object-cover rounded-full';
            imageDiv.appendChild(img);
            
            storyAdd.addEventListener('click', function () {
                const newIndex = storyList.children.length;
                localStorage.setItem(`imageUrl${newIndex}`, event.target.result);
                window.location.reload();
            });
        };
        reader.readAsDataURL(file);
    } else {
        imageDiv.innerHTML = 'No image selected';
    }
});

closeForm.addEventListener('click', function () {
    storyForm.style.display = 'none';
});

closeModal.addEventListener('click', function () {
    imageModal.style.display = 'none';
    clearInterval(imageSlideshowInterval);
});

deleteImage.addEventListener('click', function () {
    const imageUrl = modalImage.src;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(`imageUrl${i}`) === imageUrl) {
            localStorage.removeItem(`imageUrl${i}`);
            window.location.reload();
        }
    }
});
