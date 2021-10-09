let tabcontent = document.getElementsByClassName("tabcontent");
let tablinks = document.getElementsByClassName("tablinks");


console.log(tabcontent," Clicked");

tablinks.forEach(tablink => {
  tablink.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("tab:",tab);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: openCity,
    });
  });
})

function openCity(evt, cityName) {
  console.log(cityName," Clicked");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

