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

  $(".copy-selected-emails").click(function(){

      var originalText = $(this).text(); // Get the original text
      $(this).text("emails copied"); // Change the button text

      // Set a timeout to revert the text back after 3 seconds
      setTimeout(() => {
          $(this).text(originalText);
      }, 2000);
  });

  $(".copy-email").click(function(){

    var originalText = $(this).text(); // Get the original text
    $(this).text("email copied"); // Change the button text

    // Set a timeout to revert the text back after 3 seconds
    setTimeout(() => {
        $(this).text(originalText);
    }, 2000);
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



  // Get the subject element
  const subjectInput = document.getElementById('subject');

  // Add an event listener for the 'input' event
  if (subjectInput) {
    subjectInput.addEventListener('input', function() {
      const subjectPreview = document.getElementById('email-subject');
      if (subjectPreview) {
        subjectPreview.textContent = subjectInput.value;
      }
    });
  }

  // Get the subject element
  const messageInput = document.getElementById('customise-message-1');

  if (messageInput) {

    // Add an event listener for the 'input' event
    messageInput.addEventListener('input', function() {
        // Show an alert with the current input value
        const messageField = document.getElementById('customise-message-1');
        const messagePreview = document.getElementById('email-body');
        messagePreview.textContent = messageField.value;
        
    });
  
  }


  // Get the checkbox and the div elements
  const checkbox = document.getElementById('save');
  const myDiv = document.getElementById('email-logo');

  if (checkbox) {

    // Add an event listener for the 'change' event
    checkbox.addEventListener('change', function() {
        // Check if the checkbox is checked
        if (checkbox.checked) {
            // Show the div
            myDiv.style.display = 'block';
        } else {
            // Hide the div
            myDiv.style.display = 'none';
        }
    });

  }

  //application view tabs show/hide application or interview details

  const showApplicationBtn = document.getElementById('show_application');
  const showInterviewBtn = document.getElementById('show_interview');
  const application = document.getElementById('application');
  const interview = document.getElementById('interview');

  showApplicationBtn.addEventListener('click', (e) => {

    e.preventDefault();
    application.style.display = 'block';
    interview.style.display = 'none';
    showApplicationBtn.setAttribute('aria-current', 'page');
    showInterviewBtn.removeAttribute('aria-current');
  });

  showInterviewBtn.addEventListener('click', (e) => {

    e.preventDefault();
    application.style.display = 'none';
    interview.style.display = 'block';
    showInterviewBtn.setAttribute('aria-current', 'page');
    showApplicationBtn.removeAttribute('aria-current');
  });





})




