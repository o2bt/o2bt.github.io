/*
 *
 *  Module to load video data into index.html
 *
 */

/******************* PLAYLISTS *******************/

var channelId = "UCLYzHN7dXszH5Qzj2BvZjrg";

$(document).ready(function() {
    updateSeries();
});

// Retrieve JSON url for channel
function dataFromId(id) {
    return "https://gdata.youtube.com/feeds/api/users/" + id + "/playlists?v=2&alt=json"
}


// Update series sidebar with playlist titles {ASYNC}
function updateSeries() {
    var channelAPI = dataFromId(channelId);
    var plistIds = {};
    var sidebar = document.getElementById('seriesbar');
    $.getJSON("https://gdata.youtube.com/feeds/api/users/" + channelId + "/playlists?v=2&alt=json", function(data){
        for (var i in data.feed.entry){
            if (i <= 7) { /* only have 7 playlists in sidebar */
                console.log(data.feed.entry[i].yt$playlistId.$t);

                var plistItem = document.createElement("li");
                plistItem.id = "series";
                if (i == 0) {
                    plistItem.className = "active";
                }
                plistItem.innerHTML = "<a href='#'>" + data.feed.entry[i].title.$t + "</a>";
                sidebar.appendChild(plistItem);
            }
        }

    });
}

/***************** VIDEO PLAYER *****************/
/* script to update playlist upon selection */

// player in DOM
var player = document.getElementById('player').children[0];
updatePlaylist(0);


// Update current playlist by clicking on sidebar
$("#seriesbar").on('click', '#series', function() {
    $(this).parent().children().each(function() {
        $(this).removeClass("active");
    });
    $(this).addClass("active");
    var plistindex = $("li").index(this) - 2; /**** li index off by 2 ***/
    console.log(plistindex);
    updatePlaylist(plistindex);
});

function updatePlaylist(selectedIndex) {
    var plists =  document.getElementById('seriesbar');
    $.getJSON("https://gdata.youtube.com/feeds/api/users/" + channelId + "/playlists?v=2&alt=json", function(data){
        player.src = "http://www.youtube.com/embed/videoseries?list=" + data.feed.entry[selectedIndex].yt$playlistId.$t;
        var seriesTitle = document.getElementById('series-name');
        seriesTitle.innerHTML = data.feed.entry[selectedIndex].title.$t;
        var seriesInfo = document.getElementById('series-info');
        seriesInfo.innerHTML = data.feed.entry[selectedIndex].summary.$t;
    })
}

// The API calls this function when the player's state changes.
/*
var ytplayer;
function onYouTubeIframeAPIReady() {
  ytplayer = new YT.Player('player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
    var url = player.getVideoUrl();
    var ytAPI = dataFromId(idFromUrl(url)[1]);

    // update title
    $.getJSON(ytAPI, function(data){
        document.getElementById('tut-name').innerHTML = data.data.title;
    });
}
*/

// Retrieve video id
function idFromUrl(url) {
    return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
}

// Retrieve video title using gdata
function dataFromId(id) {
    return "http://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=jsonc";
}
