// document.getElementById("submitpost").addEventListener("click",function() {editThePost()})

// function editThePost(){
//     console.log("hello world")
//     let text = document.getElementById("text").value
//     var url = location.href
//     var url =  String(url)
//     var urlarray = url.split("/")
//     postid = urlarray[urlarray.length-1]
    

//     fetch("/posts/editpost/"+postid+"/"+text,{
//         method:'POST',
//         headers:{
//             'Content-type':'applications/json'
//         },
//         body:JSON.stringify({text,postid})

//     })
//     .then(location.href="/users/viewprofile")
//     .catch(err => console.log(err))

// }
document.getElementById("file").addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('post').src = window.URL.createObjectURL(file);
    }
});