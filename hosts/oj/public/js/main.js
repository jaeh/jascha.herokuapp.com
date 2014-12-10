//first tell the body that we have javascript support as early as possible
document.body.className = document.body.className.replace('nojs', 'js');

/*
 * renders the image gallery,
 * adds image gallery navigation by clicking left/right half of the image
 * 
*/
(function() {
  'use strict';

  var pathName = document.location.pathname;
  var timeOfDay = localStorage.bodyClass || 'day';
  var imageGallery = document.getElementById('image-gallery');

  document.body.classList.add(timeOfDay);

  if ( imageGallery && imageGallery.innerHTML ) {
    document.location.hash = document.location.hash || '#image-1';

    var imgEle = loadFirstImage();
    //~ if ( imgEle && typeof imgEle.className === 'string' ) {
      //~ imgEle.className = 'displayed';
    //~ }
    resizeImages();
  }


  function addGallery() {
    if ( document.getElementById('gallery-container') ) {
      return document.getElementById('gallery-container');
    }

    var contentEle = document.getElementById('content');
    var galleryEle = document.createElement('div');
    var galleryContainerEle = document.createElement('ul');

    galleryContainerEle.id = 'gallery-container';

    galleryEle.id = 'gallery';
    galleryEle.appendChild(galleryContainerEle);

    contentEle.appendChild(galleryEle);
    return galleryContainerEle;
  }

  function getImagesFromNoscript() {
    var imageGalleryEle = document.getElementById('image-gallery');
    var imageHTML = imageGalleryEle.innerHTML;
    var imageTags = imageHTML.split('&lt;img');
    if ( imageHTML.indexOf('<img') >= 0 ) {
      imageTags = imageHTML.split('<img');
    }
    console.log('imageTags', imageTags);

    var imgs = [];
    for (var i = 0; i < imageTags.length; i++ ) {
      var img = parseImgTag(imageTags[i]);
      if ( img ) {
        imgs.push( img );
      }
    }
    console.log('imgs', imgs);
    return imgs;
  }

  function parseImgTag(img) {
    var src = img.split('src="')[1] || '';
    var title = img.split('title="')[1] || '';
    var id = img.split('id="')[1] || '';

    console.log('img', img);

    if ( src ) {
      var image = {
          id    : id.split('"')[0]
        , src: src.split('"')[0]
        , title : title.split('"')[0]
      };
      return image;
    }
    return false;
  }

  function loadImages(images) {
    images.forEach(function (image) {
      addImageEle(image);
    });
  }

  function getHashId() {
     return parseInt(location.hash.replace('#image-', '') );
  }

  function loadFirstImage() {
    var hashId = getHashId();
    var images = getImagesFromNoscript();
    var galleryEle = addGallery();
    var image = images[hashId-1];
    delete images[hashId-1];
    
    return addImageEle(image, true, images);
  }

  function addImageEle(image, addEvent, images) {
    var imgContainer = document.createElement('li');
    var imgEle = document.createElement('img');
    var imgTitle = document.createElement('h2');

    if ( ! image ) {
      return false;
    }

    imgEle.src = image.src;
    imgEle.title = image.title;
    imgEle.id = image.id;

    imgTitle.innerHTML = image.title;

    imgContainer.appendChild(imgEle);
    imgContainer.appendChild(imgTitle);

    var gallery = addGallery();
    var hashId = getHashId();
    var imgId = parseInt( imgEle.id.replace('image-', '') );

    if ( imgId < hashId ) {
      var imgParent = document.getElementById('image-' + hashId).parentNode;
      gallery.insertBefore(imgContainer, imgParent);
    } else {
      gallery.appendChild(imgContainer);
    }

    imgEle.addEventListener('click', imageClick, false);
    resizeImage(imgEle);

    if ( addEvent && images ) {
      imgEle.addEventListener('load', function () {
        imgEle.parentNode.className = 'displayed';
        loadImages(images);
      });
    }

    return imgContainer;
  }

  function hashChange() {
    showImage(location.hash.replace('#image-', ''));
  }

  function showImage(id) {
    var image = document.getElementById('image-' + id);
    var shownImages = document.getElementsByClassName('displayed');

    if (image) {
      for ( var k in shownImages ) {
        if ( shownImages.hasOwnProperty(k) ) {
          if ( typeof shownImages[k].className !== 'undefined' ) {
            shownImages[k].className = '';
          }
        }
      }
      image.parentNode.className = 'displayed';
    }
  }

  function loadNextImage() {
    var hashId = getHashId();
    var imageCount = countImages();
    console.log('hashId', hashId, 'imageCount', imageCount);
    
    if ( hashId < imageCount ) {
      hashId += 1;
      console.log('increment hashId');
    } else {
      hashId = 1;
    }
    location.hash = '#image-' + hashId;
    console.log('location.hash', location.hash);
  }

  function loadPreviousImage() {
    var hashId = getHashId();
    if ( hashId > 1 ) {
      hashId -= 1;
    } else {
      hashId = countImages();
    }
    location.hash = '#image-' + hashId;
  }

  function imageClick(evt) {
    var offsetLeft = evt.target.offsetLeft;
    var x = evt.x || evt.screenX;
    var center = ( evt.target.width / 2 ) + offsetLeft;
    if ( x > center ) {
      loadNextImage();
    } else {
      loadPreviousImage();
    }
}

  function getImages() {
    var gallery = document.getElementById('gallery-container');
    var images = gallery.getElementsByTagName('img');
    return images;
  }

  function countImages() {
    var images = getImages();
    return images.length;
  }

  function resizeImages() {
    var gallery = addGallery();
    var images = gallery.getElementsByTagName('img');

    for ( var k in images ) {
      if ( images.hasOwnProperty(k) ) {
        resizeImage(images[k]);
      }
    }
  }

  function resizeImage(image) {
    if ( image.style ) {
      var height = window.innerHeight;
      image.style.maxHeight = (height - 150) + 'px';
      image.style.width = 'auto';
      image.style.maxWidth = '100%';
    }
  }

  window.addEventListener('resize', function () {
    resizeImages();
  });

  window.addEventListener('hashchange', hashChange, false);  
})();

