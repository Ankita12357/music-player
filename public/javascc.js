
const updateTerm = async () => {
      const term = document.getElementById('searchTerm').value;
      if (!term || term === '') {
          alert('Please enter a search term');
      } else {
    const url = `https://v1.nocodeapi.com/ankita3116/spotify/yfLnNOGMurwQNziF/search?q=${term}&type=track`;
    const requestOptions = {
    };
    const songContainer = document.getElementById('songs');

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log(data);
        const tracks = data.tracks.items; 
    
     tracks.forEach(track => {
        // Create HTML elements
        const article = document.createElement('article'),
    artist = document.createElement('p'),
    songTitle = document.createElement('h4'),
    img = document.createElement('img'),
    audio = document.createElement('audio'),
    audioSource = document.createElement('source');

        // Set content
        // artist.innerHTML = data.artists.name;
        // songTitle.innerHTML = data.name;
        // img.src = data.artworkUrl100;
        // audioSource.src = data.previewUrl;
        // audio.controls = true;
        artist.innerHTML = track.artists[0].name;
        songTitle.innerHTML = track.name;
        img.src = track.album.images[0].url;
        audioSource.src = track.preview_url;
        audio.controls = true;

        // Add event listener to the image
        img.addEventListener('click', () => {
            //const songIndex = artists.findIndex(source => source.previewUrl === data.previewUrl);
           // const currentTime = song.currentTime;
            window.location.href = `index.html?song=${term}`;
        });

        // Append elements
        article.appendChild(img);
        article.appendChild(artist);
        article.appendChild(songTitle);
        article.appendChild(audio);

        audio.appendChild(audioSource);

        songContainer.appendChild(article);
           });
          } catch (error) {
            console.log('Error:', error);
            const resultsContainer = document.getElementById('results');
                resultsContainer.innerHTML = 'Failed to fetch data. Please try again later.';
          }
      }
        };

        const searchBtn = document.getElementById('searchTermBtn');
        searchBtn.addEventListener('click', updateTerm);
        const searchbox = document.getElementById('searchTerm');
        searchbox.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                updateTerm();
            }
            });
        document.addEventListener('play', event => {
      const audio = document.getElementsByTagName('audio');
      for (let i = 0; i < audio.length; i++) {
          if (audio[i] != event.target) {
             audio[i].pause();
          }
      }
        }, true);       
const bckk=document.getElementById("bckk");
let number=0;
function toggleInfoBlock() {
    const infoBlock = document.getElementById('info-block');
    if (infoBlock.style.display === 'none' || infoBlock.style.display === '') {
        infoBlock.style.display = 'block';
        const btn=document.getElementById('btn');
        btn.addEventListener('click',()=>{
         window.localStorage.clear();
         window.localStorage.setItem("loggedIn",false);
         window.location.href="2.html";

        });
        if(number==0)
        fetchUserDetails();
    } else {
        infoBlock.style.display = 'none';
    }
}
const userct=document.getElementById('userct');
function fetchUserDetails() {
    number=1;
fetch("http://localhost:3000/Userdetails", {
    method: "POST",
    crossDomain: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
        token: window.localStorage.getItem("token"),
    }),
})
.then((res) => res.json())
.then((data) => {
    if (data.status === "ok") {
        const inf=data.data;
        const userDetails = document.getElementById('userDetails');
        const emailElement = document.createElement('p');
        const nameElement = document.createElement('p');
        // const btn=document.createElement('button');
        // btn.className="btn";
        // btn.innerHTML="Log Out";
      //  btn.onclick="{btnclick()}";
        emailElement.innerHTML = `Email: ${inf.email}`;
      nameElement.innerHTML = `Name: ${inf.fname} ${inf.lname}`;
      userDetails.appendChild(nameElement);
        userDetails.appendChild(emailElement);
        userDetails.appendChild(btn);

    }else if(data.status==="error1"){
        //console.error("Failed to retrieve user details:", data);
        alert("Invalid Token login again");
        window.localStorage.clear();
         window.localStorage.setItem("loggedIn",false);
         window.location.href="2.html";

    }
     else {
        console.error("Failed to retrieve user details:", data);
        alert("Failed to retrieve user details.");
    }
})
.catch((error) => {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
});
}

    