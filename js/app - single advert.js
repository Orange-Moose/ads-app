/*
To-Do

1. Set current
2. Implement Copy btn
3. 
4. Make textarea auto resize https://codepen.io/vsync/pen/czgrf
5. 
6. 
7. Implement errors: symbol limit class "red", popup message if input contains invalid symbol
*/


///////////// APP DATA /////////////

/* 
  Init
  1. Create new empty Map() to store data

if path1 true textcontent  =  ...; elseif path1 and path2 is true...

*/



  class Advert {
      constructor(url, head1, head2, head3, pathMain, path1, path2, desc1, desc2)
      {
        this.url = url;
        this.head1 = head1;
        this.head2 = head2;
        this.head3 = head3;
        this.pathMain = pathMain;
        this.path1 = path1;
        this.path2 = path2;
        this.desc1 = desc1;
        this.desc2 = desc2;
      }
  }

  let allAdverts = [];
  let cur = null;


///////////// APP CONTROLLER /////////////

let appController = {
  init: function() {
    
    let newAdvert = new Advert();
    allAdverts.push(newAdvert);
    // 1. sets values to object
    this.setAdValues(allAdverts[0], this.getAdValues()); 
    // 2. uses values in advert
    leftView.init();
    rightView.init();

    this.pathFormat(allAdverts[0].path1, allAdverts[0].path2, allAdverts[0].url);
    this.headlineFormat(allAdverts[0].head1, allAdverts[0].head2, allAdverts[0].head3);
    this.descriptionFormat(allAdverts[0].desc1);
  },
  getAdValues: function() {
    let l = document.getElementById('final-url').value; 
    let h1 = document.getElementById('headline-1').value;
    let h2 = document.getElementById('headline-2').value;
    let h3 = document.getElementById('headline-3').value;
    let p1 = document.getElementById('path-1').value;
    let p2 = document.getElementById('path-2').value;
    let d1 = document.getElementById('description-1').value;
    let d2 = document.getElementById('description-2').value;
    let allValues = [l, h1, h2, h3, p1, p2, d1, d2];
    return allValues;
  },
  setAdValues: function(curObj, valArr) { //redo obj to curObj
    
    curObj.url = valArr[0];
    curObj.head1 = valArr[1]; 
    curObj.head2 = valArr[2]; 
    curObj.head3 = valArr[3];
    curObj.pathMain = "www.example.com"; //cut averything after (/...) subdomain: valArr[0] minus some stuff
    curObj.path1 = valArr[4]; 
    curObj.path2 = valArr[5];
    curObj.desc1 = valArr[6];
    curObj.desc2 = valArr[7];
  },
  setAdText: function() {
    let h1, h2, h3, paths, d1, d2;
    
    h1 = document.querySelector('.out-head-1');
    h1.textContent = allAdverts[0].head1;
    h2 = document.querySelector('.out-head-2');
    h2.textContent = allAdverts[0].head2;
    h3 = document.querySelector('.out-head-3');
    h3.textContent = allAdverts[0].head3;
    paths = document.querySelector('.out-path-url');
    paths.textContent = `${allAdverts[0].url}/${allAdverts[0].path1}/${allAdverts[0].path2}`;
    d1 = document.querySelector('.out-desc-1');
    d1.textContent = allAdverts[0].desc1;
    d2 = document.querySelector('.out-desc-2');
    d2.textContent = allAdverts[0].desc2;
  },
  symbolCount: function() {
    let h1, h2, h3, p1, p2, d1, d2;

    h1 = document.querySelector('.head1-count');
    h2 = document.querySelector('.head2-count');
    h3 = document.querySelector('.head3-count');
    p1 = document.querySelector('.path1-count');
    p2 = document.querySelector('.path2-count');
    d1 = document.querySelector('.desc1-count');
    d2 = document.querySelector('.desc2-count');
    
    h1.textContent = allAdverts[0].head1.length;
    h2.textContent = allAdverts[0].head2.length;
    h3.textContent = allAdverts[0].head3.length;
    p1.textContent = allAdverts[0].path1.length;
    p2.textContent = allAdverts[0].path2.length;
    d1.textContent = allAdverts[0].desc1.length;
    d2.textContent = allAdverts[0].desc2.length;
  },
  headlineFormat: function(h1, h2, h3) {
    let previewH1, previewH2, previewH3;
    previewH1 = document.querySelector('#out-ad-1 .out-headlines .out-head-1');
    previewH2 = document.querySelector('#out-ad-1 .out-headlines .out-head-2');
    previewH3 = document.querySelector('#out-ad-1 .out-headlines .out-head-3');

    if(h1.length === 0 && h2.length === 0 && h3.length === 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = 'Headline 2 | ';
        previewH3.textContent = 'Headline 3';
    } else if(h1.length !== 0 && h2.length === 0 && h3.length === 0) {
        previewH1.textContent = `${allAdverts[0].head1} | `;
        previewH2.textContent = 'Headline 2';
        previewH3.textContent = '';
    } else if(h1.length !== 0 && h2.length !== 0 && h3.length === 0) {
        previewH1.textContent = `${allAdverts[0].head1} | `;
        previewH2.textContent = `${allAdverts[0].head2}`;
        previewH3.textContent = '';
    } else if(h1.length !== 0 && h2.length !== 0 && h3.length !== 0) {
        previewH1.textContent = `${allAdverts[0].head1} | `;
        previewH2.textContent = `${allAdverts[0].head2} | `;
        previewH3.textContent = allAdverts[0].head3;
    } else if(h1.length === 0 && h2.length !== 0 && h3.length !== 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = `${allAdverts[0].head2} | `;
        previewH3.textContent = allAdverts[0].head3;
    } else if(h1.length === 0 && h2.length === 0 && h3.length !== 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = 'Headline 2 | ';
        previewH3.textContent = allAdverts[0].head3;
    } else if(h1.length === 0 && h2.length !== 0 && h3.length === 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = allAdverts[0].head2;
        previewH3.textContent = '';
    } else if(h1.length !== 0 && h2.length === 0 && h3.length !== 0) {
        previewH1.textContent = `${allAdverts[0].head1} | `;
        previewH2.textContent = 'Headline 2 | ';
        previewH3.textContent = allAdverts[0].head3;
    };

  },
  pathFormat: function(p1, p2, u) {
    let previewUrl; 
    previewUrl = document.querySelector('#out-ad-1 .out-path-url');

    if(u.length !== 0 && p1.length === 0 && p2.length === 0) {
      previewUrl.textContent = allAdverts[0].url;
    } else if(u.length !== 0 && p1.length !== 0 && p2.length === 0) {
        previewUrl.textContent = `${allAdverts[0].url}/${allAdverts[0].path1}`;
    } else if(u.length !== 0 && p1.length === 0 && p2.length !== 0) {
        previewUrl.textContent = `${allAdverts[0].url}/Path1/${allAdverts[0].path2}`;
    } else if(u.length === 0 && p1.length === 0 && p2.length === 0) {
      previewUrl.textContent = `www.examle.com`;
    } else if(u.length === 0 && p1.length !== 0 && p2.length === 0) {
        previewUrl.textContent = `www.example.com/${allAdverts[0].path1}`;
    } else if(u.length === 0 && p1.length === 0 && p2.length !== 0) {
        previewUrl.textContent = `www.example.com/Path1/${allAdverts[0].path2}`;
    } else if(u.length === 0 && p1.length !== 0 && p2.length !== 0) {
        previewUrl.textContent = `www.example.com/${allAdverts[0].path1}/${allAdverts[0].path2}`;
    } 
  },
  descriptionFormat: function(d1) {
    let previewD1;
    previewD1 = document.querySelector('#out-ad-1 .out-description .out-desc-1');


    if(d1.length === 0) {
      previewD1.textContent = 'Description 1 ';
    } else {
      previewD1.textContent = `${allAdverts[0].desc1}`;
    };
  }
};




