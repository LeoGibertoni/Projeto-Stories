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
const storyCounter = document.getElementById('storyCounter'); // Criar <p id="storyCounter"></p> no HTML
const inputImage = document.getElementById("inputImage");
const progressBar = document.getElementById("progressBar");
const progressBarContainer = document.getElementById("progressBarContainer");
let imageSlideshowInterval;
let imagesArray = [];
let imageIndex = 0;

showForm.addEventListener('click', () => {
    storyForm.style.display = (storyForm.style.display === 'none' || storyForm.style.display === '') ? 'grid' : 'none';
});

function loadStories() {
    storyList.innerHTML = ''; // Evita duplicação
    imagesArray = [];

    for (let i = 0; i < localStorage.length; i++) {
        const imageUrl = localStorage.getItem(`imageUrl${i}`);
        if (imageUrl) {
            imagesArray.push(imageUrl);
        }
    }

    imagesArray.forEach((imageUrl, i) => {
        const newStory = document.createElement('div');
        newStory.className = 'w-14 h-14 overflow-hidden rounded-full border border-gray-600 grid place-content-center cursor-pointer';

        const newImage = document.createElement('img');
        newImage.src = imageUrl;
        newImage.className = 'w-full h-full object-cover rounded-full';

        newStory.appendChild(newImage);
        newStory.id = `newStory${i}`;

        newStory.addEventListener('click', () => {
            imageIndex = i;
            modalImage.src = imagesArray[imageIndex];
            imageModal.style.display = 'flex';
            progressBarContainer.style.display = 'block'; // Exibe a barra de progresso quando a imagem for aberta
            updateStoryCounter(); // Atualiza o contador
            updateProgressBar();
            startImageSlideshow();
        });

        storyList.appendChild(newStory);
    });

    updateStoryCounter(); // Atualiza o contador quando a página carrega
}

function startImageSlideshow() {
    clearInterval(imageSlideshowInterval);
    if (imagesArray.length === 0) return;

    imageSlideshowInterval = setInterval(() => {
        imageIndex = (imageIndex + 1) % imagesArray.length;
        modalImage.src = imagesArray[imageIndex];
        updateStoryCounter(); // Atualiza o contador quando troca de imagem
        updateProgressBar(); // Atualiza a barra de progresso
    }, 3000);
}

function updateStoryCounter() {
    if (storyCounter) {
        if (imagesArray.length > 0 && imageIndex >= 0) {
            storyCounter.innerText = `${imageIndex + 1}/${imagesArray.length}`;
        } else {
            storyCounter.innerText = '0/0';
        }
    }
}

function updateProgressBar() {
    const progress = ((imageIndex + 1) / imagesArray.length) * 100;
    progressBar.style.width = `${progress}%`;
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

            storyAdd.onclick = function () {
                const newIndex = imagesArray.length;
                localStorage.setItem(`imageUrl${newIndex}`, event.target.result);
                loadStories(); // Atualiza sem recarregar a página
                storyForm.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    } else {
        imageDiv.innerHTML = 'No image selected';
    }
});

closeForm.addEventListener('click', () => {
    storyForm.style.display = 'none';
});

closeModal.addEventListener('click', () => {
    imageModal.style.display = 'none';
    progressBarContainer.style.display = 'none'; // Esconde a barra de progresso
    clearInterval(imageSlideshowInterval);
});

deleteImage.addEventListener('click', () => {
    if (imagesArray.length === 0) return;

    const imageUrl = modalImage.src;
    let keyToRemove = null;

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(`imageUrl${i}`) === imageUrl) {
            keyToRemove = `imageUrl${i}`;
            break;
        }
    }

    if (keyToRemove) {
        localStorage.removeItem(keyToRemove);
        // Recarrega as imagens com o índice correto
        loadStories();
        imageModal.style.display = 'none';
        clearInterval(imageSlideshowInterval);
        progressBarContainer.style.display = 'none'; // Esconde a barra de progresso
    }
});

// Carrega os stories na inicialização
loadStories();