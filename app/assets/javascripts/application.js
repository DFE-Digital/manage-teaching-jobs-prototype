/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()


  if (window.location.href.indexOf("jobseekers") > -1) {
   
    var el = document.getElementsByTagName("*");
    var cnt = 0;
    for (var i = 0; i < el.length; i++) {
        if (el[i].className == 'app-list__item') cnt++;
    }

    $('#candidate-count').html(cnt);

    if(cnt == 0){
      $('#try-another-search').show();
    }

  }

  $("#clearfilters").click(function(){

    var inputs = document.querySelectorAll('.govuk-checkboxes__input');

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = false;
    }

    var theButton = document.getElementById("applyfilters");
    theButton.click(); 

  });


  function uncheckElements(){
    var uncheck=document.getElementsByTagName('input');
    
    for(var i=0;i<uncheck.length;i++){
        if(uncheck[i].type=='checkbox')
        {
        uncheck[i].checked=false;
        }
    }
  }


  // Check if an element with class 'email-message' exists
  var emailMessageDiv = document.querySelector('.email-message');
    
  // If the element exists, run the JavaScript code
  if (emailMessageDiv) {
      var htmlContent = emailMessageDiv.innerHTML;
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      var htmlWithLinks = htmlContent.replace(urlRegex, function(url) {
          return '<a href="' + url + '">' + url + '</a>';
      });
      emailMessageDiv.innerHTML = htmlWithLinks;
  } 



  if ($(".schoolSelecter")[0]){

    var selectEl = document.querySelector('.schoolSelecter')
    accessibleAutocomplete.enhanceSelectElement({
      autoselect: true,
      confirmOnBlur: true,
      defaultValue: "",
      minLength: 3,
      selectElement: selectEl
    })

    var queryStringParameters = window.location.search
    var previouslySubmitted = queryStringParameters.length > 0
    if (previouslySubmitted) {
      var submittedEl = document.querySelector('.submitted')
      submittedEl.classList.remove('submitted--hidden')
      var params = new URLSearchParams(document.location.search.split('?')[1])
      document.querySelector('.submitted__hide-school').innerHTML = params.get('hide-school')
    }

  }


})

