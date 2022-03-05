/**
* PHP Email Form Validation - v3.2
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      // var data = {
      //   'name': $('#name').val(),
      //   'email': $('#email').val(),
      //   'contact': $('#contactNumber').val(),
      //   'message' : $('#message').val()
      // };

      // console.log(data)


      let thisForm = this;
      // console.log(this)
      // console.log(this.message)

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  // function php_email_form_submit(thisForm, action, formData) {
  
  //   $.ajax({ 
  //     url: 'forms/contactform.php', 
  //     data: data,
  //     type: 'POST',
  //     success: function (data) {
  //   // For Notification
  //         document.getElementById("sendMailForm").reset();
  //         var $alertDiv = $(".mailResponse");
  //         $alertDiv.show();
  //         $alertDiv.find('.alert').removeClass('alert-danger alert-success');
  //         $alertDiv.find('.mailResponseText').text("");
  //         if(data.error){
  //             $alertDiv.find('.alert').addClass('alert-danger');
  //             $alertDiv.find('.mailResponseText').text(data.message);
  //         }else{
  //             $alertDiv.find('.alert').addClass('alert-success');
  //             $alertDiv.find('.mailResponseText').text(data.message);
  //         }
  //     }
  // });
    //   var data = {
  //     'name': $('#name').val(),
  //     'email': $('#email').val(),
  //     'contact': $('#contactNumber').val(),
  //     'message' : $('#message').val()
  // };
  // console.log(data)

  // }
 function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.text()
      } else {
        // console.log("asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd")
        // console.log(response)
        console.log(action)
        // console.log(formData)

        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      console.log(error)

      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
