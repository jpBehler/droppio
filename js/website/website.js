// init
$(document).ready(function() {
  $('select').formSelect();
  $('.parallax').parallax();
  $('.collapsible').collapsible();
  $('.collapsible').on('click', function() {
    $(this).find('.material-icons').first().toggleClass('rotate180');
  });
  $('.checkbox').click('input[checkbox]', function() {
    $('.modal').modal();
  });
  $('#register').find('button').click(function(e) {
    e.preventDefault();
    console.log('gut');
    var data = {};
    data._id = 'config';
    data.name = $('#name').val();
    data.lastname = $('#lastname').val();
    data.bloodType = $('#bloodType').val();
    var bloodTypeForm = $('#bloodType').val();;
    data.dni = $('#dni').val();
    data.email = $('#email').val();
    data.phone = $('#phone').val();
    console.log('alles gut');
    switch (bloodTypeForm) {
      case 1:
        bloodTypeForm = "A+";
        break;
      case 2:
        bloodTypeForm = "B+";
        break;
      case 3:
        bloodTypeForm = "AB+";
        break;
      case 4:
        bloodTypeForm = "O+";
        break;
      case 5:
        bloodTypeForm = "A-";
        break;
      case 6:
        bloodTypeForm = "B-";
        break;
      case 7:
        bloodTypeForm = "AB-";
        break;
      case 8:
        bloodTypeForm = "O-";
        break;
    };
    $('#confirmSignUp').find('#confirmText').html('<p><b>Nombre:</b> ' + data.name + '</p>' + '<p><b>Apellido:</b> ' + data.lastname + '</p>' + '<p><b>Tipo de Sangre:</b> ' + data.bloodTypeForm + '</p>' + '<p><b>Dni:</b> ' + data.dni + '</p>' + '<p><b>Email:</b> ' + data.email + '</p>' + '<p><b>Telefono:</b> ' + data.phone + '</p>');
    $('#confirmationButton').on('click', function() {
      registerDB.post(data).then(function(result) {
        //Escribio en la DB local con exito (la replicacion es automatica)
      }).catch(function(err) {
        //Algo raro paso al guardar en la DB local
      });
    });
  });
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function() {
        window.location.hash = hash;
      });
    }
  });

});
