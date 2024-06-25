
 const audioSources = [
            { title: 'INDILA',txt:'mini World', src: './photo/mm.mp3', sr:'./photo/2.jpg'},
            { title: 'In the Name of Love',txt:'Song by Bebe Rexha and Martin Garrix', src: './photo/msc.mp3', sr:'./photo/3.jpg' },
            { title: 'Audio 3', src: './photo/audio3.mp3' }
            // Add more audio sources as needed
        ];
       
        let progress=document.getElementById("prog");
        let song=document.getElementById("song");
        let cnt=document.getElementById("cnt");
        let left=document.getElementById("left");
        let img=document.getElementById("img");
        let name=document.getElementById("name");
        let text=document.getElementById("text");
        let newsong=document.getElementById("new");

        const getQueryParams = async () => {
            const params = new URLSearchParams(window.location.search);
            const term = params.get('song');
            
            if (!term) {
             console.error('No search term provided');
                    return;
            }

//             const url = `https://itunes.apple.com/search?term=${term}`;
//             try {
// const response = await fetch(url);
// const data = await response.json();
// const result = data.results[0]; // Assuming you want the first result
                 const url = `https://v1.nocodeapi.com/ankita3116/spotify/yfLnNOGMurwQNziF/search?q=${term}&type=track`;
              const requestOptions = {
             };
           const songContainer = document.getElementById('songs');

         try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log(data);
        const tracks = data.tracks.items[0]; 

      if (tracks) {
    text.innerHTML = tracks.artists[0].name;
    name.innerHTML = tracks.name;
    img.src = tracks.album.images[0].url;
    newsong.src = tracks.preview_url;
   // audio.controls = true;
    song.load();
    song.play();
    song.currentTime=progress.value;
    cnt.classList.remove("fa-play");
    cnt.classList.add("fa-pause");
} else {
    console.error('No results found');
}
            } catch (error) {
console.error('Request failed:', error);
            }
        };
        song.onloadedmetadata=function(){
            progress.max=song.duration;
            progress.value=song.currentTime;

        }
        function playPause(){
            if(cnt.classList.contains("fa-pause")){
cnt.classList.remove("fa-pause");
cnt.classList.add("fa-play");
song.pause();
            }
            else{
cnt.classList.remove("fa-play");
cnt.classList.add("fa-pause");
song.play();
            }
        }
        song.ontimeupdate = function() {
            progress.value = song.currentTime;
        }
        progress.onchange=function(){
            song.play();
            song.currentTime=progress.value;
            cnt.classList.remove("fa-play");
            cnt.classList.add("fa-pause");


        }
        let curr = 1;
        function leftt(){
            curr--;
           img.src=audioSources[curr].sr;
           name.textContent=audioSources[curr].title;
           text.textContent=audioSources[curr].txt;
           newsong.src=audioSources[curr].src;
           song.load();  // Load the new song source
            song.play();  // Start playing the new song
            cnt.classList.remove("fa-play");
            cnt.classList.add("fa-pause");

        }
        function right(){
            curr++;
            img.src=audioSources[curr].sr;
           name.textContent=audioSources[curr].title;
           text.textContent=audioSources[curr].txt;
           newsong.src=audioSources[curr].src;
           song.load();  // Load the new song source
            song.play();  // Start playing the new song
            cnt.classList.remove("fa-play");
            cnt.classList.add("fa-pause");
        }
        window.onload = getQueryParams;
        
