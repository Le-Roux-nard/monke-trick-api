import axios from "axios";

export const generateEmbed = (videoUrl: string, customTitle: string | null, pictureLink: string) => {
	let regex =
		/(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/;
	let regexResult = regex.exec(videoUrl) ?? undefined;
	let metadata;
	if (!!regexResult) {
		metadata = generateYoutubeMeta(regexResult[1], customTitle, pictureLink);
	} else {
		metadata = generateVideoMeta(videoUrl, pictureLink);
	}
	return `<!DOCTYPE html>
  <!--                                                                                                                                             
                    **       *        *  *                                
                  * ***      ********  *****    .                         
              .   **********  ****************  **                        
              .... ******* ************.************                       
              .......  ******* *****  **.  .** .*********  .*.             
              ........., .. **,        **.    .,*****. *,.....             
    **    ***  ..........********.       .*        *..........             
    ********.  ........... ,**                .............,.             
      ****.    ............,               ...............*,              
    ***********  .....              ...          .........*                
  **********, **...    ..   .    ......     .      ....,*                  
**       *****.   * ......................... .   ,     **,,,,.           
    **  ***. *      ............................                          
                    ...#@. ................ @%  ....           **          
                .....      ...............     ......    **               
                ......................................                     
                .........................................**,               
                ..........................................**               
                ................,,,,,, ...................,*,              
                .............. .,,,,,,..................,,,,,             
              (&. ................ ....................,,,...,.            
            /&&%###@&................................,,,,......            
          .#%##((&%@@&%.........................,,,,,.......              
          #&&#((#&#@@@@%@(...............,(&&#&&&/,.....                  
          &&#(((//&@&@@&@@@@@&@@@@@@&@@@@#&&@&*//,..                      
            ,((((%@@@@@&@@@@@@@&@@@@@&#%(((//*                             
            ,*((((((((#(&&&&%###%%##(((((/                                 
            ((((**(((((%#%%%%######(/                                     
              /(((//(((((######%%#%                                        
                //////((/((((((%
-->
<head>
  ${metadata}
  <meta http-equiv="refresh" content="0;url=${videoUrl}">;
</head>`;
};

const generateYoutubeMeta = (videoId: string, customTitle: string | null, pictureLink: string) => {
	return !!customTitle ? generateFakeYoutubeMeta(videoId, customTitle, pictureLink) : generateHiddenYoutubeMeta(videoId, pictureLink);
};

const generateFakeYoutubeMeta = (videoId: string, videoTitle: string, pictureLink: string) => {
	return `<meta property="og:url" content="https://www.youtube.com/watch?v=${videoId}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="twitter:card" content="summary_large_image">
    <meta content="YouTube" property="og:site_name">
    <meta content="${videoTitle}" property="og:title" />
    <meta content="https://www.youtube.com/watch?v=${videoId}" property="og:url" />
    <meta property="og:image" content="${pictureLink}">
    <meta name="theme-color" content="#FF0000">
    <meta property="og:type" content="video.other">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:url" content="https://www.youtube.com/embed/${videoId}">
    <meta property="og:video:width" content="1720">
    <meta property="og:video:height" content="1080">
    </head>`;
};

const generateHiddenYoutubeMeta = (videoId: string, pictureLink: string) => {
	return `
  <meta property="og:image" content="${pictureLink}">
  <meta property="og:type" content="video.other">
  <meta property="og:video:type" content="text/html">
  <meta property="og:video:url" content="https://www.youtube.com/embed/${videoId}">
  <meta property="og:video:width" content="1720">
  <meta property="og:video:height" content="1080">`;
};

const generateVideoMeta = (videoLink: string, pictureLink: string) => {
	return `<meta charset="UTF-8">
  <meta property="og:image" content="${pictureLink}">
  <meta property="og:type" content="video.other">
  <meta property="og:video:url" content="${videoLink}">
  <meta property="og:video:width" content="1720">
  <meta property="og:video:height" content="1080">`;
};
