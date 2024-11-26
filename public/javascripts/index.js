
function getLatestPost()
{
    fetch('/posts/getLatest')
    .then((response) => response.json())
    .then(resp => postToFrontEnd(resp))
}

var links = document.getElementsByTagName("a");

function postToFrontEnd(LatestPost)
{   
    const homePagePost = document.getElementById("HomePagePost");

    for(i = 0; i < LatestPost.length; i++)
    {
        const soloPost = document.createElement("div")
        soloPost.className = "userpost";

        const usernameProfileContainer = document.createElement("div");
        usernameProfileContainer.className = "usernameProfilePictureContainer";

        const profilePicture = document.createElement("img");
        profilePicture.className = "profilePicture";
        profilePicture.src = `/images/profile_pics/p${LatestPost[i].profilepicid}.jpg`
        profilePicture.setAttribute('width','100px')
        profilePicture.setAttribute('height','100px')

        const username = document.createElement("p");
        username.className = "username";
        username.innerHTML = LatestPost[i].displayname;

        usernameProfileContainer.append(profilePicture);
        usernameProfileContainer.append(username);

        const postContentContainer = document.createElement("div");
        postContentContainer.className = "postContent";

        if (LatestPost[i].currentPostImage !== null )
        {
            const postImage = document.createElement("img");
            postImage.src = LatestPost[i].currentPostImage;
            postImage.setAttribute('width','350px')
            postImage.setAttribute('height','150px')

            postContentContainer.append(postImage);
        }
        
        const postText = document.createElement("p");
        postText.className = "postText";
        let text = LatestPost[i].currentPostText;

        // Replace URLs with clickable links
        text = text.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>');
        postText.innerHTML = text;
        postText.addEventListener("click", function(event)
        {
            if (event.target instanceof HTMLAnchorElement)
                {
                    // Do something with the URL here 
                    if (confirm(`Please be cautious when visiting external sites.\n \nVisiting unfamiliar or untrusted websites can potentially lead to your data being stolen. Verify the websites trustworthiness using Google Safe Browsing Site Status.\n \nAre you sure you want to visit this site?\n${event.target}`) == false)
                    {
                        event.preventDefault();
                    };
                }
        });

        postContentContainer.append(postText);

        soloPost.append(usernameProfileContainer)
        soloPost.append(postContentContainer)


        homePagePost.append(soloPost) 
    }
}

getLatestPost()

document.getElementById("searchButton").addEventListener("click", function() {getPost()})
function getPost(){
    input = document.getElementById("search").value
    fetch('/posts/searchPosts/' + input)
    .then(response => response.json())
    .then(data => displaysearch(data))
    document.getElementById("HomePagePost").innerHTML = ``
}

function displaysearch(post){
    if (post.nopost === "no posts were found"){
        console.log(post.nopost)
        const homePagePost = document.getElementById("HomePagePost");
        const message = document.createElement("h1");
        message.innerHTML = "No posts were found relating to this search!!!!!!!!"
        const postContentContainer = document.createElement("div");
        postContentContainer.append(message);
        homePagePost.append(postContentContainer)
    }else{
        console.log("post were found")
        postToFrontEnd(post)
    }

}

// function createPosts(userPosts)
// {
    
//     for(i = 0; i < userPosts.length; i++)
//     {
//         createContentElements(userPosts, i, userPosts[i].postid);
//     }
    
// }


// function createContentElements(userPosts, postNumber, postid)
// {
//     const userPostsContainer = document.getElementById("HomePagePost");

//     const postContainer = document.createElement("div");
//     postContainer.className = "postContainer";
    
//     const dateContainer = document.createElement("div");
//     dateContainer.className = "dateContainer";
    


//     const date = document.createElement("p");
//     date.style.marginLeft = "5px";
//     date.innerHTML = "Created: " + userPosts[postNumber].date.split("T")[0];

//     const postButtonOptions = document.createElement("div");
//     postButtonOptions.className = "postButtonOptions";

//     dateContainer.append(date);
//     dateContainer.append(postButtonOptions);

//     const postContentContainer = document.createElement("div");
//     postContentContainer.className = "postContent";

//     if (userPosts[postNumber].image !== null)
//     {
//         const postImage = document.createElement("img");
//         postImage.src = userPosts[postNumber].image;
//         postImage.setAttribute('width','350px')
//         postImage.setAttribute('height','150px')

//         postContentContainer.append(postImage); 
//     }

//     const postText = document.createElement("p");
//     postText.className = "postText";
//     postText.innerHTML = userPosts[postNumber].text;

//     postContentContainer.append(postText);

//     postContainer.append(dateContainer);
//     postContainer.append(postContentContainer);

//     userPostsContainer.append(postContainer);
// }