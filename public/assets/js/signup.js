$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $(".signup-signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var phoneInput  = $("input#phonenumber");
  function validatePhoneNumber(elementValue) {
    var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (phoneNumberPattern.test(elementValue) === true) {
      return elementValue;
    } 
  }

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("click", function(event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      phoneNumber: validatePhoneNumber(phoneInput.val().trim()),
      wantsTextNotification: $("input.exampleCheck1").val()
    };
    console.log(userData);
    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.phoneNumber, userData.wantsTextNotification);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If succesful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, phone, allowText) {
    $.post("/api/signup", {
      email: email,
      password: password, 
      phoneNumber: phone,
      wantsTextNotification: allowText
    })
      .then(function(data) {
        if(data === "success"){
          $.post("/api/login", {
            email: email,
            password: password
          }).then(function(data) { 
              window.location.replace(data);        
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          console.log(data)
          $(".msg").text(data.errors[0].message);
          $("#alert").fadeIn(500);
        }
        // If there's an error, handle it by throwing up a boostrap alert
      })
      .catch(handleLoginErr);
    }
// somehow the error not caught
function handleLoginErr(err) {
  $("#alert .msg").text(err.responseJSON);
  $("#alert").fadeIn(500);
}

});
