const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="hhhhh img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  tootleSpinner();
}

const getImages = (query, KEY) => {
  console.log(query);
  tootleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo`)   // there was problem
    .then(response => response.json())
    .then(data => {
      console.log("data: ", data);
      showImages(data.hits);    // hitS -> hits
    })
    .catch(err => {
      console.log(err);      // web-developer can understand what is the error
      errorMessage();
    })
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');   // if an item is selected, a border will arrive

  let item = sliders.indexOf(img);
  console.log("index of img: ", item);
  console.log("image: ", img);
  if (item === -1) {
    sliders.push(img);    // the selected item will be added at the end of the sliders array
    slideNumberChange("plus");
  } else {
    element.classList.remove('added');    // the border of the selected item will be removed

    sliders.splice(item, 1);      // the selected item will be removed from sliders array
    slideNumberChange("minus");
  }
  console.log("sliders: ", sliders)
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;   // default value is 1000 
  console.log("duration: ", duration);

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })

  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    console.log("inside timer duration: ", duration);
    changeSlide(slideIndex);
  }, duration);


}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

// if search button is clicked
const searchBtnClicked = () => {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value, KEY)
  sliders.length = 0;
}
// if someone press the key ENTER
document.getElementById("search").addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    searchBtnClicked();
  }
})

// if slider button is clicked
sliderBtn.addEventListener('click', function () {
  createSlider()
})

// function for loading-spinner
const tootleSpinner = () => {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.toggle("d-none");
}

// function for showing error message when something is wrong
const errorMessage = () => {
  const error = document.getElementById("error");
  error.innerHTML = `
    <h1> Something Went wrong! Please try again!</h1>
  `;
  tootleSpinner();
}

// function for showing how many items are selected for slider
const slideNumberChange = (dd) =>{
  let slideNumber = parseFloat(document.getElementById("slideNumber").innerText);
  console.log("slide number: ",slideNumber+1);
  if(dd == "plus"){
    slideNumber++;
    document.getElementById("slideNumber").innerText = `${slideNumber}`;
  }
  else{
    slideNumber--;
    document.getElementById("slideNumber").innerText = `${slideNumber}`;
  }
}