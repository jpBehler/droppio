$(document).ready(function() {

  //Init pouchDB
  function Settings() {

    this.jsonified = [];
    this.notAllowed = ['notAllowed', 'jsonified', 'toJSON'];
    this.bloodType = false;
    this.name = false;
    this.lastname = false;
    this.dni = false;
    this.email = false;
    this.weight = false;
    this.birthDate = false;
    this.password = false;
    this.province = false;
    this.nearbyHospitals = false;
    this.toJSON = function() {

      this.jsonified = [];

      for (var prop in this) {

        if (this[prop] != undefined && this[prop] != "") {

          if (!this.notAllowed.includes(prop))
            this.jsonified[prop] = this[prop];

        }
      }

      return this.jsonified;
    };
  }

  var info = new Settings();

  function storePosition(position) {

    info.location = {
      'lat': position.coords.latitude,
      'lon': position.coords.longitude
    };

  }


  //Watch and store position in realtime
  navigator.geolocation.watchPosition(function(position) {

    storePosition(position);

  });


  $.post("/profile", {

    _xsrf: xsrf_token,
    type: "creds"

  }).done(function(data) {

    data = JSON.parse(data);

    respType = data['type'];

    if (respType == 'creds') {

      var dbUser = data['dbUser'];
      var dbPass = data['dbPass'];

      var settingsDB = new PouchDB("settings" + dbUser, {
        auto_compaction: true,
        cache: false,
        heartbeat: true
      });

      var remote_settingsDB = new PouchDB('https://' + dbUser + ':' + dbPass + '@alfredarg.com:6489/settings' + dbUser);

      var hospitalsDB = new PouchDB("hospitals", {
        auto_compaction: true,
        cache: false,
        heartbeat: true
      });

      var remote_hospitalsDB = new PouchDB('https://' + dbUser + ':' + dbPass + '@alfredarg.com:6489/hospitals');

      $("#saveSettings").submit(function(e) {

        e.preventDefault();

        info.name = $("#name").val();
        info.lastname = $("#lastname").val();
        info.bloodType = $("#bloodType").val();
        info.dni = $("#dni").val();
        info.email = $("#email").val();
        info.birthDate = $("#birthDate").val();
        info.weight = $("#weight").val();
        info.password = $("#password").val();
        info.radius = $("#radius").val();
        info.province = $("#province").val();

        hospitalsDB.find({
          selector: {
            province: info.province
          }
        }).then(function(result) {

          var nearEnough = [];
          var docs = 'docs' in result ? result.docs : false;
          var currentPosition = new google.maps.LatLng(info.location.lat, info.location.lon);

          if (docs) {

            for (var key in docs) {

              doc = docs[key];

              var hospitalPosition = new google.maps.LatLng(doc.location.lat, doc.location.lon);

              distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, hospitalPosition) / 1000;

              if (distance <= info.radius)
                nearEnough.push(doc.name);

            }

            info.nearbyHospitals = nearEnough;

          }

          elems = info.toJSON();
          keys = Object.keys(elems);
          console.log(keys);
          settingsDB.allDocs({
            include_docs: true,
            keys: keys
          }).then(function(res) {

            res.rows.forEach(function(row) {

              if ('error' in row) {

                settingsDB.put({
                  '_id': row.key,
                  'value': elems[row.key]
                }).catch(function(err) {
                  // Show some fancy warning :O
                });
                console.log(doc);

              } else {

                doc = row.doc;
                doc['value'] = elems[row.key];
                console.log(doc);
                settingsDB.put(doc).catch(function(err) {
                  // Show some fancy warning :O
                });
              }

            });

          }).catch(function(err) {
            // some paranormal shit happening here (show warning)
          });

        });





      });

      settingsDB.sync(remote_settingsDB, {

        live: true,
        retry: true,
        back_off_function: function(delay) {

          if (delay == 0) {

            return 1000;

          } else if (delay >= 1000 && delay < 1800000) {

            return delay * 1.5;

          } else if (delay >= 1800000) {

            return delay * 1.1;

          }

        }

      }).on('error', function(err) {
        //See you later terminator
      });


      hospitalsDB.sync(remote_hospitalsDB, {

        live: true,
        retry: true,
        back_off_function: function(delay) {

          if (delay == 0) {

            return 1000;

          } else if (delay >= 1000 && delay < 1800000) {

            return delay * 1.5;

          } else if (delay >= 1800000) {

            return delay * 1.1;

          }

        }

      }).on('error', function(err) {
        //See you later terminator
      });




    }

  });


  $('.datepicker').datepicker({
    selectMonths: true, // Creates a dropdown to control month
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    yearRange: 60,
    selectYears: 60, // Creates a dropdown of 15 years to control year,
    maxYear: 1999,
    today: 'Today',
    clear: false,
    close: 'Ok',
    closeOnSelect: false, // Close upon selecting a date
  });


  $('select').formSelect();

});