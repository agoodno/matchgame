// remap jQuery to $
(function($){})(window.jQuery);

var imgs = [ "candycane.png", "hat.png", "ornament.png", "present.png", "snowman.png", "tree.png" ];
//var imgs = [ "Bell.png", "Box.png", "Santa.png", "Snowman.png", "tree.png", "Tree.png" ];

var unsortedImgNames = imgs.map(stripExtension);
//console.log(unsortedImgNames);

function getParameter(parameterName) {
   var queryString = window.top.location.search.substring(1);

   // Add "=" to the parameter name (i.e. parameterName=value)
   var parameterName = parameterName + "=";
   if ( queryString.length > 0 ) {
      // Find the beginning of the string
      begin = queryString.indexOf ( parameterName );
      // If the parameter name is not found, skip it, otherwise return the value
      if ( begin != -1 ) {
         // Add the length (integer) to the beginning
         begin += parameterName.length;
         // Multiple parameters are separated by the "&" sign
         end = queryString.indexOf ( "&" , begin );
      if ( end == -1 ) {
         end = queryString.length
      }
      // Return the string
      return unescape ( queryString.substring ( begin, end ) );
   }
   // Return "null" if no parameter has been found
   return "null";
   }
}

function randomize(sImgs) {
  var unsortedImgs = [];

  var unsortedImgNamesDoubles = [];
  for (img in unsortedImgNames) {
    unsortedImgNamesDoubles = unsortedImgNamesDoubles.concat(doubleUp(unsortedImgNames[img]));
  }
//  console.log(unsortedImgNamesDoubles);

  while (unsortedImgNamesDoubles.length > 0) {
    var index = Math.floor(Math.random() * unsortedImgNamesDoubles.length);
    var img = unsortedImgNamesDoubles.splice(index, 1);
//    console.log("index="+index+",img="+img);
    unsortedImgs.push(img);
  }

  return unsortedImgs;
};

function stripExtension(img) {
  return img.substring(0, img.lastIndexOf("."));
}

function doubleUp(imgName) {
  return [ (imgName + "-1"), (imgName + "-2") ];
}

function stripBaseId(id) {
  return id.substring(0, id.lastIndexOf("-"));
}

function inCardSet(cardsetName) {
  return function(cardName) {
    return { name: cardName, path: "cardsets" + "/" + cardsetName + "/" + cardName };
  };
};

var cardset = getParameter("with");

var xmasCardSet = inCardSet(cardset);

//console.log(unsortedImgNames.map(xmasCardSet));,

var data = {
  cards: unsortedImgNames.map(xmasCardSet),
  imgs: randomize(imgs)
};

var pair = [];
var matches = [];

var comparePair = function() {
//  console.log("comparing");
  if (stripBaseId(pair[0].id) === stripBaseId(pair[1].id)) {
//    console.log("match!!!");
    $.each(pair, function(i,e) {
      matches.push(e);
      $(e).removeClass("hovering");
    });
    pair = [];
  }// else {
//    console.log("no match");
//  }
};

var recoverPair = function() {
  $.each(pair, function(i,e) {
//    console.log("re-covering " + i);
    $(e).addClass("covered");
  });
  pair = [];
};

/* trigger when page is ready */
$(document).ready(function() {
/*
  $.each(cards, function(i,value) {
     console.log("processing " + i + ", card " + value);
  });
*/
  $("#boardCssTemplate").tmpl(data).appendTo("#boardCss");

  $("#boardTableTemplate").tmpl(data).appendTo("#boardTableContainer");

  $(".card").hover(
    function(e) {
      if ($(this).hasClass("covered")) {
        $(this).addClass("hovering");        
      }
    },
    function(e) {
      $(this).removeClass("hovering");
    });

  $(".card").click(function() {
    if ($(this).hasClass("covered")) {
      $(this).removeClass("covered");      
      pair.push(this);
//      console.log(pair);
      if (pair.length === 2) {
        comparePair();
      } else if (pair.length === 3) {
        recoverPair();
      }
    }
  });

});

/* optional triggers

$(window).load(function() {
    
});

$(window).resize(function() {
	
});

*/