/*
 * rendering and adds event listeners for the day/night button
*/
(function addDayNightUi () {
  'use strict';

  //day/night button
  var menuUl = document.getElementById('menu').getElementsByTagName('ul')[0];
  var buttonContainer = document.createElement('li');
  var button = document.createElement('a');
  var currentTimeOfDay = localStorage.bodyClass || 'day';

  button.className = currentTimeOfDay === 'day' ? 'day' : 'night';
  button.innerHTML = currentTimeOfDay === 'day' ? 'night' : 'day';
  buttonContainer.appendChild(button);
  menuUl.appendChild(buttonContainer);

  button.addEventListener('click', function (evt) {
    var className = evt.target.className || 'night';
    var newClass = 'day';
    if ( className === 'day' ) {
      newClass = 'night';
    }
    localStorage.bodyClass = newClass;
    evt.target.innerHTML = evt.target.innerHTML.replace(newClass, className);
    evt.target.className = evt.target.className.replace(className, newClass);
    document.body.className = document.body.className.replace(className, newClass);
  });
})();


/*
 * rendering and adds event listeners for the fullscreen button
*/
(function () {
  'use strict';
  var elem = document.body;
  elem.requestFullscreen = elem.requestFullscreen 
                        || elem.msRequestFullscreen
                        || elem.mozRequestFullScreen
                        || elem.webkitRequestFullScreen
                        || false
  ;

  //only load if requestFullscreen exists
  if ( typeof elem.requestFullscreen === 'function' ) {
    var menuUl = document.getElementById('menu').getElementsByTagName('ul')[0];
    var buttonContainer = document.createElement('li');
    var button = document.createElement('a');
    button.id = 'fullscreen';
    button.innerHTML = 'fullscreen';
    button.addEventListener('click', function () {
      elem.requestFullscreen();
    });

    buttonContainer.appendChild(button);
    menuUl.appendChild(buttonContainer);
  }
})();
