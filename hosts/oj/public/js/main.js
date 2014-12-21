'use strict';

//first tell the body that we have javascript support as early as possible
document.body.className = document.body.className.replace('nojs', 'js');

function getImages() {
  var gallery = document.getElementById('gallery-container');
  var images = gallery.getElementsByTagName('img');
  return images;
}


function getHashId() {
   return parseInt(location.hash.replace('#image-', '') );
}

function countImages() {
  var images = getImages();
  return images.length;
}

function loadNextImage() {
  var hashId = getHashId();
  var imageCount = countImages();
  console.log('hashId', hashId, 'imageCount', imageCount);
  
  if ( hashId < imageCount ) {
    hashId += 1;
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

function realFullscreen() {
  var d = document
    , elem = d.body
    , isFullscreen = d.fullscreen
                  || d.mozFullScreen
                  || d.webkitIsFullScreen
                  || d.msFullscreenElement
                  || false
  ;

  document.cancelFullscreen = d.cancelFullScreen
                           || d.exitFullscreen
                           || d.mozCancelFullScreen
                           || d.webkitCancelFullScreen
                           || d.msExitFullscreen
                           || false
  ;

  if ( ! isFullscreen ) {
    elem.requestFullscreen();
    button.classList.add('icon-compress');
    button.classList.remove('icon-expand');
  } else {
    document.cancelFullscreen();
    button.classList.add('icon-expand');
    button.classList.remove('icon-compress');
  }
}

function inPageFullscreen() {
  var cL = document.body.classList
    , cN = document.body.className
  ;

  if ( cN.indexOf('fullscreen') >= 0 ) {
    cL.remove('fullscreen');
  } else {
    cL.add('fullscreen');
  }
}

/*
 * renders the image gallery,
 * adds image gallery navigation by clicking left/right half of the image
 * 
*/
(function addImageGallery() {
  var pathName = document.location.pathname;
  var timeOfDay = localStorage.bodyClass || 'day';
  var imageGallery = document.getElementById('image-gallery');

  document.body.classList.add(timeOfDay);

  if ( imageGallery && imageGallery.innerHTML ) {
    document.location.hash = document.location.hash || '#image-1';

    if ( loadFirstImage() ) {
      resizeImages();
    }
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

  function loadFirstImage() {
    var hashId = getHashId();
    var images = getImagesFromNoscript();
    var image = images[hashId-1];

    if ( image ) {
      var galleryEle = addGallery();
      delete images[hashId-1];
      return addImageEle(image, true, images);
    } else {
      return false;
    }
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

  function resizeImages() {
    var imageGallery = document.getElementById('image-gallery');
    //make sure the gallery exists and has content
    if (imageGallery && imageGallery.innerHTML ) {
      var gallery = addGallery();
      var images = gallery.getElementsByTagName('img');

      for ( var k in images ) {
        if ( images.hasOwnProperty(k) ) {
          resizeImage(images[k]);
        }
      }
    }
  }

  function resizeImage(image) {
    if ( image.style ) {
      var height = window.innerHeight;
      image.style.maxHeight = (height - 180) + 'px';
    }
  }

  window.addEventListener('resize', function () {
    resizeImages();
  });

  document.addEventListener('webkitfullscreenchange', fullscreenChange);
  document.addEventListener('mozfullscreenchange', fullscreenChange);
  document.addEventListener('fullscreenchange', fullscreenChange);
  document.addEventListener('MSFullscreenChange', fullscreenChange);

  function fullscreenChange() {
    var d = document
      , isFullscreen = d.fullscreen
                      || d.mozFullScreen
                      || d.webkitIsFullScreen
                      || d.msFullscreenElement
                      || false
    ;

    if ( ! isFullscreen ) {
      var fullscreenEle = document.getElementById('fullscreen');
      fullscreenEle.classList.add('icon-enlarge');
      fullscreenEle.classList.remove('icon-contract');
    }
  }

  window.addEventListener('hashchange', hashChange, false);  
})();

function getMenuContainer() {
  var menuContainer = document.getElementById('extra-menu-container');
  if ( ! menuContainer ) {
    menuContainer = document.createElement('ul');
    menuContainer.id = 'extra-menu-container';
    document.body.appendChild(menuContainer);
  }
  return menuContainer;
}

/*
 * rendering and adds event listeners for the fullscreen button
 */
(function addFullscreenUi() {
  var menuContainer = getMenuContainer()
    , elem          = document.body
    , header        = document.querySelectorAll('header.main')[0]
  ;

  elem.requestFullscreen = elem.requestFullscreen 
                        || elem.msRequestFullscreen
                        || elem.mozRequestFullScreen
                        || elem.webkitRequestFullScreen
                        || false
  ;

  var menuUl = document.getElementById('menu').getElementsByTagName('ul')[0];
  var buttonContainer = document.createElement('li');
  var button = document.createElement('a');
  buttonContainer.id = 'fullscreen-container';
  buttonContainer.appendChild(button);
  
  header.classList.add('animated');

  button.id = 'fullscreen';
  button.classList.add('icon-expand');
  //~ button.innerHTML = 'fullscreen';
  button.addEventListener('click', inPageFullscreen);

  menuContainer.appendChild(buttonContainer);
  //~ menuUl.appendChild(buttonContainer);
})();


/*
 * rendering and adds event listeners for the day/night button
*/
(function addDayNightUi () {
  var menuContainer = getMenuContainer();
  var menuUl = document.getElementById('menu').getElementsByTagName('ul')[0];
  var buttonContainer = document.createElement('li');
  buttonContainer.id = 'daynight-container';
  var button = document.createElement('a');
  var currentTimeOfDay = localStorage.bodyClass || 'day';
  button.setAttribute('data-time', currentTimeOfDay);

  button.classList.add(currentTimeOfDay === 'day' ? 'day' : 'night');
  button.classList.add('icon-lamp');
  //~ button.innerHTML = currentTimeOfDay === 'day' ? 'night' : 'day';
  buttonContainer.appendChild(button);
  menuContainer.appendChild(buttonContainer);

  button.addEventListener('click', function (evt) {
    var className = button.getAttribute('data-time') || 'night';
    var newClass = 'day';
    if ( className === 'day' ) {
      newClass = 'night';
    }

    localStorage.bodyClass = newClass;
    //~ evt.target.innerHTML = evt.target.innerHTML.replace(newClass, className);
    evt.target.setAttribute('data-time', newClass);
    document.body.className = document.body.className.replace(className, newClass);
  });
})();


(function addImageGallery() {
  var menuUl = document.getElementById('menu').getElementsByTagName('ul')[0];
  var buttonContainer = document.createElement('li');
  buttonContainer.id = 'leftright-container';
  var buttonRight = document.createElement('a');
  var buttonLeft = document.createElement('a');
  buttonRight.id = 'btn-right';
  buttonRight.classList.add('icon-caret-right');
  buttonLeft.id = 'btn-left';
  buttonLeft.classList.add('icon-caret-left');
  buttonContainer.appendChild(buttonLeft);
  buttonContainer.appendChild(buttonRight);
  menuUl.appendChild(buttonContainer);

  buttonLeft.addEventListener('click', loadPreviousImage);
  buttonRight.addEventListener('click', loadNextImage);

  document.addEventListener('keyup', function (evt) {
    var kC = evt.keyCode;
    if ( kC === 37 || kC === 38 ) {
      loadPreviousImage();
    } else if ( kC === 39 || kC === 40 ) {
      loadNextImage();
    }
  });
})();

/*
 * phone swipe functionality
 */
(function phoneSwipe() {
  document.addEventListener('touchstart', function touchstart(evt) {
    var touches = evt.originalEvent.touches;

    if (touches && touches.length) {
      var touchStartPosition = {
          x: touches[0].pageX
        , y: touches[0].pageY
      };
      evt.preventDefault();
      document.addEventListener('touchmove', function touchmove(evt) {
        var touchEndPosition = { 
            x: touches[0].pageX 
          , y: touches[0].pageY
        };

        if ( touchEndPosition.x > touchStartPosition.x + 50 ) {
          loadNextImage();
        } else if ( touchEndPosition.x < touchStartPosition.x - 50 ) {
          loadPreviousImage();
        } else if ( touchEndPosition.y > touchStartPosition.y + 50 ) {
          loadNextImage();
        } else if ( touchEndPosition.y < touchStartPosition.y - 50 ) {
          loadPreviousImage();
        }

        evt.preventDefault();
        document.addEventListener('touchend', function touchend(evt) {
          evt.target.removeEventListener('touchmove');
          evt.preventDefault();
        } );
      });
    }
  });
});
