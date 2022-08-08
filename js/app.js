
// TO DO
// 1. Implement localStorage functionality - DONE
// 2. Btn "Save to LS" => appData.allAdverts to LS; msg on top right: "saved to LS"; - DONE
// 3. Btn "Download LS data" - DONE

// => import/export LS https://stackoverflow.com/questions/13335967/export-data-in-localstorage-for-later-re-import
//  => https://stackoverflow.com/questions/13405129/javascript-create-and-save-file/53864791#53864791

/*function download(text, name, type) {
  var a = document.getElementById("a");
  a.style.display = "block";
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}
#a { display: none; }
<a href="" id="a" download>click here to download your file</a>
<button onclick="download('file text', 'myfilename.txt', 'text/plain')">Create file</button>
*/

// 4. Btn "Delete LS" + popup - DONE
// 5. Btn "Import LS" - DONE
// 6. Restart app after LS clear - DONE
// 7. Pataisyti: appData.allAdverts ilgis neatspindi realiu ads'u id. - DONE
//    Reikia perdaryti, kad id nebutu suristas su ilgiu, e.target kazkaip targetintu tinkama adsa.
// 8. Fix deleteEvents bug - DONE
// 9. Fix Edit ad bug
//    line 531, ta pati beda - ID suristas su allAdverts.length. Klaida ivyksta jeigu ID didesnis uz length - DONE
// 10. Fix JSON import bug. cachedData() function is rewriting appData.AllAdverts array ignoring if it is empty. - DONE
// 11. Fix "Save and Create New" button created multiple ads at once!!!??? - DONE. Problem was with cachedData function call after import...
// 12. Fix Import bug. If prompt is canceled or empty. - DONE
// 13. Fix @media laptop'13 - '15 - DONE
// 14. Add Reset button => delete localStorage.allAdverts. (In case LS import failed) - DONE
// 15. Triger popup messages after page reload - DONE
// 16. Alert if LS import input is not valid - DONE
// 17. Fix popup overflow: hidden - DONE
// 17. Small Media screens popup - DONE


///////////// APP DATA /////////////