///////////// APP VIEWS /////////////


///// Left View /////
let leftView = {
  init: function() {
    // add event listeners to all input fields. On change call getValues(setValues()) and updateAd()
    this.inputEvents();

  },
  inputEvents: function() {
    let inputs, i;
    inputs = document.getElementsByTagName('input'); // returns a NodeList
    for(i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keyup', () => {
        appController.setAdValues(allAdverts[0], appController.getAdValues());  //refactor allAdverts[0] to cur object.
        rightView.updateAd();
        appController.symbolCount();
        appController.pathFormat(allAdverts[0].path1, allAdverts[0].path2, allAdverts[0].url);
        appController.headlineFormat(allAdverts[0].head1, allAdverts[0].head2, allAdverts[0].head3);
        appController.descriptionFormat(allAdverts[0].desc1);
      });
    }
  },
}



///// Right View /////
let rightView = {
  init: function() {

    this.appendAd();

  },
  createAd: function() {
    let adBox, headBox, head1, head2, head3, urlBox, ad, path;
    let descBox, pBox, desc1, desc2;

    //create ad box elements
    adBox = document.createElement("div");
    adBox.setAttribute('id', 'out-ad-1'); //get id from index in adwerts array: `out-ad-${allAdverts[cur]}`
    adBox.setAttribute('class', `out-ad`);
      headBox = document.createElement("div");
      headBox.setAttribute('class', 'out-headlines');
        head1 = document.createElement("span");
        head1.className = 'out-head-1';
          head1.textContent = `${allAdverts[0].head1} | `;
        head2 = document.createElement("span");
        head2.className = 'out-head-2';
          head2.textContent = `${allAdverts[0].head2} | `;
        head3 = document.createElement("span");
        head3.className = 'out-head-3';
          head3.textContent = allAdverts[0].head3;
      urlBox = document.createElement("div");
      urlBox.className = 'out-urls';
        ad = document.createElement("p");
        ad.className = 'out-ad-msg';
          ad.textContent = "Ad";
        path = document.createElement('p');
        path.className = 'out-path-url';
          path.textContent = `${allAdverts[0].pathMain}/${allAdverts[0].path1}/${allAdverts[0].path2}`;
      descBox = document.createElement("div");
      descBox.className = 'out-description';
        pBox = document.createElement("p");
          desc1 = document.createElement("span");
          desc1.className = 'out-desc-1';
            desc1.textContent = `${allAdverts[0].desc1} `;
          desc2 = document.createElement("span");
          desc2.className = 'out-desc-2';
            desc2.textContent = allAdverts[0].desc2;

    
    
    // create ad box DOM structure
    adBox.append(headBox, urlBox, descBox);
      headBox.prepend(head1, head2, head3);
      urlBox.prepend(ad, path);
      descBox.prepend(pBox);
        pBox.prepend(desc1, desc2);
    
    return adBox;

  },
  appendAd: function() {
    let copyBtn, container;

    copyBtn = document.createElement("button");
    copyBtn.setAttribute('class', 'copy-btn');
    copyBtn.setAttribute('id', 'copy-btn-1'); //get id from index in adwerts array: `copy-btn-${allAdverts[cur]}`
    copyBtn.setAttribute('type', 'button');
    copyBtn.textContent = "Copy";

    container = document.querySelector('.right--bottom .ad-container');
    container.append(this.createAd(), copyBtn);
  },
  updateAd: function() {
    appController.setAdText();
  }
}



//All systems go!
appController.init();