let tabcontent = document.getElementsByClassName("tabcontent");
let tablinks = document.getElementsByClassName("tablinks");
let submitButton = document.getElementById('submit_button');
let newsButton = document.getElementById('news_button');
let videoButton = document.getElementById('video_button');
let imageButton = document.getElementById('image_button');
let contentTitle = document.getElementById("content_title");
let contentContent = document.getElementById("content_content");
let actioner = document.getElementsByName("actioner");
let reportLabel = document.getElementsByName("reportLabel");
let queryResult = document.getElementById("query_result");
let selectContainer = document.getElementById("select_container");
let resultContainer = document.getElementById("result_container");

const tabButton = [newsButton, videoButton, imageButton];
let currentType = "news";
let actionType = "report";
let resultLabel = "real";

var bglog = function () {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: "bglog", obj: [...arguments] });
  }
}

const submitData = () => {
  let data = {
    currentType,
    actionType,
    resultLabel,
    url: document.getElementById("url").value,
    title: document.getElementById("title").value,
    content: document.getElementById("content").value
  }
  bglog("submit Button");

  chrome.runtime.sendMessage({
    type: "postData",
    data
  }, response => {
    response = JSON.parse(response);
    bglog("p1121212121opup", response);

    if (response != undefined && response.success) {
      bglog("popup", response);
      if (actionType === "report") {
        alert("Submit Successfully!")
      } else {
        queryResult.innerHTML = `url:${response.domain.category} \t Title:${response.title.decsion} \t Content:${response.content.decision} `
      }
    }
    else {
      bglog("feched failed!")
    }
  });
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
  contentTitle.style.visibility = "visible";
  contentContent.style.visibility = "visible";
}

const hiddenContent = () => {
  contentTitle.style.visibility = "collapse";
  contentContent.style.visibility = "collapse";
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
        bglog("======", resultLabel);
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

}

main();