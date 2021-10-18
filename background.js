chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "bglog":
      console.log(...message.obj);
      break;
    case "postData":
      let { actionType, currentType, resultLabel, title, url, content } = message.data;
      if (currentType === 'news') {
        try {
          let data = {
            url,
            title,
            content
          };
          // var data = {
          //   url: "http://www.bbc.co.uk/news/world-asia-40909468",
          //   title: "North Korea: China urges Trump not to worsen situation",
          //   content: "China's President Xi Jinping has urged Donald Trump..."
          // }


          data = JSON.stringify(data);
          // send to the endpoint
          fetch("http://192.241.156.70:8080/fakebox/check", {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=utf-8'
            },
            body: data
          }).then(r => r.text())
            .then(response => {
              console.log("fetched", response);
              sendResponse(response);

            });
        } catch (error) {
          console.log("Error", error);
          return false;
        }
      }
  }
  return true;
});
