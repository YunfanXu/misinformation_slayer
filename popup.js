/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (
  // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
  window.screenLeft < 0 ||
  window.screenTop < 0 ||
  window.screenLeft > window.screen.width ||
  window.screenTop > window.screen.height
) {
  chrome.runtime.getPlatformInfo(function (info) {
    if (info.os === 'mac') {
      const fontFaceSheet = new CSSStyleSheet()
      fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `)
      fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `)
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        fontFaceSheet,
      ]
    }
  })
}


const tabcontent = document.getElementsByClassName("tabcontent");
const tablinks = document.getElementsByClassName("tablinks");
const submitButton = document.getElementById('submit_button');
const newsButton = document.getElementById('news_button');
const videoButton = document.getElementById('video_button');
const imageButton = document.getElementById('image_button');
const contentURL = document.getElementById("content_url");
const contentUpload = document.getElementById("content_upload");
const contentTitle = document.getElementById("content_title");
const contentContent = document.getElementById("content_content");
const actioner = document.getElementsByName("actioner");
const reportLabel = document.getElementsByName("reportLabel");
const queryResult = document.getElementById("query_result");
const selectContainer = document.getElementById("select_container");
const resultContainer = document.getElementById("result_container");
const fileInput = document.getElementById('file');
const preview = document.querySelector('img.preview');
var reader = new FileReader();

const tabButton = [newsButton, videoButton, imageButton];
const contentArray = [contentURL, contentTitle, contentContent, contentUpload];

let currentType = "news";
let actionType = "report";
let resultLabel = "real";

var bglog = function () {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: "bglog", obj: [...arguments] });
  }
}

function handleLoad() {
  preview.src = reader.result;
}

function handleSelected(e) {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    reader.addEventListener('load', handleLoad);
    reader.readAsDataURL(selectedFile);
  }

}


const submitVideo = (data) => {

}


// const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
//   const byteCharacters = atob(b64Data);
//   const byteArrays = [];

//   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     const slice = byteCharacters.slice(offset, offset + sliceSize);
//     const byteNumbers = new Array(slice.length);

//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }

//   const blob = new Blob(byteArrays, { type: contentType });

//   return blob;
// }  


const submitImage = () => {
  // const blob = b64toBlob(reader.result, 'image/png')
  chrome.runtime.sendMessage({
    type: "postImage",
    data: reader.result
  }, response => {
    response = JSON.parse(response);
    if (response != undefined && response.success) {
      if (actionType === "report") {
        alert("Submit Successfully!")
      } else {
        bglog("test Image Response:", response);
        // setResultArea(response);
      }
    }
    else {
      bglog("feched failed!")
    }
  });
}

const setResultArea = (response) => {
  queryResult.innerHTML = `
  <span class="result_elements">URL: ${response.domain.category}</span>
  <span class="result_elements">Title: ${response.title.decision}</span>
  <span class="result_elements">Content: ${response.content.decision}</span> `
}

const clearResultArea = () => {
  queryResult.innerHTML = "";
}

const submitNews = () => {
  let data = {
    currentType,
    actionType,
    resultLabel,
    url: document.getElementById("url").value,
    title: document.getElementById("title").value,
    content: document.getElementById("content").value
  }

  chrome.runtime.sendMessage({
    type: "postData",
    data
  }, response => {
    response = JSON.parse(response);
    if (response != undefined && response.success) {
      if (actionType === "report") {
        alert("Submit Successfully!")
      } else {
        bglog("popup", response);
        setResultArea(response);
      }
    }
    else {
      bglog("feched failed!")
    }
  });
}

const submitData = () => {
  switch (currentType) {
    case "news":
      submitNews();
      break;
    case "image":
      submitImage();
      break;
    case "video":
      submitVideo();
      break;
    default:
      bglog("error in submitdata");
  }

}

const setSubmitButton = () => {
  submitButton.addEventListener('click', e => {
    e.preventDefault();
    submitData();
  });
}

const clearActive = () => {
  tabButton.forEach(button => button.classList.remove("active"))
}

const setButtons = () => {
  tabButton.forEach(button => {
    button.addEventListener('click', (e) => {
      clearActive();
      clearResultArea();
      button.classList.add("active");
      currentType = button.textContent.toLowerCase();
      if (currentType === 'news') {
        showContent();
      } else {
        hiddenContent();
      }
    })
  })
}

const showContent = () => {
  contentArray.forEach((el, index) => {
    el.style.display = index === 3 ? "none" : "flex";
  })
}

const hiddenContent = () => {
  contentArray.forEach((el, index) => {
    el.style.display = index !== 3 ? "none" : "flex";
  })
}

const setActioner = () => {
  actioner.forEach(item => {
    item.addEventListener('click', (e) => {
      actionType = e.target.value;
      bglog("==actionType====", actionType);

      if (actionType === 'report') {
        selectContainer.style.zIndex = 2;
        resultContainer.style.zIndex = 1;
      } else {
        selectContainer.style.zIndex = 1;
        resultContainer.style.zIndex = 2;
      }
    });
  })
}

const setReportLabel = () => {
  reportLabel.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.checked) {
        resultLabel = e.target.value;
      }
    });
  })
}

const setEventListen = () => {
  setSubmitButton();
  setButtons();
  setActioner();
  setReportLabel();

}


const main = () => {
  setEventListen();
  fileInput.addEventListener('change', handleSelected);
}

main();