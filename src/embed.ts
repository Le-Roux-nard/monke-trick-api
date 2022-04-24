export const generateEmbed = async (youtubeVideoUrl : string, pictureLink : string) => {
	return `<!DOCTYPE html>
  <head>
  <meta property="og:type" content="video.other">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:width" content="900">
    <meta property="og:video:height" content="506">
    <meta property="og:video:url" content="https://youtube.com/embed/${youtubeVideoUrl}">
    <meta name="twitter:image" content="${pictureLink}">
    <meta http-equiv="refresh" content="0;url=https://youtube.com/watch?v=${youtubeVideoUrl}">
  </head>`;
};