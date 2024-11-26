function checkWebsiteHref()
{
    var pageLocation = window.location.pathname;
    // console.log(pageLocation);
    
    const regex = /\/posts\/editpost\/(.*)$/;
    const match = pageLocation.match(regex);

    if (
        pageLocation === "/users/login" || 
        pageLocation === "/users/signup" ||
        pageLocation === "/users/viewprofile" ||
        pageLocation === "/posts/createpost" ||
        pageLocation === "/posts/createPost" ||
        pageLocation === "/users/verify"
        )
    {
        var signInButton = document.getElementById("SignInButton");
        signInButton.parentElement.remove();
    }

    if 
    (
        pageLocation === "/users/login" ||
        pageLocation === "/users/signup" ||
        pageLocation === "/posts/createpost" ||
        pageLocation === "/posts/createPost" ||
        pageLocation === "/users/verify"
    )
    {
        var searchBar = document.getElementById("searchBar");
        searchBar.remove();
    }

    if (match)
    {
        var signInButton = document.getElementById("SignInButton");
        signInButton.parentElement.remove();
        
        var searchBar = document.getElementById("searchBar");
        searchBar.remove();
    }
}
checkWebsiteHref();

window.onscroll = function() {addStickyHeader()};

if (window.history.replaceState){
    window.history.replaceState(null,null,window.location.href)
}

var header = document.getElementById("header");
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function addStickyHeader() {
    if (window.scrollY > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
