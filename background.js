
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
        fetch("http://localhost:5000/queryImage", {
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
      break;
    case "postVideo":
      try {
        let videoData = message.data;
        videoData = videoData.replace("data:video/mp4;base64,", "");

        console.log("videoData", videoData);
        var formdata = new FormData();
        formdata.append("video", videoData)
        fetch("http://localhost:5000/queryVideo", {
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
      break;
    case "openRegisterPage":
      chrome.tabs.create({
        url: "http://localhost:8081/"
      })
  }
  return true;
});