let appData = {
  currentAd: null,
  nextId: 0,
  allAdverts: [],
  advert: function() {
    let ad = class Advert {
      constructor(id, url, head1, head2, head3, pathMain, path1, path2, desc1, desc2)
      { 
        this.id = appData.nextId;
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
    };
    return new ad(); // invokes new instance creation <this.advert(ad());>
  }
};
 

///////////// APP CONTROLLER /////////////

let appController = {
  init: function() {
    this.createAdBlock(); 

    leftView.init();
    this.newAdButton();
    this.clearInputValues();
    this.copyAllEvents();

  }, 
  cachedData: function() {
    this.clearLSevents();  
    this.saveLSevents();
    this.exportLSevents();
    this.importLSevents();

    //get array of locally stored ads
    let cachedAds = JSON.parse(localStorage.allAdverts); // includes null values for deleted ads
    
    let validAds = cachedAds.filter(cachedAd => cachedAd !== null); // ignores null values        
    appData.allAdverts = "";
    appData.allAdverts = validAds;      
  
    validAds
      .map((validAd, i) => {     
        appData.currentAd = validAd;
        let cachedValArr = Object.entries(validAd);      
        appData.nextId = validAd.id + 1;

        rightView.appendAdBox();
        
        this.pathFormat(appData.currentAd.path1, appData.currentAd.path2, appData.currentAd.url);
        this.headlineFormat(appData.currentAd.head1, appData.currentAd.head2, appData.currentAd.head3);
        this.descriptionFormat(appData.currentAd.desc1);

        this.editEvents();
        this.deleteEvents();
        this.copyEvents();
      });

    leftView.init();
    this.newAdButton();
    this.clearInputValues();
    this.copyAllEvents();
    
  },
  createAdData: function() {
    let newAdvert = new appData.advert();
    appData.allAdverts.push(newAdvert);

  },
  newAdButton: function() {
    let newAdBtn = document.getElementById('save-ad');
    newAdBtn.addEventListener('click', () => {
      this.createAdBlock();
    });
  },
  createAdBlock: function() {
      this.clearLSevents();
      this.saveLSevents();
      this.exportLSevents();
      this.importLSevents();

      this.createAdData();
      this.setCurrent();
      this.setId(appData.nextId);
      
      this.setAdValues(appData.currentAd, this.getInputValues());
      rightView.appendAdBox();
      
      this.pathFormat(appData.currentAd.path1, appData.currentAd.path2, appData.currentAd.url);
      this.headlineFormat(appData.currentAd.head1, appData.currentAd.head2, appData.currentAd.head3);
      this.descriptionFormat(appData.currentAd.desc1);

      this.editEvents();
      this.deleteEvents();
      this.copyEvents();

  },
  setId: function(id) {
    let i = id;
    i++;
    appData.nextId = i;
  },
  setCurrent: function() {
    appData.currentAd = appData.allAdverts[appData.allAdverts.length - 1];
  },
  getCurrent: function() {
    return appData.currentAd;
  },
  getIndexOfCur: function() {
    return appData.allAdverts.indexOf(appData.currentAd);
  },
  getInputValues: function() {
    let allValues, l, h1, h2, h3, p1, p2, d1, d2;
    l = document.getElementById('final-url').value; 
    h1 = document.getElementById('headline-1').value;
    h2 = document.getElementById('headline-2').value;
    h3 = document.getElementById('headline-3').value;
    p1 = document.getElementById('path-1').value;
    p2 = document.getElementById('path-2').value;
    d1 = document.getElementById('description-1').value;
    d2 = document.getElementById('description-2').value;
    allValues = [l, h1, h2, h3, p1, p2, d1, d2];
    return allValues;
  },
  getObjectValues: function(cur) {
    let all;
    all = Object.values(cur); //returns array of obj property values
    all.shift(); //removes 1st array item -> ("id")
    all.splice(4, 1); // removes 1 item at index 4 -> ("www.example.com")

    return all;
  },
  setInputValues: function(valArr) {
    document.getElementById('final-url').value = valArr[0]; 
    document.getElementById('headline-1').value = valArr[1];
    document.getElementById('headline-2').value = valArr[2];
    document.getElementById('headline-3').value = valArr[3];
    document.getElementById('path-1').value = valArr[4];
    document.getElementById('path-2').value = valArr[5];
    document.getElementById('description-1').value = valArr[6];
    document.getElementById('description-2').value = valArr[7];
  },
  setAdValues: function(curObj, valArr) { 
    curObj.url = valArr[0];
    curObj.head1 = valArr[1]; 
    curObj.head2 = valArr[2]; 
    curObj.head3 = valArr[3];
    curObj.pathMain = "www.example.com"; 
    curObj.path1 = valArr[4]; 
    curObj.path2 = valArr[5];
    curObj.desc1 = valArr[6];
    curObj.desc2 = valArr[7];
  },
  clearInputValues: function() {
    let btn, emptyVals = ["", "", "", "", "", "", "", ""];
    btn = document.getElementById('clear-ad');
    btn.addEventListener('click', () => {
      this.setInputValues(emptyVals);
      this.setAdValues(appData.currentAd, emptyVals);
      //set right side UI to default values
      appController.pathFormat(appData.allAdverts[this.getIndexOfCur()].path1, appData.allAdverts[this.getIndexOfCur()].path2, appData.allAdverts[this.getIndexOfCur()].url);
      appController.headlineFormat(appData.allAdverts[this.getIndexOfCur()].head1, appData.allAdverts[this.getIndexOfCur()].head2, appData.allAdverts[this.getIndexOfCur()].head3);
      appController.descriptionFormat(appData.allAdverts[this.getIndexOfCur()].desc1);
      document.querySelector(`#out-ad-${appData.currentAd.id} .out-desc-2`).textContent = appData.allAdverts[appData.currentAd.id].desc2;
    });
  },
  setAdText: function(AdId) {
    let h1, h2, h3, paths, d1, d2;
    
    h1 = document.querySelector(`#out-ad-${AdId} .out-head-1`);
    h1.textContent = appData.allAdverts[this.getIndexOfCur()].head1;
    h2 = document.querySelector(`#out-ad-${AdId} .out-head-2`);
    h2.textContent = appData.allAdverts[this.getIndexOfCur()].head2;
    h3 = document.querySelector(`#out-ad-${AdId} .out-head-3`);
    h3.textContent = appData.allAdverts[this.getIndexOfCur()].head3;
    paths = document.querySelector(`#out-ad-${AdId} .out-path-url`);
    paths.textContent = `${appData.allAdverts[this.getIndexOfCur()].url}/${appData.allAdverts[this.getIndexOfCur()].path1}/${appData.allAdverts[this.getIndexOfCur()].path2}`;
    d1 = document.querySelector(`#out-ad-${AdId} .out-desc-1`);
    d1.textContent = appData.allAdverts[this.getIndexOfCur()].desc1;
    d2 = document.querySelector(`#out-ad-${AdId} .out-desc-2`);
    d2.textContent = appData.allAdverts[this.getIndexOfCur()].desc2;
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
    
    h1.textContent = appData.allAdverts[this.getIndexOfCur()].head1.length;
    h2.textContent = appData.allAdverts[this.getIndexOfCur()].head2.length;
    h3.textContent = appData.allAdverts[this.getIndexOfCur()].head3.length;
    p1.textContent = appData.allAdverts[this.getIndexOfCur()].path1.length;
    p2.textContent = appData.allAdverts[this.getIndexOfCur()].path2.length;
    d1.textContent = appData.allAdverts[this.getIndexOfCur()].desc1.length;
    d2.textContent = appData.allAdverts[this.getIndexOfCur()].desc2.length;
  },
  headlineFormat: function(h1, h2, h3) {
    let previewH1, previewH2, previewH3;
    previewH1 = document.querySelector(`#out-ad-${appData.currentAd.id} .out-headlines .out-head-1`);
    previewH2 = document.querySelector(`#out-ad-${appData.currentAd.id} .out-headlines .out-head-2`);
    previewH3 = document.querySelector(`#out-ad-${appData.currentAd.id} .out-headlines .out-head-3`);

    if(h1.length === 0 && h2.length === 0 && h3.length === 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = 'Headline 2 | ';
        previewH3.textContent = 'Headline 3';
    } else if(h1.length !== 0 && h2.length === 0 && h3.length === 0) {
        previewH1.textContent = `${appData.allAdverts[this.getIndexOfCur()].head1} | `;
        previewH2.textContent = 'Headline 2';
        previewH3.textContent = '';
    } else if(h1.length !== 0 && h2.length !== 0 && h3.length === 0) {
        previewH1.textContent = `${appData.allAdverts[this.getIndexOfCur()].head1} | `;
        previewH2.textContent = `${appData.allAdverts[this.getIndexOfCur()].head2}`;
        previewH3.textContent = '';
    } else if(h1.length !== 0 && h2.length !== 0 && h3.length !== 0) {
        previewH1.textContent = `${appData.allAdverts[this.getIndexOfCur()].head1} | `;
        previewH2.textContent = `${appData.allAdverts[this.getIndexOfCur()].head2} | `;
        previewH3.textContent = appData.allAdverts[this.getIndexOfCur()].head3;
    } else if(h1.length === 0 && h2.length !== 0 && h3.length !== 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = `${appData.allAdverts[this.getIndexOfCur()].head2} | `;
        previewH3.textContent = appData.allAdverts[this.getIndexOfCur()].head3;
    } else if(h1.length === 0 && h2.length === 0 && h3.length !== 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = 'Headline 2 | ';
        previewH3.textContent = appData.allAdverts[this.getIndexOfCur()].head3;
    } else if(h1.length === 0 && h2.length !== 0 && h3.length === 0) {
        previewH1.textContent = 'Headline 1 | ';
        previewH2.textContent = appData.allAdverts[this.getIndexOfCur()].head2;
        previewH3.textContent = '';
    } else if(h1.length !== 0 && h2.length === 0 && h3.length !== 0) {
        previewH1.textContent = `${appData.allAdverts[this.getIndexOfCur()].head1} | `;
        previewH2.textContent = 'Headline 2 | ';
        previewH3.textContent = appData.allAdverts[this.getIndexOfCur()].head3;
    };
  },
  pathFormat: function(p1, p2, u) {
    let previewUrl; 
    previewUrl = document.querySelector(`#out-ad-${appData.currentAd.id} .out-path-url`);

    if(u.length !== 0 && p1.length === 0 && p2.length === 0) {
      previewUrl.textContent = appData.allAdverts[this.getIndexOfCur()].url;
    } else if(u.length !== 0 && p1.length !== 0 && p2.length === 0) {
        previewUrl.textContent = `${appData.allAdverts[this.getIndexOfCur()].url}/${appData.allAdverts[this.getIndexOfCur()].path1}`;
    } else if(u.length !== 0 && p1.length === 0 && p2.length !== 0) {
        previewUrl.textContent = `${appData.allAdverts[this.getIndexOfCur()].url}/Path1/${appData.allAdverts[this.getIndexOfCur()].path2}`;
    } else if(u.length === 0 && p1.length === 0 && p2.length === 0) {
      previewUrl.textContent = `www.example.com`;
    } else if(u.length === 0 && p1.length !== 0 && p2.length === 0) {
        previewUrl.textContent = `www.example.com/${appData.allAdverts[this.getIndexOfCur()].path1}`;
    } else if(u.length === 0 && p1.length === 0 && p2.length !== 0) {
        previewUrl.textContent = `www.example.com/Path1/${appData.allAdverts[this.getIndexOfCur()].path2}`;
    } else if(u.length === 0 && p1.length !== 0 && p2.length !== 0) {
        previewUrl.textContent = `www.example.com/${appData.allAdverts[this.getIndexOfCur()].path1}/${appData.allAdverts[this.getIndexOfCur()].path2}`;
    } 
  },
  descriptionFormat: function(d1) {
    let previewD1;
    previewD1 = document.querySelector(`#out-ad-${appData.currentAd.id} .out-description .out-desc-1`);

    if(d1.length === 0) {
      previewD1.textContent = 'Description 1 ';
    } else {
      previewD1.textContent = `${appData.allAdverts[this.getIndexOfCur()].desc1}`;
    };
  },
  editEvents: function() {
    let btn;
    btn = document.querySelector(`#edit-btn-${appData.currentAd.id}`);
    btn.addEventListener('click', () => {
      let e, id;
      e = event.target;
      // get id of target ad element
      id = parseInt(e.id.split('').splice(9).join("")); // 'edit-btn-17' => [symbols] => ["1", "7"] => "17" + parseInt => 17
      let targetAd = appData.allAdverts.find((item) => item.id === id);
      appData.currentAd = targetAd;

      appController.setInputValues(appController.getObjectValues(appData.currentAd));
    });
  },
  deleteEvents: function() {
    let btn;
    btn = document.querySelector(`#delete-btn-${appData.currentAd.id}`);
    btn.addEventListener('click', () => {
      let e, id, dom, del, edit, copy;
      e = event.target;
      // get id of target ad element
      id = parseInt(e.id.split('').splice(11).join("")); // 'delete-btn-' length is 11
      let targetAd = appData.allAdverts.find((item) => item.id === id);
      appData.currentAd = targetAd;

      dom = document.getElementById(`out-ad-${id}`);
      del = document.getElementById(`delete-btn-${id}`);
      edit = document.getElementById(`edit-btn-${id}`);
      copy = document.getElementById(`copy-btn-${id}`);

      //delete DOM
      dom.parentNode.removeChild(dom);
      del.parentNode.removeChild(del);
      edit.parentNode.removeChild(edit);
      copy.parentNode.removeChild(copy);
      
      //delete data
      let index = appData.allAdverts.indexOf(targetAd);
      appData.allAdverts.splice(index, 1);

      //reset cur
      appData.currentAd = null;
    });
  },
  copyEvents: function() {
    let btn;
    btn = document.querySelector(`#copy-btn-${appData.currentAd.id}`);

    btn.addEventListener('click', () => {
      let e, id;
      e = event.target;
      id = parseInt(e.id.split('').splice(9).join("")); // 'copy-btn-'
      appController.copyAd(appController.textToCopy(appData.allAdverts.find((item) => item.id === id)));
    });     
  },
  copyAd: function(objValues) {
    let dummyTextarea = document.getElementById('dummy-input');
    dummyTextarea.value = objValues;
    dummyTextarea.select();
    document.execCommand('copy');
  },
  textToCopy: function(targetObj) {
    let text;
    if(!targetObj.path1 && !targetObj.path2) {
      text = `${targetObj.head1} 
${targetObj.head2}
${targetObj.head3}
${targetObj.url}
${targetObj.desc1}
${targetObj.desc2}`;
    } else if(!targetObj.path2) {
      text = `${targetObj.head1} 
${targetObj.head2}
${targetObj.head3}
${targetObj.url}/${targetObj.path1}
${targetObj.desc1}
${targetObj.desc2}`;
    } else {
      text = `${targetObj.head1} 
${targetObj.head2}
${targetObj.head3}
${targetObj.url}/${targetObj.path1}/${targetObj.path2}
${targetObj.desc1}
${targetObj.desc2}`;
    };

    return text;
  },
  copyAllEvents: function(items) {
    let btn;
    btn = document.querySelector(`.right-btn`);

    btn.addEventListener('click', () => {
      appController.copyAd(appController.textToCopyAll(appData.allAdverts));
    });  
  },
  textToCopyAll: function(allAdverts) {    
    let i, arr, targetArr, text;
    targetArr = allAdverts.flat(); //removes empty holes
    arr = [];
    
    for(i = 0; i < targetArr.length; i++) {
      if(!targetArr[i].path1 && !targetArr[i].path2) {
        text = `${targetArr[i].head1} 
${targetArr[i].head2}
${targetArr[i].head3}
${targetArr[i].url}
${targetArr[i].desc1}
${targetArr[i].desc2}`;
      } else if(!targetArr[i].path2) {
        text = `${targetArr[i].head1} 
${targetArr[i].head2}
${targetArr[i].head3}
${targetArr[i].url}/${targetArr[i].path1}
${targetArr[i].desc1}
${targetArr[i].desc2}`;
      } else {
      text = `${targetArr[i].head1} 
${targetArr[i].head2}
${targetArr[i].head3}
${targetArr[i].url}/${targetArr[i].path1}/${targetArr[i].path2}
${targetArr[i].desc1}
${targetArr[i].desc2}`;
      }

      arr.push(text); 
    }
    return arr.join(`\n\n --- \n\n`);
  },
  saveLocalStorage: function() {
    localStorage.setItem('allAdverts', JSON.stringify(appData.allAdverts));
  },
  popupMsg: function(msgID) {
    let popup = document.querySelector(msgID);
    let classes = ['ls-change-top', 'ls-change-right', 'hide'];
    
    window.setTimeout(function() {
      popup.classList.add(classes[0]);
    }, 1200);
    window.setTimeout(function() {
      popup.classList.add(classes[1]);
    }, 4000);
    window.setTimeout(function() {
      popup.classList.add(classes[2]);
    }, 5000);
    window.setTimeout(function() {
      popup.classList.remove(...classes);
    }, 6000);   
  },
  exportLocalStorage: function(content, name, type) {
    // create new blob file
    let file = new Blob([content], {type: type});
    //generates href download link
    downloadLink.href = URL.createObjectURL(file);
    //sets file name
    downloadLink.download = name;
  },
  importLocalStorage: function() {
    let data = prompt("Paste contents of your export file here.");
    localStorage.setItem('allAdverts', data);
  },
  saveLSevents: function() {
    let btn;
    btn = document.querySelector(`#saveLS`);

    btn.addEventListener('click', () => {
      appController.saveLocalStorage();
      appController.popupMsg('#saveMsg');
    });
  },
  exportLSevents: function() {
    let btn;
    btn = document.querySelector(`#exportLS`);

    btn.addEventListener('click', () => {
      this.exportLocalStorage(localStorage.allAdverts, 'YourLS.txt', 'text/plain');
    });
  },
  importLSevents: function() {
    let btn;
    btn = document.querySelector('#importLS');

    btn.addEventListener('click', () => {
      document.querySelector('.ad-container').innerHTML = "";
      appController.importLocalStorage();
      
      location.reload(true);
      sessionStorage.setItem('reloadImport', 'true');
  
    });
  },
  clearLSevents: function() {
    let btn;
    btn = document.querySelector(`#clearLS`);

    btn.addEventListener('click', () => {
      localStorage.setItem('allAdverts', "");
      document.querySelector('.ad-container').innerHTML = "";
      
      sessionStorage.setItem('reloadClear', 'true');
      location.reload(true);
    });
  }
};

// Sets sessionStorage for LS popup events on window.reload
window.onload = function() {
  let afterClear = sessionStorage.getItem('reloadClear');
  let afterImport = sessionStorage.getItem('reloadImport');
  if(afterClear) {
    sessionStorage.removeItem('reloadClear');
    appController.popupMsg('#clearMsg');
  };
  if(afterImport) {
    sessionStorage.removeItem('reloadImport');
    appController.popupMsg('#importMsg');
  };
}


////////// APP VIEWS /////////////


///// Left View /////
let leftView = {
  init: function() {
    this.inputEvents();
  },
  inputEvents: function() {
    let inputs, i;
    inputs = document.getElementsByTagName('input'); //nodeList
    
    for(i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keyup', () => {
        appController.setAdValues(appData.allAdverts[appController.getIndexOfCur()], appController.getInputValues());
        appController.setAdText(appData.currentAd.id);
        appController.symbolCount();
        appController.pathFormat(appData.allAdverts[appController.getIndexOfCur()].path1, appData.allAdverts[appController.getIndexOfCur()].path2, appData.allAdverts[appController.getIndexOfCur()].url);
        appController.headlineFormat(appData.allAdverts[appController.getIndexOfCur()].head1, appData.allAdverts[appController.getIndexOfCur()].head2, appData.allAdverts[appController.getIndexOfCur()].head3);
        appController.descriptionFormat(appData.allAdverts[appController.getIndexOfCur()].desc1);
      });
    }
  },
}


