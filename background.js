
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "bglog":
      console.log(...message.obj);
      break;
    case "postData":
      try {
        let { actionType, currentType, resultLabel, title, url, content } = message.data;
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
        fetch("http://localhost:8080/fakebox/check", {
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
      };
      break;
    case "postImage":
      try {
        let base64Img = message.data;
        base64Img = base64Img.replace("data:image/png;base64,", "");
        console.log("base64Img", base64Img);
        var formdata = new FormData();
        formdata.append("image", base64Img)
        // formdata.append("file", imageFile, "face2face1.png");
        fetch("http://localhost:5000/QueryImage", {
          method: 'POST',
          body: formdata
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
  return true;
});
