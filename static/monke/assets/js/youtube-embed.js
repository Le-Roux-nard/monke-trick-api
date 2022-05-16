var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, playing = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtubeHolder", {
        width: 520,
        height: 350,
        playerVars: {
          controls: 1,
          loop: 1,
          disablekb: 1,
          iv_load_policy: 3,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: onPlayerReady,
        },
    });
}

function onPlayerReady(event) {
    player.stopVideo();
    player.clearVideo();
}