///// Right View /////
let rightView = {
  init: function() {
    this.appendAdBox();
  },
  createAdBox: function() {
    let adBox, headBox, head1, head2, head3, urlBox, ad, path;
    let descBox, pBox, desc1, desc2;

    //create adbox DOM
    adBox = document.createElement("div");
    adBox.setAttribute('id', `out-ad-${appData.currentAd.id}`);
    adBox.setAttribute('class', `out-ad`);
      headBox = document.createElement("div");
      headBox.setAttribute('class', 'out-headlines');
        head1 = document.createElement("span");
        head1.className = 'out-head-1';
          head1.textContent = `${appData.currentAd.head1} | `;
        head2 = document.createElement("span");
        head2.className = 'out-head-2';
          head2.textContent = `${appData.currentAd.head2} | `;
        head3 = document.createElement("span");
        head3.className = 'out-head-3';
          head3.textContent = appData.currentAd.head3;
      urlBox = document.createElement("div");
      urlBox.className = 'out-urls';
        ad = document.createElement("p");
        ad.className = 'out-ad-msg';
          ad.textContent = "Ad";
        path = document.createElement('p');
        path.className = 'out-path-url';
          path.textContent = `${appData.currentAd.pathMain}/${appData.currentAd.path1}/${appData.currentAd.path2}`;
      descBox = document.createElement("div");
      descBox.className = 'out-description';
        pBox = document.createElement("p");
          desc1 = document.createElement("span");
          desc1.className = 'out-desc-1';
            desc1.textContent = `${appData.currentAd.desc1} `;
          desc2 = document.createElement("span");
          desc2.className = 'out-desc-2';
            desc2.textContent = appData.currentAd.desc2;
    
    // create ad box DOM structure
    adBox.append(headBox, urlBox, descBox);
      headBox.prepend(head1, head2, head3);
      urlBox.prepend(ad, path);
      descBox.prepend(pBox);
        pBox.prepend(desc1, desc2);
    
    return adBox;
  },
  appendAdBox: function() {
    let copyBtn, editBtn, deleteBtn, mainContainer;

    copyBtn = document.createElement("button");
    copyBtn.setAttribute('class', 'copy-btn');
    copyBtn.setAttribute('id', `copy-btn-${appData.currentAd.id}`);
    copyBtn.setAttribute('type', 'button');
    copyBtn.textContent = "Copy to clipboard";

    editBtn = document.createElement("button");
    editBtn.setAttribute('class', 'edit-btn');
    editBtn.setAttribute('id', `edit-btn-${appData.currentAd.id}`);
    editBtn.setAttribute('type', 'button');
    editBtn.textContent = "Edit";

    deleteBtn = document.createElement("button");
    deleteBtn.setAttribute('class', 'delete-btn');
    deleteBtn.setAttribute('id', `delete-btn-${appData.currentAd.id}`);
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.textContent = "Delete";

    mainContainer = document.querySelector('.right--bottom .ad-container');
    mainContainer.prepend(this.createAdBox(), editBtn, copyBtn, deleteBtn); // change .append/.prepend for ascending/descending order
  },
}




