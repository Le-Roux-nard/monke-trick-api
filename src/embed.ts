export const generateEmbed = (videoUrl: string, pictureLink: string) => {
	let regex =
		/(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/;
	let regexResult = regex.exec(videoUrl) ?? undefined;
	let metadata;
	if (!!regexResult) {
		metadata = generateYoutubeMeta(regexResult[1], pictureLink);
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

const generateYoutubeMeta = (videoId: string, pictureLink: string) => {
	return `<meta property="og:url" content="https://www.youtube.com/watch?v=${videoId}">
	<meta property="og:image" content="${pictureLink}">
	<meta property="og:video:type" content="text/html">
	<meta property="og:video:url" content="https://www.youtube.com/embed/${videoId}">
	<meta property="og:video:width" content="900">
	<meta property="og:video:height" content="506">
	<meta property="og:type" content="video.other">`;
};

const generateVideoMeta = (videoLink: string, pictureLink: string) => {
	return `<meta charset="UTF-8">
  <meta property="og:image" content="${pictureLink}">
  <meta property="og:type" content="video.other">
  <meta property="og:video:url" content="${videoLink}">
  <meta property="og:video:width" content="900">
  <meta property="og:video:height" content="506">`;
};
