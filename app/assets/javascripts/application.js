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
    
  }


  const buttons = document.querySelectorAll('.app-c-option-select__button');

  // Add a click event listener to each button
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // Get the parent div of the clicked button
      const parentDiv = button.closest('.app-c-option-select');

      // Check if a certain class exists on the parent div
      if (parentDiv && parentDiv.classList.contains('js-closed')) {
        // If it exists, change the class of the parent div
        parentDiv.classList.remove('js-closed');
        parentDiv.classList.add('js-opened');
      }else if (parentDiv && parentDiv.classList.contains('js-opened')) {
        // If it exists, change the class of the parent div
        parentDiv.classList.remove('js-opened');
        parentDiv.classList.add('js-closed');
      }

      // Toggle the "aria-expanded" attribute on the button
      const currentAriaExpanded = button.getAttribute('aria-expanded');
      const newAriaExpanded = currentAriaExpanded === 'true' ? 'false' : 'true';
      button.setAttribute('aria-expanded', newAriaExpanded);

    });
  });




})




