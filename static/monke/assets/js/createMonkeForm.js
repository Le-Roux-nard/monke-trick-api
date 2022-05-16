document.getElementById("videoInput").addEventListener("change", async function () {
    if (this.value == "") return;
    var tmp_user_url = document.getElementById("videoInput").value;
    let videoHolder = document.getElementById("videoHolder");
    let videoTitle = document.getElementById("videoTitle");
    let youtubeRelatedComponents = document.querySelectorAll(".youtubeRelated");
    let regex = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/;
    let regexResult = regex.exec(tmp_user_url) ?? undefined;
    if (!!regexResult) {
        videoHolder.classList.add("hidden");
        youtubeRelatedComponents.forEach((component) => {
            component.classList.remove("hidden");
        });
        await player?.loadVideoById(regexResult[1]);
        let timestampRegex = /(?:&|\?)t=(\d{1,})/;
        let timestampResult = timestampRegex.exec(tmp_user_url) ?? undefined;
        videoHolder.src = ""
        if (!!timestampResult) {
            console.log("prout");
            setTimeout(() => {
                player?.seekTo(timestampResult[1], true);
            }, 750);
        }
    } else {
        videoHolder.classList.remove("hidden");
        youtubeRelatedComponents.forEach((component) => {
            component.classList.add("hidden");
        });
        videoTitle.value = null;
        videoHolder.src = tmp_user_url;
        player?.stopVideo();
        player?.clearVideo();
    }
});
document.getElementById("pictureInput").addEventListener("change", function () {
    var url = document.getElementById("pictureInput").value;
    let image = new Image();
    image.onload = () => {
        document.getElementById("imagePlaceholder").src = url;
    };

    image.onerror = () => {
        this.setAttribute("isValid", false);
        document.querySelector(".imagePlaceholder").src = "https://cdn.icon-icons.com/icons2/2367/PNG/512/file_error_icon_143598.png";
    };

    image.src = url;
});

function sendForm() {
    console.log("send form");
    const payload = {
        picture: document.getElementById("pictureInput").value,
        video: document.getElementById("videoInput").value,
        title: document.getElementById("videoTitle").value,
    };

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        console.log(this.responseText);
        try {
            const response = JSON.parse(this.responseText);
            if (response.shortUrl) {
                let resultInput = document.getElementById("result");
                resultInput.value = response.shortUrl;
                resultInput.placeholder = response.shortUrl;
            }
        } catch (e) {
            let div = document.createElement("div");
            div.classList.add("alert", "alert-danger");
            div.innerText = this.responseText;
            document.querySelector(".alerts").innerHTML = div.outerHTML;
        }
    };
    let baseUrl = document.querySelector("body").dataset.base_url;
    console.log(baseUrl);
    console.log(`${baseUrl}/create`);
    xhr.open("POST", `${baseUrl ?? ""}/create`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(payload));
}