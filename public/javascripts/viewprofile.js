
function deletePost(id){
    fetch("/posts/deletePost/" + id,{
        method:'DELETE',
        headers:{
            'Content-type':'applications/json'
        },
        body:JSON.stringify({id})

    })
    .catch(err => console.log(err))
    location.reload()
}




function getEditPostPage(id){
    fetch("/posts/editpost/" + id,{
        method:'GET',

    })
    .then(location.href = '/posts/editpost/'+ id)
    .catch(err => console.log(err))

}


async function fetchUserPosts()
{
    fetch('/users/viewUserPosts')
    .then((response) => response.json())
    .then(userPosts => createPosts(userPosts));
}

function createPosts(userPosts)
{
    
    for(i = 0; i < userPosts.length; i++)
    {
        createContentElements(userPosts, i, userPosts[i].postid);
    }
    
}

function createContentElements(userPosts, postNumber, postid)
{
    console.log(userPosts)
    const userPostsContainer = document.getElementById("userPosts");

    const postContainer = document.createElement("div");
    postContainer.className = "postContainer";
    
    const dateContainer = document.createElement("div");
    dateContainer.className = "dateContainer";

    const deletePostButton = document.createElement("button");
    deletePostButton.className = "deletePostButton";
    deletePostButton.type = "submit";
    deletePostButton.id = `${postid}`
    deletePostButton.addEventListener("click", function() {deletePost(postid)})
    
    const deletePostBtnImg = document.createElement("img");
    deletePostBtnImg.className = "deletePostBtnImg";
    deletePostBtnImg.src = "/images/bin.png";

    deletePostButton.append(deletePostBtnImg);

    const editPostButton = document.createElement("button");
    editPostButton.className = "editPostButton";
    editPostButton.style = "submit";
    editPostButton.id = `${postid}`
    editPostButton.addEventListener("click",function() {getEditPostPage(postid)})
    

    const editPostBtnImg = document.createElement("img");
    editPostBtnImg.className = "editPostBtnImg";
    editPostBtnImg.src = "/images/edit_logo.jpg";

    editPostButton.append(editPostBtnImg);
    
    const date = document.createElement("p");
    date.style.marginLeft = "5px";
    date.innerHTML = "Created: " + userPosts[postNumber].date.split("T")[0];

    const postButtonOptions = document.createElement("div");
    postButtonOptions.className = "postButtonOptions";

    postButtonOptions.append(editPostButton);
    postButtonOptions.append(deletePostButton);

    dateContainer.append(date);
    dateContainer.append(postButtonOptions);

    const postContentContainer = document.createElement("div");
    postContentContainer.className = "postContent";

    if (userPosts[postNumber].image !== null)
    {
        const postImage = document.createElement("img");
        postImage.src = userPosts[postNumber].image;
        //console.log(userPosts[i].image);
        postImage.setAttribute('width','350px')
        postImage.setAttribute('height','150px')

        postContentContainer.append(postImage); 
    }

    const postText = document.createElement("p");
    postText.className = "postText";
    let text = userPosts[postNumber].text;

    // Replace URLs with clickable links
    text = text.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>');
    console.log(text);
    postText.innerHTML = text;
    postText.addEventListener("click", function(event)
    {
        if (event.target instanceof HTMLAnchorElement)
            {
                // Do something with the URL here 
                if (confirm(`Please be cautious when visiting external sites.\n\nAre you sure you want to visit this site?\n${event.target}`) == false)
                {
                    event.preventDefault();
                };
            }
    });

    postContentContainer.append(postText);

    postContainer.append(dateContainer);
    postContainer.append(postContentContainer);

    userPostsContainer.append(postContainer);
}

fetchUserPosts();


document.getElementById("searchButton").addEventListener("click", function() {getPost()})
function getPost(){
    input = document.getElementById("search").value
    fetch('/posts/searchMyPosts/' + input)
    .then(response => response.json())
    .then(data => displaysearch(data))
    document.getElementById("userPosts").innerHTML = ``
}

function displaysearch(data){
    if (data.nopost === "no posts were found"){
        console.log(data.nopost)
        const homePagePost = document.getElementById("userPostsContainer");
        const message = document.createElement("h1");
        message.innerHTML = "No posts were found relating to this search!!!!!!!!"
        const postContentContainer = document.createElement("div");
        postContentContainer.append(message);
        homePagePost.append(postContentContainer)
    }else{
        console.log("post were found")
        createPosts(data)
    }

}

