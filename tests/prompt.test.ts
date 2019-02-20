describe("bootprompt.prompt", () => {
  let $dialog: JQuery;

  before((done) => {
    reload(done);
  });

  before(() => {
    bootprompt.setDefaults("animate", false);
  });

  // basic tests
  describe("basic usage tests", () => {
    describe("with one argument", () => {
      describe("where the argument is not an object", () => {
        it("throws an error", () => {
          // tslint:disable-next-line:no-any
          expect(() => bootprompt.prompt("What is your name?" as any)).to
            .throw(/prompt requires a callback/);
        });
      });

      describe("where the argument is an object", () => {
        describe("with a title property", () => {
          it("throws an error requiring a callback", () => {
            expect(() => bootprompt.prompt({
              title: "What is your name?",
              // tslint:disable-next-line:no-any
            } as any)).to.throw(/prompt requires a callback/);
          });

          describe("and a callback property", () => {
            describe("where the callback is not a function", () => {
              it("throws an error requiring a callback", () => {
                expect(() => bootprompt.prompt({
                  title: "What is your name?",
                  callback: "Not a function",
                  // tslint:disable-next-line:no-any
                } as any)).to.throw(/prompt requires a callback/);
              });
            });
          });
        });

        describe("with a callback function", () => {
          it("throws an error requiring a title", () => {
            expect(() => bootprompt.prompt({
              callback: () => true,
              // tslint:disable-next-line:no-any
            } as any)).to.throw(/prompt requires a title/);
          });
        });

        describe("with a title and a callback", () => {
          let first: HTMLElement;
          let second: HTMLElement;

          before(() => {
            $dialog = bootprompt.prompt({
              callback: () => true,
              title: "What is your name?",
            });

            const buttons = ($dialog[0].getElementsByClassName("btn") as
                             HTMLCollectionOf<HTMLElement>);
            first = buttons[0];
            second = buttons[1];
          });

          it("creates a dialog object", () => {
            expect($dialog).to.be.an("object");
          });

          it("applies the bootprompt-prompt class to the dialog", () => {
            expect($dialog[0].classList.contains("bootprompt-prompt")).to.be
              .true;
          });

          it("adds the correct button labels", () => {
            expect(first).to.have.property("textContent").equal("Cancel");
            expect(second).to.have.property("textContent").equal("OK");
          });

          it("adds the correct button classes", () => {
            expect(first.classList.contains("btn-default")).to.be.true;
            expect(first.classList.contains("btn-secondary")).to.be.true;
            expect(first.classList.contains("bootprompt-cancel")).to.be.true;

            expect(second.classList.contains("btn-primary")).to.be.true;
            expect(second.classList.contains("bootprompt-accept")).to.be.true;
          });
        });
      });
    });

    describe("with two arguments", () => {
      describe("where the second argument is not a function", () => {
        it("throws an error requiring a callback", () => {
          expect(() => bootprompt.prompt("What is your name?",
                                         // tslint:disable-next-line:no-any
                                         "callback here" as any))
            .to.throw(/prompt requires a callback/);
        });
      });

      describe("where the second argument is a function", () => {
        let first: HTMLElement;
        let second: HTMLElement;

        before(() => {
          $dialog = bootprompt.prompt("What is your name?", () => true);

          const buttons = ($dialog[0].getElementsByClassName("btn") as
                           HTMLCollectionOf<HTMLElement>);
          first = buttons[0];
          second = buttons[1];
        });

        it("creates a dialog object", () => {
          expect($dialog).to.be.an("object");
        });

        it("adds the correct button labels", () => {
          expect(first).to.have.property("textContent").equal("Cancel");
          expect(second).to.have.property("textContent").equal("OK");
        });

        it("adds the correct button classes", () => {
          expect(first.classList.contains("btn-default")).to.be.true;
          expect(first.classList.contains("btn-secondary")).to.be.true;
          expect(first.classList.contains("bootprompt-cancel")).to.be.true;

          expect(second.classList.contains("btn-primary")).to.be.true;
          expect(second.classList.contains("bootprompt-accept")).to.be.true;
        });

        it("adds the expected dialog title", () => {
          expect(text($dialog, ".modal-title")).to.equal("What is your name?");
        });

        it("adds a close button", () => {
          expect(exists($dialog, ".modal-header .close")).to.be.true;
        });

        it("creates a form with a text input", () => {
          expect(exists($dialog, "form input[type=text]")).to.be.true;
        });

        it("with no default value", () => {
          expect($(find($dialog, "form input[type=text]")).val()).to.equal("");
        });

        it("shows the dialog", () => {
          expect($dialog.is(":visible")).to.be.true;
        });
      });
    });
  });

  // options
  describe("configuration options tests", () => {
    // custom cancel button
    describe("with a custom cancel button", () => {
      let button: HTMLElement;

      before(() => {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          buttons: {
            cancel: {
              label: "Custom cancel",
              className: "btn-danger",
            },
          },
        });
        button = $dialog[0].getElementsByClassName("btn")[0] as HTMLElement;
      });

      it("adds the correct cancel button", () => {
        expect(button.textContent).to.equal("Custom cancel");
        expect(button.classList.contains("btn-danger")).to.be.true;
      });
    });

    // custom confirm button
    describe("with a custom confirm button", () => {
      let button: HTMLElement;

      before(() => {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          buttons: {
            confirm: {
              label: "Custom confirm",
              className: "btn-warning",
            },
          },
        });
        button = $dialog[0].getElementsByClassName("btn")[1] as HTMLElement;
      });

      it("adds the correct confirm button", () => {
        expect(button.textContent).to.equal("Custom confirm");
        expect(button.classList.contains("btn-warning")).to.be.true;
      });
    });

    // unrecognised button key
    describe("with an unrecognised button key", () => {
      it("throws an error", () => {
        expect(() => bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          buttons: {
            prompt: {
              label: "Custom confirm",
              className: "btn-warning",
            },
          },
        })).to.throw(`button key "prompt" is not allowed (options are cancel \
confirm)`);
      });
    });

    // manual show
    describe("setting show to false", () => {
      let shown: sinon.SinonSpy;
      before(() => {
        shown = sinon.spy();
        sinon.stub(bootprompt, "dialog").callsFake(() => ({
          // tslint:disable-next-line:no-empty
          on: () => {},
          // tslint:disable-next-line:no-empty
          off: () => {},
          modal: shown,
        } as unknown as JQuery));

        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          show: false,
        });
      });

      after(() => {
        sinon.restore();
      });

      it("does not show the dialog", () => {
        expect(shown).not.to.have.been.called;
      });
    });

    // invalif prompt type
    describe("unknown input type", () => {
      it("throws an error", () => {
        expect(() => bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          // tslint:disable-next-line:no-any
          inputType: "foobar" as any,
        })).to.throw("Unknown input type: foobar");
      });
    });

    // text
    describe("setting inputType text", () => {
      function createDialog(opts: Partial<bootprompt.TextPromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "text",
          ...opts,
        });
      }

      describe("without default value", () => {
        before(() => {
          createDialog();
        });

        it("shows text input ", () => {
          expect(exists($dialog, "input[type='text']")).to.be.true;
        });

        it("has proper class", () => {
          const input = find($dialog, "input[type='text']");
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-text")).to.be.true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "John Smith",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='text']")).val())
            .to.equal("John Smith");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter your name",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "input[type='text']")).prop("placeholder"))
            .to.equal("enter your name");
        });
      });

      describe("with pattern", () => {
        before(() => {
          createDialog({
            pattern: "\d{1,2}/\d{1,2}/\d{4}",
          });
        });

        it("has correct pattern value", () => {
          expect($(find($dialog, "input[type='text']")).prop("pattern"))
            .to.equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });

      describe("with maxlength", () => {
        before(() => {
          createDialog({
            maxlength: 5,
          });
        });

        it("has correct maxlength value", () => {
          expect($(find($dialog, "input[type='text']")).prop("maxlength"))
            .to.equal(5);
        });
      });
    });

    // textarea
    describe("setting inputType textarea", () => {
      function createDialog(opts: Partial<bootprompt.TextPromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "textarea",
          ...opts,
        });
      }

      describe("without default value", () => {
        let textarea: HTMLElement;
        before(() => {
          createDialog();
          textarea =
            $dialog[0].getElementsByTagName("textarea")[0] as HTMLElement;
        });

        it("shows text input", () => {
          expect(textarea).to.not.be.undefined;
        });

        it("has proper class", () => {
          expect(textarea.classList.contains("bootprompt-input")).to.be.true;
          expect(textarea.classList.contains("bootprompt-input-textarea"))
            .to.be.true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "Once upon a time...",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "textarea")).val()).to
            .equal("Once upon a time...");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter your favorite fairy tale",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "textarea")).prop("placeholder"))
            .to.equal("enter your favorite fairy tale");
        });
      });
    });

    // email
    describe("setting inputType email", () => {
      function createDialog(opts: Partial<bootprompt.TextPromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "email",
          ...opts,
        });
      }
      describe("without default value", () => {
        let input: HTMLElement;
        before(() => {
          createDialog();
          input =
            $dialog[0].querySelector("input[type='email']") as HTMLElement;
        });

        it("shows email input", () => {
          expect(input).to.not.be.null;
        });

        it("has proper class", () => {
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-email")).to.be.true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "john@smith.com",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='email']")).val()).to
            .equal("john@smith.com");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter your email",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "input[type='email']")).prop("placeholder")).to
            .equal("enter your email");
        });
      });

      describe("with pattern", () => {
        before(() => {
          createDialog({
            pattern: "\d{1,2}/\d{1,2}/\d{4}",
          });
        });

        it("has correct pattern value", () => {
          expect($(find($dialog, "input[type='email']")).prop("pattern")).to
            .equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });
    });

    // password
    describe("setting inputType password", () => {
      function createDialog(opts: Partial<bootprompt.TextPromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "password",
          ...opts,
        });
      }

      describe("without default value", () => {
        let input: HTMLElement;

        before(() => {
          createDialog();
          input =
            $dialog[0].querySelector("input[type='password']") as HTMLElement;
        });

        it("shows password input", () => {
          expect(input).to.not.be.null;
        });

        it("has proper class", () => {
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-password")).to.be
            .true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "qwerty",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='password']")).val()).to
            .equal("qwerty");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter your password",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "input[type='password']")).prop("placeholder"))
            .to.equal("enter your password");
        });
      });
    });

    // select

    describe("setting inputType select", () => {
      function createBadDialog(opts: {} = {}): void {
        bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "select",
          ...opts,
          // tslint:disable-next-line:no-any
        } as any);
      }

      describe("without options", () => {
        it("throws an error", () => {
          expect(createBadDialog)
            .to.throw(/prompt with select requires at least one option value/);
        });
      });

      describe("with invalid options", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: "foo",
            // tslint:disable-next-line:no-any
          } as any)).to.throw("Please pass an array of input options");
        });
      });

      describe("with empty options", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [],
            // tslint:disable-next-line:no-any
          } as any))
            .to.throw(/prompt with select requires at least one option value/);
        });
      });

      describe("with options in the wrong format", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              foo: "bar",
            }],
            // tslint:disable-next-line:no-any
          } as any))
            .to.throw(`each option needs a "value" and a "text" property`);
        });
      });

      describe("with a value but no text", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              value: "bar",
            }],
          })).to.throw(`each option needs a "value" and a "text" property`);
        });
      });

      describe("with a number as value", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              value: 1,
              text: "morf",
            }],
          })).to.throw(`bootprompt does not allow numbers for "value" in \
inputOptions`);
        });
      });

      describe("with an invalid second options", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              value: "bar",
              text: "bar",
            }, {
              text: "foo",
            }],
          })).to.throw(`each option needs a "value" and a "text" property`);
        });
      });

      function createDialog(opts: Partial<bootprompt.SelectPromptOptions> &
                            { inputOptions: bootprompt.InputOption[] }):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "select",
          ...opts,
        });
      }

      describe("with valid options", () => {
        let select: HTMLElement;
        before(() => {
          createDialog({
            inputOptions: [{
              value: "1",
              text: "foo",
            }, {
              value: "2",
              text: "bar",
            }, {
              value: "3",
              text: "foobar",
            }],
          });

          select = $dialog[0].getElementsByTagName("select")[0] as HTMLElement;
        });

        it("shows select input", () => {
          expect(select).to.not.be.undefined;
        });

        it("has proper class", () => {
          expect(select.classList.contains("bootprompt-input")).to.be.true;
          expect(select.classList.contains("bootprompt-input-select")).to.be
            .true;
        });

        it("with three options", () => {
          expect($dialog[0].getElementsByTagName("option")).to.be.lengthOf(3);
        });
      });

      describe("with option groups", () => {
        let select: HTMLElement;
        before(() => {
          createDialog({
            inputOptions: [{
              value: "1",
              group: "foo",
              text: "foo",
            }, {
              value: "2",
              group: "bar",
              text: "bar",
            }, {
              value: "3",
              group: "foo",
              text: "foobar",
            }, {
              value: "4",
              group: "bar",
              text: "barfoo",
            }],
          });

          select = $dialog[0].getElementsByTagName("select")[0] as HTMLElement;
        });

        it("shows select input", () => {
          expect(select).to.not.be.undefined;
        });

        it("has proper class", () => {
          expect(select.classList.contains("bootprompt-input")).to.be.true;
          expect(select.classList.contains("bootprompt-input-select")).to.be
            .true;
        });

        it("with two option group", () => {
          expect($dialog[0].getElementsByTagName("optgroup")).to.be.lengthOf(2);
        });

        it("with four options", () => {
          expect($dialog[0].getElementsByTagName("option")).to.be.lengthOf(4);
        });
      });
    });

    // checkbox

    describe("setting inputType checkbox", () => {
      function createBadDialog(opts: {} = {}): void {
        bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "checkbox",
          ...opts,
          // tslint:disable-next-line:no-any
        } as any);
      }

      describe("without options", () => {
        it("throws an error", () => {
          expect(createBadDialog).to
            .throw(/prompt with checkbox requires options/);
        });
      });

      describe("with options in the wrong format", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              foo: "bar",
            }],
          })).to.throw(`each option needs a "value" and a "text" property`);
        });
      });

      function createDialog(opts: Partial<bootprompt.CheckboxPromptOptions> &
                            { inputOptions: bootprompt.InputOption[] }):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "checkbox",
          ...opts,
        });
      }

      describe("with options", () => {
        let checkboxes: NodeListOf<HTMLElement>;
        before(() => {
          createDialog({
            inputOptions: [{
              value: "1",
              text: "foo",
            }, {
              value: "2",
              text: "bar",
            }, {
              value: "3",
              text: "foobar",
            }],
          });

          checkboxes = $dialog[0].querySelectorAll("input[type='checkbox']");
        });

        it("with three checkboxes", () => {
          expect(checkboxes).to.be.lengthOf(3);
        });

        it("has proper class", () => {
          expect(checkboxes[0].classList.contains("bootprompt-input"))
            .to.be.true;
          expect(checkboxes[0].classList.contains("bootprompt-input-checkbox"))
            .to.be.true;
        });
      });
    });

    // radio

    describe("setting inputType radio", () => {
      function createBadDialog(opts: {} = {}): void {
        bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "radio",
          ...opts,
          // tslint:disable-next-line:no-any
        } as any);
      }

      describe("without options", () => {
        it("throws an error", () => {
          expect(createBadDialog)
            .to.throw(/prompt with radio requires options/);
        });
      });

      describe("with options in the wrong format", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              foo: "bar",
            }],
          })).to.throw(`each option needs a "value" and a "text" property`);
        });
      });

      function createDialog(opts: Partial<bootprompt.RadioPromptOptions> &
                            { inputOptions: bootprompt.InputOption[] }):
      void {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback: () => true,
          inputType: "radio",
          ...opts,
        });
      }

      describe("with options", () => {
        let radios: NodeListOf<HTMLElement>;

        before(() => {
          createDialog({
            inputOptions: [{
              value: "1",
              text: "foo",
            }, {
              value: "2",
              text: "bar",
            }, {
              value: "3",
              text: "foobar",
            }],
          });

          radios = $dialog[0].querySelectorAll("input[type='radio']");
        });

        it("with three radios", () => {
          expect(radios).to.be.lengthOf(3);
        });

        it("has proper class", () => {
          expect(radios[0].classList.contains("bootprompt-input")).to.be.true;
          expect(radios[0].classList.contains("bootprompt-input-radio"))
            .to.be.true;
        });

      });

      describe("with an invalid value", () => {
        it("throws an error", () => {
          expect(() => createBadDialog({
            inputOptions: [{
              value: "1",
              text: "foo",
            }, {
              value: "2",
              text: "bar",
            }, {
              value: "3",
              text: "foobar",
            }],
            value: ["2", "3"],
          })).to.throw(`prompt with radio requires a single, non-array value \
for "value".`);
        });
      });
    });

    // date

    describe("setting inputType date", () => {
      function createDialog(opts: Partial<bootprompt.DatePromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "Moo?",
          callback: () => true,
          inputType: "date",
          ...opts,
        });
      }

      describe("without default value", () => {
        let input: HTMLElement;
        before(() => {
          createDialog();
          input = $dialog[0].querySelector("input[type='date']") as HTMLElement;
        });

        it("shows date input ", () => {
          expect(input).to.not.be.null;
        });

        it("has proper class", () => {
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-date")).to.be.true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "2005-08-17",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='date']")).val())
            .to.equal("2005-08-17");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter the date",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "input[type='date']")).prop("placeholder"))
            .to.equal("enter the date");
        });
      });

      describe("with pattern", () => {
        before(() => {
          createDialog({
            pattern: "\d{1,2}/\d{1,2}/\d{4}",
          });
        });

        it("has correct pattern value", () => {
          expect($(find($dialog, "input[type='date']")).prop("pattern"))
            .to.equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });
    });

    // time

    describe("setting inputType time", () => {
      function createDialog(opts: Partial<bootprompt.TimePromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "Moo?",
          callback: () => true,
          inputType: "time",
          ...opts,
        });
      }

      describe("without default value", () => {
        let input: HTMLElement;
        before(() => {
          createDialog();

          input = $dialog[0].querySelector("input[type='time']") as HTMLElement;
        });

        it("shows time input", () => {
          expect(input).to.not.be.null;
        });

        it("has proper class", () => {
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-time")).to.be.true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "19:02",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='time']")).val()).to
            .equal("19:02");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter the time",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "input[type='time']")).prop("placeholder")).to
            .equal("enter the time");
        });
      });

      describe("with pattern", () => {
        before(() => {
          createDialog({
            pattern: "\d{1,2}/\d{1,2}/\d{4}",
          });
        });

        it("has correct pattern value", () => {
          expect($(find($dialog, "input[type='time']")).prop("pattern")).to
            .equal("\d{1,2}/\d{1,2}/\d{4}");
        });
      });

      describe("with min value", () => {
        before(() => {
          createDialog({
            min: "00:00:00",
          });
        });

        it("has correct min value", () => {
          expect($(find($dialog, "input[type='time']")).prop("min")).to
            .equal("00:00:00");
        });
      });

      describe("with max value", () => {
        before(() => {
          createDialog({
            max: "23:59:59",
          });
        });

        it("has correct max value", () => {
          expect($(find($dialog, "input[type='time']")).prop("max")).to
            .equal("23:59:59");
        });
      });

      describe("with step value", () => {
        before(() => {
          createDialog({
            step: "10",
          });
        });

        it("has correct step value", () => {
          expect($(find($dialog, "input[type='time']")).prop("step")).to
            .equal("10");
        });
      });

      describe("with an invalid min value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "a",
            max: "18:00:00",
          })).to.throw(`"min" is not a valid time. See \
https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html\
#form.data.time for more information.`);
        });
      });

      describe("with an invalid max value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "08:00:00",
            max: "a",
          })).to.throw(`"max" is not a valid time. See \
https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html\
#form.data.time for more information.`);
        });
      });

      describe("with min value greater than max value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "16:00:00",
            max: "12:00:00",
          })).to.throw(`"max" must be greater than "min". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for \
more information.`);
        });
      });

      describe("with an invalid step value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            step: "a",
          })).to.throw(`"step" must be a valid positive number or the value \
"any". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step for \
more information.`);
        });
      });
    });

    // number

    describe("setting inputType number", () => {
      function createDialog(opts:
                            Partial<bootprompt.NumericPromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "Moo?",
          callback: () => true,
          inputType: "number",
          ...opts,
        });
      }

      describe("without default value", () => {
        let input: HTMLElement;

        before(() => {
          createDialog();

          input =
            $dialog[0].querySelector("input[type='number']") as HTMLElement;
        });

        it("shows number input ", () => {
          expect(input).to.not.be.null;
        });

        it("has proper class", () => {
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-number")).to.be
            .true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "300",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='number']")).val()).to
            .equal("300");
        });
      });

      describe("with placeholder", () => {
        before(() => {
          createDialog({
            placeholder: "enter the number",
          });
        });

        it("has correct placeholder value", () => {
          expect($(find($dialog, "input[type='number']")).prop("placeholder"))
            .to.equal("enter the number");
        });
      });

      describe("with min value", () => {
        before(() => {
          createDialog({
            min: "0",
          });
        });

        it("has correct min value", () => {
          expect($(find($dialog, "input[type='number']")).prop("min")).to
            .equal("0");
        });
      });

      describe("with max value", () => {
        before(() => {
          createDialog({
            max: "100",
          });
        });

        it("has correct max value", () => {
          expect($(find($dialog, "input[type='number']")).prop("max")).to
            .equal("100");
        });
      });

      describe("with step value", () => {
        before(() => {
          createDialog({
            step: "10",
          });
        });

        it("has correct step value", () => {
          expect($(find($dialog, "input[type='number']")).prop("step")).to
            .equal("10");
        });
      });

      describe("with an number as value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            value: 1 as unknown as string,
          })).to.throw("bootprompt does not allow numbers as values");
        });
      });

      describe("with an invalid min value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "a",
            max: "50",
          })).to.throw(`"min" must be a valid number. See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min \
for more information.`);
        });
      });

      describe("with an invalid max value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "0",
            max: "a",
          })).to.throw(`"max" must be a valid number. See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-max \
for more information.`);
        });
      });

      describe("with min value greater than max value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "100",
            max: "50",
          })).to.throw(`"max" must be greater than "min". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min \
for more information.`);
        });
      });

      describe("with an invalid step value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            step: "a",
          })).to.throw(`"step" must be a valid positive number or the value \
"any". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step \
for more information.`);
        });
      });
    });

    // range

    describe("setting inputType range", () => {
      function createDialog(opts:
                            Partial<bootprompt.NumericPromptOptions> = {}):
      void {
        $dialog = bootprompt.prompt({
          title: "Moo?",
          callback: () => true,
          inputType: "range",
          ...opts,
        });
      }

      describe("without default value", () => {
        let input: HTMLElement;

        before(() => {
          createDialog();

          input =
            $dialog[0].querySelector("input[type='range']") as HTMLElement;
        });

        it("shows range input ", () => {
          expect(input).to.not.be.null;
        });

        it("has proper class", () => {
          expect(input.classList.contains("bootprompt-input")).to.be.true;
          expect(input.classList.contains("bootprompt-input-range")).to.be.true;
        });
      });

      describe("with default value", () => {
        before(() => {
          createDialog({
            value: "50",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='range']")).val()).to.equal("50");
        });
      });

      describe("with default value over the default 100 max", () => {
        // A range has a default max of 100. If the user sets an initial value
        // above this default, then the initial value will be clamped to 100.
        before(() => {
          createDialog({
            value: "300",
          });
        });

        it("has correct default value", () => {
          expect($(find($dialog, "input[type='range']")).val()).to.equal("100");
        });
      });

      describe("with min value", () => {
        before(() => {
          createDialog({
            min: "0",
          });
        });

        it("has correct min value", () => {
          expect($(find($dialog, "input[type='range']")).prop("min")).to
            .equal("0");
        });
      });

      describe("with max value", () => {
        before(() => {
          createDialog({
            max: "100",
          });
        });

        it("has correct max value", () => {
          expect($(find($dialog, "input[type='range']")).prop("max")).to
            .equal("100");
        });
      });

      describe("with step value", () => {
        before(() => {
          createDialog({
            step: "10",
          });
        });

        it("has correct step value", () => {
          expect($(find($dialog, "input[type='range']")).prop("step")).to
            .equal("10");
        });
      });

      describe("with an invalid min value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "a",
            max: "50",
          })).to.throw(`"min" must be a valid number. See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min \
for more information.`);
        });
      });

      describe("with an invalid max value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "0",
            max: "a",
          })).to.throw(`"max" must be a valid number. See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-max \
for more information.`);
        });
      });

      describe("with min value greater than max value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            min: "100",
            max: "50",
          })).to.throw(`"max" must be greater than "min". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min \
for more information.`);
        });
      });

      describe("with an invalid step value", () => {
        it("throws an error", () => {
          expect(() => createDialog({
            step: "a",
          })).to.throw(`"step" must be a valid positive number or the value \
"any". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step \
for more information.`);
        });
      });
    });
  });

  // callback tests

  describe("callback tests", () => {

    // simple callback
    describe("with a simple callback", () => {
      let callback: sinon.SinonSpy;
      let hidden: sinon.SinonSpy;

      function createDialog(): void {
        callback = sinon.spy();
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback,
        });
        hidden = sinon.spy($dialog, "modal");
      }

      describe("when entering no value in the text input", () => {
        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $(find($dialog, ".bootprompt-accept")).trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", () => {
          before(() => {
            createDialog();
            $(find($dialog, ".bootprompt-form")).trigger("submit");
          });

          it("invokes the callback with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });
      });

      describe("when entering a value in the text input", () => {
        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $(find($dialog, ".bootprompt-input")).val("Test input");
            $(find($dialog, ".bootprompt-accept")).trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("Test input");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", () => {
          before(() => {
            createDialog();
            $(find($dialog, ".bootprompt-input")).val("Test input");
            $(find($dialog, ".bootprompt-form")).trigger("submit");
          });

          it("invokes the callback with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("Test input");
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });
      });

      describe("when dismissing the dialog by clicking Cancel", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".bootprompt-cancel")).trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", () => {
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bb");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when dismissing dialog by clicking the close button", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".close")).trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    // callback which returns false

    describe("with a callback which returns false", () => {
      let callback: sinon.SinonStub;
      let hidden: sinon.SinonSpy;

      function createDialog(): void {
        callback = sinon.stub();
        callback.returns(false);
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          callback,
        });
        hidden = sinon.spy($dialog, "modal");
      }

      describe("when entering no value in the text input", () => {
        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $(find($dialog, ".bootprompt-accept")).trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should not hide the modal", () => {
            expect(hidden).not.to.have.been.called;
          });
        });
      });

      describe("when entering a value in the text input", () => {
        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-input").val("Test input");
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("Test input");
          });

          it("should not hide the modal", () => {
            expect(hidden).not.to.have.been.called;
          });
        });
      });

      describe("when dismissing the dialog by clicking Cancel", () => {
        before(() => {
          createDialog();
          $dialog.find(".bootprompt-cancel").trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when triggering the escape event", () => {
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bb");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when dismissing dialog by clicking the close button", () => {
        before(() => {
          createDialog();
          $dialog.find(".close").trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(null);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });
    });

    // default value

    describe("with a default value", () => {
      let callback: sinon.SinonSpy;

      function createDialog(): void {
        callback = sinon.spy();
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          value: "Bob",
          callback,
        });
      }

      before(() => {
        createDialog();
      });

      it("populates the input with the default value", () => {
        expect($dialog.find(".bootprompt-input").val()).to.equal("Bob");
      });

      describe("when entering no value in the text input", () => {
        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("Bob");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("when entering a value in the text input", () => {
        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-input").val("Alice");
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("Alice");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-input").val("Alice");
            $dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });
    });

    // placeholder

    describe("with a placeholder", () => {
      before(() => {
        $dialog = bootprompt.prompt({
          title: "What is your name?",
          placeholder: "e.g. Bob Smith",
          callback: () => true,
        });
      });

      it("populates the input with the placeholder attribute", () => {
        expect($dialog.find(".bootprompt-input").attr("placeholder")).to
          .equal("e.g. Bob Smith");
      });
    });

    // select

    describe("with inputType select", () => {
      describe("without a default value", () => {
        let callback: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.prompt({
            title: "What is your IDE?",
            callback: callback,
            inputType: "select",
            inputOptions: [{
              value: "#",
              text: "Choose one",
            }, {
              value: "1",
              text: "Vim",
            }, {
              value: "2",
              text: "Sublime Text",
            }, {
              value: "3",
              text: "WebStorm/PhpStorm",
            }, {
              value: "4",
              text: "Komodo IDE",
            }],
          });
        }

        before(() => {
          createDialog();
        });

        it("has correct number values in list", () => {
          expect($dialog[0].querySelectorAll(".bootprompt-input-select option"))
            .to.be.lengthOf(5);
        });

        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("#");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("with a default value", () => {
        let callback: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.prompt({
            title: "What is your IDE?",
            callback: callback,
            value: "1",
            inputType: "select",
            inputOptions: [{
              value: "#",
              text: "Choose one",
            }, {
              value: "1",
              text: "Vim",
            }, {
              value: "2",
              text: "Sublime Text",
            }, {
              value: "3",
              text: "WebStorm/PhpStorm",
            }, {
              value: "4",
              text: "Komodo IDE",
            }],
          });
        }

        before(() => {
          createDialog();
        });

        it("specified option is selected", () => {
          expect($dialog.find(".bootprompt-input-select").val()).to.equal("1");
        });

        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("1");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });

        describe("when changing selected option and dismissing with OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-input-select").val(3);
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("3");
          });
        });
      });
    });

    // email

    describe("with inputType email", () => {

      describe("without a default value", () => {
        let callback: sinon.SinonSpy;
        let hidden: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.prompt({
            title: "What is your email?",
            inputType: "email",
            callback,
          });
          hidden = sinon.spy($dialog, "modal");
        }

        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-form").trigger("submit");
          });

          it("invokes the callback with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when entering a value in the email input", () => {
          describe("when dismissing the dialog by clicking OK", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-input-email").val("john@smith.com");
              $dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it(`should pass the dialog as "this"`, () => {
              expect(callback.thisValues[0]).to.equal($dialog);
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly("john@smith.com");
            });
          });

          describe("when dismissing the dialog by clicking Cancel", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-input-email").val("john@smith.com");
              $dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });
        });
      });

      describe("with a default value", () => {
        let callback: sinon.SinonSpy;
        let hidden: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.prompt({
            title: "What is your email?",
            inputType: "email",
            value: "john@smith.com",
            callback,
          });
          hidden = sinon.spy($dialog, "modal");
        }

        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("john@smith.com");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when submitting the form", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-form").trigger("submit");
          });

          it("invokes the callback with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly("john@smith.com");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when changing a value in the email input", () => {
          describe("when dismissing the dialog by clicking OK", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-input-email").val("smith@john.com");
              $dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly("smith@john.com");
            });
          });

          describe("when dismissing the dialog by clicking Cancel", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-input-email").val("smith@john.com");
              $dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });
        });
      });
    });

    // checkbox

    describe("with input type checkbox", () => {

      describe("without a default value", () => {
        let callback: sinon.SinonSpy;
        let hidden: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.prompt({
            title: "What is your IDE?",
            inputType: "checkbox",
            inputOptions: [{
              value: "1",
              text: "Vim",
            }, {
              value: "2",
              text: "Sublime Text",
            }, {
              value: "3",
              text: "WebStorm/PhpStorm",
            }, {
              value: "4",
              text: "Komodo IDE",
            }],
            callback,
          });
          hidden = sinon.spy($dialog, "modal");
        }

        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it("with an undefined value", () => {
            expect(callback).to.have.been.calledWithExactly([]);
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("with default value", () => {
        describe("one value checked", () => {
          let callback: sinon.SinonSpy;

          function createDialog(): void {
            callback = sinon.spy();
            $dialog = bootprompt.prompt({
              title: "What is your IDE?",
              callback: callback,
              value: "2",
              inputType: "checkbox",
              inputOptions: [{
                value: "1",
                text: "Vim",
              }, {
                value: "2",
                text: "Sublime Text",
              }, {
                value: "3",
                text: "WebStorm/PhpStorm",
              }, {
                value: "4",
                text: "Komodo IDE",
              }],
            });
          }

          before(() => {
            createDialog();
          });

          it("specified checkbox is checked", () => {
            expect($dialog.find("input:checkbox:checked").val()).to.equal("2");
          });

          describe("when dismissing the dialog by clicking OK", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(["2"]);
            });
          });

          describe("when dismissing the dialog by clicking Cancel", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing checked options", () => {
            describe("and dismissing with Cancel", () => {
              before(() => {
                createDialog();
                $dialog.find("input:checkbox:checked").prop("checked", false);
                $dialog.find("input:checkbox[value=3]").prop("checked", true);
                $dialog.find(".bootprompt-cancel").trigger("click");
              });

              it("should invoke the callback", () => {
                expect(callback).to.have.been.called;
              });

              it("with the correct value", () => {
                expect(callback).to.have.been.calledWithExactly(null);
              });
            });

            describe("and dismissing with OK", () => {
              before(() => {
                createDialog();
                $dialog.find("input:checkbox:checked").prop("checked", false);
                $dialog.find("input:checkbox[value=3]").prop("checked", true);
                $dialog.find(".bootprompt-accept").trigger("click");
              });

              it("should invoke the callback", () => {
                expect(callback).to.have.been.called;
              });

              it("with the correct value", () => {
                expect(callback).to.have.been.calledWithExactly(["3"]);
              });
            });
          });
        });

        describe("multiple value checked", () => {
          let callback: sinon.SinonSpy;

          function createDialog(): void {
            callback = sinon.spy();
            $dialog = bootprompt.prompt({
              title: "What is your IDE?",
              callback: callback,
              value: ["2", "3"],
              inputType: "checkbox",
              inputOptions: [{
                value: "1",
                text: "Vim",
              }, {
                value: "2",
                text: "Sublime Text",
              }, {
                value: "3",
                text: "WebStorm/PhpStorm",
              }, {
                value: "4",
                text: "Komodo IDE",
              }],
            });
          }

          before(() => {
            createDialog();
          });

          it("specified checkboxes are checked", () => {
            const checked: string[] = [];
            $dialog.find("input:checkbox:checked").each((_, bar) => {
              checked.push($(bar).val() as string);
            });
            expect(checked).to.deep.equal(["2", "3"]);
          });

          describe("when dismissing the dialog by clicking OK", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(["2", "3"]);
            });
          });

          describe("when dismissing the dialog by clicking Cancel", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing checked options", () => {
            describe("and dismissing with Cancel", () => {
              before(() => {
                createDialog();
                $dialog.find("input:checkbox:checked").prop("checked", false);
                $dialog.find("input:checkbox[value=1]").prop("checked", true);
                $dialog.find("input:checkbox[value=4]").prop("checked", true);
                $dialog.find(".bootprompt-cancel").trigger("click");
              });

              it("should invoke the callback", () => {
                expect(callback).to.have.been.called;
              });

              it("with the correct value", () => {
                expect(callback).to.have.been.calledWithExactly(null);
              });
            });

            describe("and dismissing with OK", () => {
              before(() => {
                createDialog();
                $dialog.find("input:checkbox:checked").prop("checked", false);
                $dialog.find("input:checkbox[value=1]").prop("checked", true);
                $dialog.find("input:checkbox[value=4]").prop("checked", true);
                $dialog.find(".bootprompt-accept").trigger("click");
              });

              it("should invoke the callback", () => {
                expect(callback).to.have.been.called;
              });

              it("with the correct value", () => {
                expect(callback).to.have.been.calledWithExactly(["1", "4"]);
              });
            });
          });
        });
      });
    });

    // radio

    describe("with input type radio", () => {
      describe("without a default value", () => {
        let callback: sinon.SinonSpy;
        let hidden: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.prompt({
            title: "What is your IDE?",
            inputType: "radio",
            inputOptions: [{
              value: "1",
              text: "Vim",
            }, {
              value: "2",
              text: "Sublime Text",
            }, {
              value: "3",
              text: "WebStorm/PhpStorm",
            }, {
              value: "4",
              text: "Komodo IDE",
            }],
            callback,
          });
          hidden = sinon.spy($dialog, "modal");
        }

        describe("when dismissing the dialog by clicking OK", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-accept").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it("with the first option value", () => {
            expect(callback).to.have.been.calledWithExactly("1");
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });

        describe("when dismissing the dialog by clicking Cancel", () => {
          before(() => {
            createDialog();
            $dialog.find(".bootprompt-cancel").trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it("with the correct value", () => {
            expect(callback).to.have.been.calledWithExactly(null);
          });
        });
      });

      describe("with default value", () => {
        describe("one value checked", () => {
          let callback: sinon.SinonSpy;

          function createDialog(): void {
            callback = sinon.spy();
            $dialog = bootprompt.prompt({
              title: "What is your IDE?",
              callback: callback,
              value: "2",
              inputType: "radio",
              inputOptions: [{
                value: "1",
                text: "Vim",
              }, {
                value: "2",
                text: "Sublime Text",
              }, {
                value: "3",
                text: "WebStorm/PhpStorm",
              }, {
                value: "4",
                text: "Komodo IDE",
              }],
            });
          }

          before(() => {
            createDialog();
          });

          it("specified radio is checked", () => {
            expect($dialog.find("input:radio:checked").val()).to.equal("2");
          });

          describe("when dismissing the dialog by clicking OK", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-accept").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly("2");
            });
          });

          describe("when dismissing the dialog by clicking Cancel", () => {
            before(() => {
              createDialog();
              $dialog.find(".bootprompt-cancel").trigger("click");
            });

            it("should invoke the callback", () => {
              expect(callback).to.have.been.called;
            });

            it("with the correct value", () => {
              expect(callback).to.have.been.calledWithExactly(null);
            });
          });

          describe("when changing checked option", () => {
            describe("and dismissing with Cancel", () => {
              before(() => {
                createDialog();
                $dialog.find("input:radio[value=3]").prop("checked", true);
                $dialog.find(".bootprompt-cancel").trigger("click");
              });

              it("should invoke the callback", () => {
                expect(callback).to.have.been.called;
              });

              it("with the correct value", () => {
                expect(callback).to.have.been.calledWithExactly(null);
              });
            });

            describe("and dismissing with OK", () => {
              before(() => {
                createDialog();
                $dialog.find("input:radio[value=3]").prop("checked", true);
                $dialog.find(".bootprompt-accept").trigger("click");
              });

              it("should invoke the callback", () => {
                expect(callback).to.have.been.called;
              });

              it("with the correct value", () => {
                expect(callback).to.have.been.calledWithExactly("3");
              });
            });
          });
        });
      });
    });
  });
});
