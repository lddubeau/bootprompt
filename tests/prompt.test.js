describe("bootprompt.prompt", function () {
  var dialog;

  function find(selector) {
    return dialog.find(selector);
  }

  function text(selector) {
    return find(selector).text();
  }

  function exists(selector) {
    return find(selector).length !== 0;
  }

  beforeEach(function () {
    window.bootprompt = bootprompt.init();
  });

  // basic tests
  describe("basic usage tests", function () {
    describe("with one argument", function () {
      describe("where the argument is not an object", function () {
        function create() {
          bootprompt.prompt("What is your name?");
        }

        it("throws an error", function () {
          expect(create).to.throw(/prompt requires a callback/);
        });
      });

      describe("where the argument is an object", function () {
        var options;

        function create() {
          dialog = bootprompt.prompt(options);
        }

        beforeEach(function () {
          options = {};
        });

        describe("with a title property", function () {
          beforeEach(function () {
            options.title = "What is your name?";
          });

          it("throws an error requiring a callback", function () {
            expect(create).to.throw(/prompt requires a callback/);
          });

          describe("and a callback property", function () {
            describe("where the callback is not a function", function () {
              beforeEach(function () {
                options.callback = "Not a function";
              });

              it("throws an error requiring a callback", function () {
                expect(create).to.throw(/prompt requires a callback/);
              });
            });
          });
        });

        describe("with a callback function", function () {
          beforeEach(function () {
            options.callback = function () {
              return true;
            };
          });

          it("throws an error requiring a title", function () {
            expect(create).to.throw(/prompt requires a title/);
          });
        });

        describe("with a title and a callback", function () {
          beforeEach(function () {
            options = {
              callback: function () {
                return true;
              },
              title: "What is your name?"
            };
          });

          it("does not throw an error", function () {
            expect(create).not.to.throw(Error);
          });

          it("creates a dialog object", function () {
            expect(dialog).to.be.an("object");
          });

          it("applies the bootprompt-prompt class to the dialog", function () {
            expect(dialog.hasClass("bootprompt-prompt")).to.be.true;
          });

          it("adds the correct button labels", function () {
            expect(dialog.find(".btn:first").text()).to.equal("Cancel");
            expect(dialog.find(".btn:last").text()).to.equal("OK");
          });

          it("adds the correct button classes", function () {
            expect(dialog.find(".btn:first").hasClass("btn-default")).to.be.true;
            expect(dialog.find(".btn:first").hasClass("btn-secondary")).to.be.true;
            expect(dialog.find(".btn:first").hasClass("bootprompt-cancel")).to.be.true;

            expect(dialog.find(".btn:last").hasClass("btn-primary")).to.be.true;
            expect(dialog.find(".btn:last").hasClass("bootprompt-accept")).to.be.true;
          });
        });
      });
    });

    describe("with two arguments", function () {
      describe("where the second argument is not a function", function () {
        function create() {
          dialog = bootprompt.prompt("What is your name?", "callback here");
        }

        it("throws an error requiring a callback", function () {
          expect(create).to.throw(/prompt requires a callback/);
        });
      });

      describe("where the second argument is a function", function () {
        function create() {
          dialog = bootprompt.prompt("What is your name?", function () {
            return true;
          });
        }

        it("does not throw an error", function () {
          expect(create).not.to.throw(Error);
        });

        it("creates a dialog object", function () {
          expect(dialog).to.be.an("object");
        });

        it("adds the correct button labels", function () {
          expect(text(".btn:first")).to.equal("Cancel");
          expect(text(".btn:last")).to.equal("OK");
        });

        it("adds the correct button classes", function () {
          expect(dialog.find(".btn:first").hasClass("btn-default")).to.be.true;
          expect(dialog.find(".btn:first").hasClass("btn-secondary")).to.be.true;
          expect(dialog.find(".btn:first").hasClass("bootprompt-cancel")).to.be.true;

          expect(dialog.find(".btn:last").hasClass("btn-primary")).to.be.true;
          expect(dialog.find(".btn:last").hasClass("bootprompt-accept")).to.be.true;
        });

        it("adds the expected dialog title", function () {
          expect(text(".modal-title")).to.equal("What is your name?");
        });

        it("adds a close button", function () {
          expect(dialog.find(".modal-header .close")).to.be.ok;
        });

        it("creates a form with a text input", function () {
          expect(dialog.find("form input[type=text]")).to.be.ok;
        });

        it("with no default value", function () {
          expect(dialog.find("form input[type=text]").val()).to.equal("");
        });

        it("shows the dialog", function () {
          expect(dialog.is(":visible")).to.be.true;
        });
      });
    });
  });

  // options
  describe("configuration options tests", function () {
    var options;
    var button;

    function create() {
      dialog = bootprompt.prompt(options);
    }

    beforeEach(function () {
      options = {
        title: "What is your name?",
        callback: function () {
          return true;
        }
      };
    });

    // custom cancel button
    describe("with a custom cancel button", function () {
      beforeEach(function () {
        options.buttons = {
          cancel: {
            label: "Custom cancel",
            className: "btn-danger"
          }
        };
        create();
        button = dialog.find(".btn:first");
      });

      it("adds the correct cancel button", function () {
        expect(button.text()).to.equal("Custom cancel");
        expect(button.hasClass("btn-danger")).to.be.true;
      });
    });

    // custom confirm button
    describe("with a custom confirm button", function () {
      beforeEach(function () {
        options.buttons = {
          confirm: {
            label: "Custom confirm",
            className: "btn-warning"
          }
        };
        create();
        button = dialog.find(".btn:last");
      });

      it("adds the correct confirm button", function () {
        expect(button.text()).to.equal("Custom confirm");
        expect(button.hasClass("btn-warning")).to.be.true;
      });
    });

    // unrecognised button key
    describe("with an unrecognised button key", function () {
      beforeEach(function () {
        options.buttons = {
          prompt: {
            label: "Custom confirm",
            className: "btn-warning"
          }
        };
      });

      it("throws an error", function () {
        expect(create).to.throw('button key "prompt" is not allowed (options are cancel confirm)');
      });
    });

    // manual show
    describe("setting show to false", function () {
      var shown;
      beforeEach(function () {
        options.show = false;
        shown = sinon.spy();
        sinon.stub(bootprompt, "dialog").callsFake(function () {
          return {
            on: function () { },
            off: function () { },
            modal: shown
          };
        });
        create();
      });

      it("does not show the dialog", function () {
        expect(shown).not.to.have.been.called;
      });
    });

    // invalif prompt type
    describe("invalid prompt type", function () {
      beforeEach(function () {
        options.inputType = 'foobar';
      });

      it("throws an error", function () {
        expect(create).to.throw("Invalid prompt type");
      });
    });

    // text
    describe("setting inputType text", function () {
      beforeEach(function () {
        options.inputType = "text";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows text input ", function () {
          expect(exists("input[type='text']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='text']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='text']").hasClass("bootprompt-input-text")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "John Smith";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='text']").val()).to.equal("John Smith");
        });
      });

      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter your name";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("input[type='text']").prop("placeholder")).to.equal("enter your name");
        });
      });

      describe("with pattern", function () {
        beforeEach(function () {
          options.pattern = "\d{1,2}/\d{1,2}/\d{4}";
          create();
        });

        it("has correct pattern value", function () {
          expect(find("input[type='text']").prop("pattern")).to.equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });
      describe("with maxlength", function () {
        beforeEach(function () {
          options.maxlength = 5;
          create();
        });

        it("has correct maxlength value", function () {
          expect(find("input[type='text']").prop("maxlength")).to.equal(5);
        });
      });
    });

    // textarea
    describe("setting inputType textarea", function () {
      beforeEach(function () {
        options.inputType = "textarea";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows text input", function () {
          expect(exists("textarea")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("textarea").hasClass("bootprompt-input")).to.be.ok;
          expect(find("textarea").hasClass("bootprompt-input-textarea")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "Once upon a time...";
          create();
        });
        it("has correct default value", function () {
          expect(find("textarea").val()).to.equal("Once upon a time...");
        });
      });

      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter your favorite fairy tale";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("textarea").prop("placeholder")).to.equal("enter your favorite fairy tale");
        });
      });
    });

    // email
    describe("setting inputType email", function () {
      beforeEach(function () {
        options.inputType = "email";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows email input", function () {
          expect(exists("input[type='email']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='email']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='email']").hasClass("bootprompt-input-email")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "john@smith.com";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='email']").val()).to.equal("john@smith.com");
        });
      });
      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter your email";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("input[type='email']").prop("placeholder")).to.equal("enter your email");
        });
      });
      describe("with pattern", function () {
        beforeEach(function () {
          options.pattern = "\d{1,2}/\d{1,2}/\d{4}";
          create();
        });

        it("has correct pattern value", function () {
          expect(find("input[type='email']").prop("pattern")).to.equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });
    });

    // password
    describe("setting inputType password", function () {
      beforeEach(function () {
        options.inputType = "password";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows password input", function () {
          expect(exists("input[type='password']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='password']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='password']").hasClass("bootprompt-input-password")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "qwerty";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='password']").val()).to.equal("qwerty");
        });
      });

      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter your password";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("input[type='password']").prop("placeholder")).to.equal("enter your password");
        });
      });
    });

    // select

    describe("setting inputType select", function () {

      describe("without options", function () {
        beforeEach(function () {
          options.inputType = 'select';
        });

        it("throws an error", function () {
          expect(create).to.throw(/prompt with select requires at least one option value/);
        });
      });

      describe("with invalid options", function () {
        beforeEach(function () {
          options.inputType = 'select';
          options.inputOptions = 'foo';
        });

        it("throws an error", function () {
          expect(create).to.throw("Please pass an array of input options");
        });
      });

      describe("with empty options", function () {
        beforeEach(function () {
          options.inputType = 'select';
          options.inputOptions = [];
        });

        it("throws an error", function () {
          expect(create).to.throw(/prompt with select requires at least one option value/);
        });
      });

      describe("with options in the wrong format", function () {
        beforeEach(function () {
          options.inputType = "select";
          options.inputOptions = [
            {
              foo: "bar"
            }
          ];
        });

        it("throws an error", function () {
          expect(create).to.throw('each option needs a "value" and a "text" property');
        });
      });

      describe("with a value but no text", function () {
        beforeEach(function () {
          options.inputType = 'select';
          options.inputOptions = [
            {
              value: 'bar'
            }
          ];
        });

        it("throws an error", function () {
          expect(create).to.throw('each option needs a "value" and a "text" property');
        });
      });

      describe("with an invalid second options", function () {
        beforeEach(function () {
          options.inputType = 'select';
          options.inputOptions = [
            {
              value: "bar",
              text: "bar"
            }, {
              text: "foo"
            }
          ];
        });

        it("throws an error", function () {
          expect(create).to.throw('each option needs a "value" and a "text" property');
        });
      });

      describe("with valid options", function () {
        beforeEach(function () {
          options.inputType = "select";
          options.inputOptions = [
            {
              value: 1,
              text: 'foo'
            }, {
              value: 2,
              text: 'bar'
            }, {
              value: 3,
              text: 'foobar'
            }
          ];
          create();
        });

        it("shows select input", function () {
          expect(exists("select")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("select").hasClass("bootprompt-input")).to.be.ok;
          expect(find("select").hasClass("bootprompt-input-select")).to.be.ok;
        });

        it("with three options", function () {
          expect(find("option").length).to.equal(3);
        });
      });

      describe("with zero as the first option", function () {
        beforeEach(function () {
          options.inputType = "select";
          options.inputOptions = [
            {
              value: 0,
              text: "foo"
            }
          ];
          create();
        });

        it("shows the select input", function () {
          expect(exists("select")).to.be.ok;
        });
      });

      describe("with false as the first option", function () {
        beforeEach(function () {
          options.inputType = "select";
          options.inputOptions = [
            {
              value: false,
              text: "foo"
            }
          ];
          create();
        });

        it("shows the select input", function () {
          expect(exists("select")).to.be.ok;
        });
      });

      describe("with option groups", function () {
        beforeEach(function () {
          options.inputType = 'select';
          options.inputOptions = [
            {
              value: 1,
              group: 'foo',
              text: 'foo'
            }, {
              value: 2,
              group: 'bar',
              text: 'bar'
            }, {
              value: 3,
              group: 'foo',
              text: 'foobar'
            }, {
              value: 4,
              group: 'bar',
              text: 'barfoo'
            }
          ];
          create();
        });

        it("shows select input", function () {
          expect(exists("select")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("select").hasClass("bootprompt-input")).to.be.ok;
          expect(find("select").hasClass("bootprompt-input-select")).to.be.ok;
        });

        it("with two option group", function () {
          expect(find("optgroup").length).to.equal(2);
        });

        it("with four options", function () {
          expect(find("option").length).to.equal(4);
        });
      });
    });

    // checkbox

    describe("setting inputType checkbox", function () {

      describe("without options", function () {
        beforeEach(function () {
          options.inputType = 'checkbox';
        });

        it("throws an error", function () {
          expect(create).to.throw(/prompt with checkbox requires options/);
        });
      });

      describe("with options in the wrong format", function () {
        beforeEach(function () {
          options.inputType = "checkbox";
          options.inputOptions = [
            {
              foo: "bar"
            }
          ];
        });

        it("throws an error", function () {
          expect(create).to.throw('each option needs a "value" and a "text" property');
        });
      });

      describe("with options", function () {
        beforeEach(function () {
          options.inputType = 'checkbox';
          options.inputOptions = [
            {
              value: 1,
              text: 'foo'
            }, {
              value: 2,
              text: 'bar'
            }, {
              value: 3,
              text: 'foobar'
            }
          ];
          create();
        });

        it("shows checkbox input", function () {
          expect(exists("input[type='checkbox']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='checkbox']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='checkbox']").hasClass("bootprompt-input-checkbox")).to.be.ok;
        });

        it("with three checkboxes", function () {
          expect(find("input[type='checkbox']").length).to.equal(3);
        });
      });
    });

    // radio

    describe("setting inputType radio", function () {

      describe("without options", function () {
        beforeEach(function () {
          options.inputType = 'radio';
        });

        it("throws an error", function () {
          expect(create).to.throw(/prompt with radio requires options/);
        });
      });

      describe("with options in the wrong format", function () {
        beforeEach(function () {
          options.inputType = "radio";
          options.inputOptions = [
            {
              foo: "bar"
            }
          ];
        });

        it("throws an error", function () {
          expect(create).to.throw('each option needs a "value" and a "text" property');
        });
      });

      describe("with options", function () {
        beforeEach(function () {
          options.inputType = 'radio';
          options.inputOptions = [
            {
              value: 1,
              text: 'foo'
            }, {
              value: 2,
              text: 'bar'
            }, {
              value: 3,
              text: 'foobar'
            }
          ];
          create();
        });

        it("shows radio input", function () {
          expect(exists("input[type='radio']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='radio']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='radio']").hasClass("bootprompt-input-radio")).to.be.ok;
        });

        it("with three radios", function () {
          expect(find("input[type='radio']").length).to.equal(3);
        });
      });

      describe("with an invalid value", function () {
        beforeEach(function () {
          options.inputType = 'radio';
          options.inputOptions = [
            {
              value: 1,
              text: 'foo'
            }, {
              value: 2,
              text: 'bar'
            }, {
              value: 3,
              text: 'foobar'
            }
          ];
          options.value = [2,3];
        });

        it("throws an error", function () {
          expect(create).to.throw('prompt with radio requires a single, non-array value for "value".');
        });
      });
    });

    // date

    describe("setting inputType date", function () {
      beforeEach(function () {
        options.inputType = "date";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows date input ", function () {
          expect(exists("input[type='date']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='date']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='date']").hasClass("bootprompt-input-date")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "2005-08-17";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='date']").val()).to.equal("2005-08-17");
        });
      });

      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter the date";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("input[type='date']").prop("placeholder")).to.equal("enter the date");
        });
      });

      describe("with pattern", function () {
        beforeEach(function () {
          options.pattern = "\d{1,2}/\d{1,2}/\d{4}";
          create();
        });

        it("has correct pattern value", function () {
          expect(find("input[type='date']").prop("pattern")).to.equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });
    });

    // time

    describe("setting inputType time", function () {
      beforeEach(function () {
        options.inputType = "time";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows time input", function () {
          expect(exists("input[type='time']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='time']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='time']").hasClass("bootprompt-input-time")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "19:02";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='time']").val()).to.equal("19:02");
        });
      });

      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter the time";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("input[type='time']").prop("placeholder")).to.equal("enter the time");
        });
      });

      describe("with pattern", function () {
        beforeEach(function () {
          options.pattern = "\d{1,2}/\d{1,2}/\d{4}";
          create();
        });

        it("has correct pattern value", function () {
          expect(find("input[type='time']").prop("pattern")).to.equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });

      describe("with min value", function () {
        beforeEach(function () {
          options.min = '00:00:00';
          create();
        });

        it("has correct min value", function () {
          expect(find("input[type='time']").prop("min")).to.equal('00:00:00');
        });
      });

      describe("with max value", function () {
        beforeEach(function () {
          options.max = '23:59:59';
          create();
        });

        it("has correct max value", function () {
          expect(find("input[type='time']").prop("max")).to.equal('23:59:59');
        });
      });

      describe("with step value", function () {
        beforeEach(function () {
          options.step = 10;
          create();
        });

        it("has correct step value", function () {
          expect(find("input[type='time']").prop("step")).to.equal("10");
        });
      });


      describe("with an invalid min value", function () {
        beforeEach(function () {
          options.min = 'a';
          options.max = '18:00:00';
        });

        it("throws an error", function () {
          expect(create).to.throw('"min" is not a valid time. See https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html#form.data.time for more information.');
        });
      });

      describe("with an invalid max value", function () {
        beforeEach(function () {
          options.min = '08:00:00';
          options.max = 'a';
        });

        it("throws an error", function () {
          expect(create).to.throw('"max" is not a valid time. See https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html#form.data.time for more information.');
        });
      });

      describe("with min value greater than max value", function () {
        beforeEach(function () {
          options.min = '16:00:00';
          options.max = '12:00:00';
        });

        it("throws an error", function () {
          expect(create).to.throw('"max" must be greater than "min". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for more information.');
        });
      });

      describe("with an invalid step value", function () {
        beforeEach(function () {
          options.step = 'a';
        });

        it("throws an error", function () {
          expect(create).to.throw('"step" must be a valid positive number or the value "any". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step for more information.');
        });
      });
    });

    // number

    describe("setting inputType number", function () {
      beforeEach(function () {
        options.inputType = "number";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows number input ", function () {
          expect(exists("input[type='number']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='number']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='number']").hasClass("bootprompt-input-number")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "300";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='number']").val()).to.equal("300");
        });
      });

      describe("with placeholder", function () {
        beforeEach(function () {
          options.placeholder = "enter the number";
          create();
        });

        it("has correct placeholder value", function () {
          expect(find("input[type='number']").prop("placeholder")).to.equal("enter the number");
        });
      });

      describe("with min value", function () {
        beforeEach(function () {
          options.min = 0;
          create();
        });

        it("has correct min value", function () {
          expect(find("input[type='number']").prop("min")).to.equal("0");
        });
      });

      describe("with max value", function () {
        beforeEach(function () {
          options.max = 100;
          create();
        });

        it("has correct max value", function () {
          expect(find("input[type='number']").prop("max")).to.equal("100");
        });
      });

      describe("with step value", function () {
        beforeEach(function () {
          options.step = 10;
          create();
        });

        it("has correct step value", function () {
          expect(find("input[type='number']").prop("step")).to.equal("10");
        });
      });


      describe("with an invalid min value", function () {
        beforeEach(function () {
          options.min = 'a';
          options.max = 50;
        });

        it("throws an error", function () {
          expect(create).to.throw('"min" must be a valid number. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for more information.');
        });
      });

      describe("with an invalid max value", function () {
        beforeEach(function () {
          options.min = 0;
          options.max = 'a';
        });

        it("throws an error", function () {
          expect(create).to.throw('"max" must be a valid number. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-max for more information.');
        });
      });

      describe("with min value greater than max value", function () {
        beforeEach(function () {
          options.min = 100;
          options.max = 50;
        });

        it("throws an error", function () {
          expect(create).to.throw('"max" must be greater than "min". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for more information.');
        });
      });

      describe("with an invalid step value", function () {
        beforeEach(function () {
          options.step = 'a';
        });

        it("throws an error", function () {
          expect(create).to.throw('"step" must be a valid positive number or the value "any". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step for more information.');
        });
      });

    });


    // range

    describe("setting inputType range", function () {
      beforeEach(function () {
        options.inputType = "range";
      });

      describe("without default value", function () {
        beforeEach(function () {
          create();
        });

        it("shows range input ", function () {
          expect(exists("input[type='range']")).to.be.ok;
        });

        it("has proper class", function () {
          expect(find("input[type='range']").hasClass("bootprompt-input")).to.be.ok;
          expect(find("input[type='range']").hasClass("bootprompt-input-range")).to.be.ok;
        });
      });

      describe("with default value", function () {
        beforeEach(function () {
          options.value = "50";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='range']").val()).to.equal("50");
        });
      });

      describe("with default value over the default 100 max", function () {
        // A range has a default max of 100. If the user sets an initial value
        // above this default, then the initial value will be clamped to 100.
        beforeEach(function () {
          options.value = "300";
          create();
        });

        it("has correct default value", function () {
          expect(find("input[type='range']").val()).to.equal("100");
        });
      });

      describe("with min value", function () {
        beforeEach(function () {
          options.min = 0;
          create();
        });

        it("has correct min value", function () {
          expect(find("input[type='range']").prop("min")).to.equal("0");
        });
      });

      describe("with max value", function () {
        beforeEach(function () {
          options.max = 100;
          create();
        });

        it("has correct max value", function () {
          expect(find("input[type='range']").prop("max")).to.equal("100");
        });
      });

      describe("with step value", function () {
        beforeEach(function () {
          options.step = 10;
          create();
        });

        it("has correct step value", function () {
          expect(find("input[type='range']").prop("step")).to.equal("10");
        });
      });


      describe("with an invalid min value", function () {
        beforeEach(function () {
          options.min = 'a';
          options.max = 50;
        });

        it("throws an error", function () {
          expect(create).to.throw('"min" must be a valid number. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for more information.');
        });
      });

      describe("with an invalid max value", function () {
        beforeEach(function () {
          options.min = 0;
          options.max = 'a';
        });

        it("throws an error", function () {
          expect(create).to.throw('"max" must be a valid number. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-max for more information.');
        });
      });

      describe("with min value greater than max value", function () {
        beforeEach(function () {
          options.min = 100;
          options.max = 50;
        });

        it("throws an error", function () {
          expect(create).to.throw('"max" must be greater than "min". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for more information.');
        });
      });

      describe("with an invalid step value", function () {
        beforeEach(function () {
          options.step = 'a';
        });

        it("throws an error", function () {
          expect(create).to.throw('"step" must be a valid positive number or the value "any". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step for more information.');
        });
      });

    });
  });

  // callback tests

  describe("callback tests", function () {

    // simple callback

    describe("with a simple callback", function () {
      var callback;
      var hidden;

      beforeEach(function () {
        callback = sinon.spy();
        dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: callback
        });
        hidden = sinon.spy(dialog, "modal");
      });

      describe("when entering no value in the text input", function () {

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-form").trigger("submit");
          });

          it("invokes the callback with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });
      });

      describe("when entering a value in the text input", function () {
        beforeEach(function () {
          dialog.find(".bootprompt-input").val("Test input");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("Test input");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-form").trigger("submit");
          });

          it("invokes the callback with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("Test input");
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });
      });

      describe("when dismissing the dialog by clicking Cancel", function () {
        beforeEach(function () {
          dialog.find(".bootprompt-cancel").trigger("click");
        });

        it("should invoke the callback", function () {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function () {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function () {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should hide the modal", function () {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", function () {
        beforeEach(function () {
          dialog.trigger("escape.close.bb");
        });

        it("should invoke the callback", function () {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function () {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function () {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should hide the modal", function () {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when dismissing the dialog by clicking the close button", function () {
        beforeEach(function () {
          dialog.find(".close").trigger("click");
        });

        it("should invoke the callback", function () {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function () {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function () {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should hide the modal", function () {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    // callback which returns false

    describe("with a callback which returns false", function () {
      var callback;
      var hidden;

      beforeEach(function () {
        callback = sinon.stub();
        callback.returns(false);
        dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: callback
        });
        hidden = sinon.spy(dialog, "modal");
      });

      describe("when entering no value in the text input", function () {

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should not hide the modal", function () {
            expect(hidden).not.to.have.been.called;
          });
        });
      });

      describe("when entering a value in the text input", function () {
        beforeEach(function () {
          dialog.find(".bootprompt-input").val("Test input");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("Test input");
          });

          it("should not hide the modal", function () {
            expect(hidden).not.to.have.been.called;
          });
        });
      });

      describe("when dismissing the dialog by clicking Cancel", function () {
        beforeEach(function () {
          dialog.find(".bootprompt-cancel").trigger("click");
        });

        it("should invoke the callback", function () {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function () {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function () {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should not hide the modal", function () {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when triggering the escape event", function () {
        beforeEach(function () {
          dialog.trigger("escape.close.bb");
        });

        it("should invoke the callback", function () {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function () {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function () {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should not hide the modal", function () {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when dismissing the dialog by clicking the close button", function () {
        beforeEach(function () {
          dialog.find(".close").trigger("click");
        });

        it("should invoke the callback", function () {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function () {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function () {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should not hide the modal", function () {
          expect(hidden).not.to.have.been.called;
        });
      });
    });

    // default value

    describe("with a default value", function () {
      var callback;
      var hidden;

      beforeEach(function () {
        callback = sinon.spy();
        dialog = bootprompt.prompt({
          title: "What is your name?",
          value: "Bob",
          callback: callback
        });
        hidden = sinon.spy(dialog, "modal");
      });

      it("populates the input with the default value", function () {
        expect(dialog.find(".bootprompt-input").val()).to.equal("Bob");
      });

      describe("when entering no value in the text input", function () {

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("Bob");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("when entering a value in the text input", function () {
        beforeEach(function () {
          dialog.find(".bootprompt-input").val("Alice");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("Alice");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });
    });

    // placeholder

    describe("with a placeholder", function () {
      var callback;

      beforeEach(function () {
        callback = sinon.spy();
        dialog = bootprompt.prompt({
          title: "What is your name?",
          placeholder: "e.g. Bob Smith",
          callback: function () {
            return true;
          }
        });
      });

      it("populates the input with the placeholder attribute", function () {
        expect(dialog.find(".bootprompt-input").attr("placeholder")).to.equal("e.g. Bob Smith");
      });
    });

    // select

    describe("with inputType select", function () {

      describe("without a default value", function () {
        var callback;
        var hidden;

        beforeEach(function () {
          callback = sinon.spy();
          dialog = bootprompt.prompt({
            title: "What is your IDE?",
            callback: callback,
            inputType: "select",
            inputOptions: [
              {
                value: '#',
                text: 'Choose one'
              }, {
                value: 1,
                text: 'Vim'
              }, {
                value: 2,
                text: 'Sublime Text'
              }, {
                value: 3,
                text: 'WebStorm/PhpStorm'
              }, {
                value: 4,
                text: 'Komodo IDE'
              }
            ]
          });
          hidden = sinon.spy(dialog, "modal");
        });

        it("has correct number values in list", function () {
          expect(find(".bootprompt-input-select option").length).to.equal(5);
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("#");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("with a default value", function () {
        var callback;
        var hidden;

        beforeEach(function () {
          callback = sinon.spy();
          dialog = bootprompt.prompt({
            title: "What is your IDE?",
            callback: callback,
            value: 1,
            inputType: "select",
            inputOptions: [
              {
                value: '#',
                text: 'Choose one'
              }, {
                value: 1,
                text: 'Vim'
              }, {
                value: 2,
                text: 'Sublime Text'
              }, {
                value: 3,
                text: 'WebStorm/PhpStorm'
              }, {
                value: 4,
                text: 'Komodo IDE'
              }
            ]
          });
          hidden = sinon.spy(dialog, "modal");
        });

        it("specified option is selected", function () {
          expect(dialog.find(".bootprompt-input-select").val()).to.equal("1");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("1");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });

        describe("when changing the selected option and dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-input-select").val(3);
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("3");
          });
        });
      });
    });

    // email

    describe("with inputType email", function () {

      describe("without a default value", function () {
        var callback;
        var hidden;

        beforeEach(function () {
          callback = sinon.spy();
          dialog = bootprompt.prompt({
            title: "What is your email?",
            inputType: "email",
            callback: callback
          });
          hidden = sinon.spy(dialog, "modal");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function () {
            expect(callback.thisValues[0]).to.equal(dialog);
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-form").trigger("submit");
          });

          it("invokes the callback with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when entering a value in the email input", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-input-email").val("john@smith.com");
          });

          describe("when dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it('should pass the dialog as "this"', function () {
              expect(callback.thisValues[0]).to.equal(dialog);
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly("john@smith.com");
            });
          });

          describe("when dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });
        });
      });

      describe("with a default value", function () {
        var callback;
        var hidden;

        beforeEach(function () {
          callback = sinon.spy();
          dialog = bootprompt.prompt({
            title: "What is your email?",
            inputType: "email",
            value: "john@smith.com",
            callback: callback
          });
          hidden = sinon.spy(dialog, "modal");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("john@smith.com");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-form").trigger("submit");
          });

          it("invokes the callback with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly("john@smith.com");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when changing a value in the email input", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-input-email").val("smith@john.com");
          });

          describe("when dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly("smith@john.com");
            });
          });

          describe("when dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });
        });
      });
    });

    // checkbox

    describe("with input type checkbox", function () {

      describe("without a default value", function () {
        var callback;
        var hidden;

        beforeEach(function () {
          callback = sinon.spy();
          dialog = bootprompt.prompt({
            title: "What is your IDE?",
            inputType: 'checkbox',
            inputOptions: [
              {
                value: 1,
                text: 'Vim'
              }, {
                value: 2,
                text: 'Sublime Text'
              }, {
                value: 3,
                text: 'WebStorm/PhpStorm'
              }, {
                value: 4,
                text: 'Komodo IDE'
              }
            ],
            callback: callback
          });
          hidden = sinon.spy(dialog, "modal");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it("with an undefined value", function () {
            expect(callback).to.have.been.calledWithExactly([]);
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("with default value", function () {

        describe("one value checked", function () {
          var callback;
          var hidden;

          beforeEach(function () {
            callback = sinon.spy();
            dialog = bootprompt.prompt({
              title: "What is your IDE?",
              callback: callback,
              value: 2,
              inputType: "checkbox",
              inputOptions: [
                {
                  value: 1,
                  text: 'Vim'
                }, {
                  value: 2,
                  text: 'Sublime Text'
                }, {
                  value: 3,
                  text: 'WebStorm/PhpStorm'
                }, {
                  value: 4,
                  text: 'Komodo IDE'
                }
              ]
            });
            hidden = sinon.spy(dialog, "modal");
          });

          it("specified checkbox is checked", function () {
            expect(dialog.find("input:checkbox:checked").val()).to.equal("2");
          });

          describe("when dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(["2"]);
            });
          });

          describe("when dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing the checked option and dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find("input:checkbox:checked").prop('checked', false);
              dialog.find("input:checkbox[value=3]").prop('checked', true);
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing the selected option and dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find("input:checkbox:checked").prop('checked', false);
              dialog.find("input:checkbox[value=3]").prop('checked', true);
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(["3"]);
            });
          });
        });

        describe("multiple value checked", function () {
          var callback;
          var hidden;

          beforeEach(function () {
            callback = sinon.spy();
            dialog = bootprompt.prompt({
              title: "What is your IDE?",
              callback: callback,
              value: [2, 3],
              inputType: "checkbox",
              inputOptions: [
                {
                  value: 1,
                  text: 'Vim'
                }, {
                  value: 2,
                  text: 'Sublime Text'
                }, {
                  value: 3,
                  text: 'WebStorm/PhpStorm'
                }, {
                  value: 4,
                  text: 'Komodo IDE'
                }
              ]
            });
            hidden = sinon.spy(dialog, "modal");
          });

          it("specified checkboxes are checked", function () {
            var checked;
            checked = [];
            dialog.find("input:checkbox:checked").each(function (foo, bar) {
              checked.push($(bar).val());
            });
            expect(checked).to.deep.equal(["2", "3"]);
          });

          describe("when dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(["2", "3"]);
            });
          });

          describe("when dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing the checked options and dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find("input:checkbox:checked").prop('checked', false);
              dialog.find("input:checkbox[value=1]").prop('checked', true);
              dialog.find("input:checkbox[value=4]").prop('checked', true);
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing the checked options and dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find("input:checkbox:checked").prop('checked', false);
              dialog.find("input:checkbox[value=1]").prop('checked', true);
              dialog.find("input:checkbox[value=4]").prop('checked', true);
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(["1", "4"]);
            });
          });
        });
      });
    });

    // radio

    describe("with input type radio", function () {

      describe("without a default value", function () {
        var callback;
        var hidden;

        beforeEach(function () {
          callback = sinon.spy();
          dialog = bootprompt.prompt({
            title: "What is your IDE?",
            inputType: 'radio',
            inputOptions: [
              {
                value: 1,
                text: 'Vim'
              }, {
                value: 2,
                text: 'Sublime Text'
              }, {
                value: 3,
                text: 'WebStorm/PhpStorm'
              }, {
                value: 4,
                text: 'Komodo IDE'
              }
            ],
            callback: callback
          });
          hidden = sinon.spy(dialog, "modal");
        });

        describe("when dismissing the dialog by clicking OK", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it("with the first option value", function () {
            expect(callback).to.have.been.calledWithExactly("1");
          });

          it("should hide the modal", function () {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", function () {
          beforeEach(function () {
            dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", function () {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", function () {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("with default value", function () {

        describe("one value checked", function () {
          var callback;
          var hidden;

          beforeEach(function () {
            callback = sinon.spy();
            dialog = bootprompt.prompt({
              title: "What is your IDE?",
              callback: callback,
              value: 2,
              inputType: "radio",
              inputOptions: [
                {
                  value: 1,
                  text: 'Vim'
                }, {
                  value: 2,
                  text: 'Sublime Text'
                }, {
                  value: 3,
                  text: 'WebStorm/PhpStorm'
                }, {
                  value: 4,
                  text: 'Komodo IDE'
                }
              ]
            });
            hidden = sinon.spy(dialog, "modal");
          });

          it("specified radio is checked", function () {
            expect(dialog.find("input:radio:checked").val()).to.equal("2");
          });

          describe("when dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly("2");
            });
          });

          describe("when dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing the checked option and dismissing the dialog by clicking Cancel", function () {
            beforeEach(function () {
              dialog.find("input:radio[value=3]").prop('checked', true);
              dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing the selected option and dismissing the dialog by clicking OK", function () {
            beforeEach(function () {
              dialog.find("input:radio[value=3]").prop('checked', true);
              dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", function () {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", function () {
              expect(callback).to.have.been.calledWithExactly("3");
            });
          });
        });
      });
    });
  });
});