//All systems go!

//if there is data in localStorage run cachedAppData 
//else run createAddBlock
if(localStorage.allAdverts !== undefined && localStorage.allAdverts !== "") {
  try {
    appController.cachedData();
  }
  catch(e) {
    if(e instanceof SyntaxError) {
      localStorage.allAdverts = "";
      sessionStorage.removeItem('reloadImport');
      alert("Oops. Validate your JSON: https://jsonlint.com/");
    }
  }
  finally {
    appController.init();
  }  
} else {
  appController.init();  
}


////////// MEDIA < 1280px OVERLAY /////////////
const overlay = document.querySelector('.media-overlay');
const okButton = document.querySelector('.media-overlay-btn');

okButton.addEventListener('click', () => {overlay.style.visibility = "hidden"});


 
///////////* LOCAL STORAGE COPY *///////////

// [{"id":1,"url":"www.turbovezlys.lt","head1":"NEW AD 1 Turbovezlys","head2":"Starting from 49.48$ ","head3":"","pathMain":"www.example.com","path1":"","path2":"","desc1":"","desc2":""},{"id":6,"url":"www.new.ad","head1":"Nauja reklamike jau cia","head2":"Pirk drambli","head3":"","pathMain":"www.example.com","path1":"skanumelis","path2":"","desc1":"","desc2":""},{"id":7,"url":"www.adnumber4.info","head1":"Kruasentai po 5.40€","head2":"Fourth ad but second headline","head3":"","pathMain":"www.example.com","path1":"","path2":"","desc1":"Short text about fourth ad.","desc2":"Please buy something from me or at least call +370 670 45891."},{"id":10,"url":"www.kruansanas.bake","head1":"Chresesentai po 5.39€","head2":"Geriausi chresenai mieste","head3":"","pathMain":"www.example.com","path1":"","path2":"","desc1":"Short text about fourth ad.","desc2":"Please buy something from me or at least call +370 670 45891."}]





