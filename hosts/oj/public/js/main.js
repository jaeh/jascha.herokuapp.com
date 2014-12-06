(function() {
  'use strict';

  //first tell the body that we have javascript support
  document.body.className = document.body.className.replace('nojs', 'js');

  document.location.hash = document.location.hash || '#image-1';
  
  var imgEle = loadFirstImage();
  if ( typeof imgEle.className === 'string' ) {
    imgEle.className = 'displayed';
  }

  function addGallery() {
    var contentEle = document.getElementById('content');
    var galleryEle = document.createElement('div');
    var galleryContainerEle = document.createElement('ul');
    galleryEle.id = 'gallery';
    galleryContainerEle.id = 'gallery-container';
    contentEle.appendChild(galleryEle);
    galleryEle.appendChild(galleryContainerEle);
    return galleryContainerEle;
  }

  function getImagesFromNoscript() {
    var imageGalleryEle = document.getElementById('imageGallery');
    var imageHTML = imageGalleryEle.innerHTML;
    var sources = imageHTML.split('src="');
    sources.shift(); //remove first element, it is no img src
    var titles = imageHTML.split('title="');
    titles.shift(); //not a title

    var imgs = [];
    for ( var i = 0; i < sources.length; i++ ) {
      imgs.push({
          src  : sources[i].split('"')[0]
        , id   : (i + 1)
        , title: titles[i].split('"')[0]
      });
    }
    return imgs;
  }

  function loadImages(container, images) {
    console.log('images', images);
    images.forEach(function (image) {
      addImageEle(container, image, false);
    });
  }

  function loadFirstImage(container, images, id) {
    var hashId = parseInt((location.hash || '1').replace('#image-', ''));
    var images = getImagesFromNoscript();
    var galleryEle = addGallery();
    
    if ( images[hashId].src ) {
      console.log('loadimage', hashId);
      return addImageEle(galleryEle, hashId, images, true);
    }
  }

  function addImageEle(container, id, images, addEvent) {
    var imgContainer = document.createElement('li');
    var imgEle = document.createElement('img');
    var imgTitle = document.createElement('h2');

    var image = ( images[id] )
                ? images[id]
                : ( ! images && ! addEvent && id )
                  ? id : false;

    if ( ! image ) {
      return false;
    }
    imgEle.src = image.src;
    imgEle.title = image.title;
    imgEle.id = 'image-' + image.id;
    
    imgTitle.innerHTML = image.title;

    imgContainer.appendChild(imgEle);
    imgContainer.appendChild(imgTitle);

    container.appendChild(imgContainer);
    if ( addEvent ) {
      imgEle.addEventListener('load', function () {
        delete images[id];
        if ( images ) {
          loadImages(container, images);
        }
      });
    }
    return imgContainer;
  }
})();
