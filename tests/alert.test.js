describe("bootprompt.alert", function() {
  "use strict";

  var dialog;

  function find(selector) {
      return dialog.find(selector);
  }

  function text(selector) {
      return find(selector).text();
  }

  describe("basic usage tests", function() {
    describe("with no arguments", function() {
      function create() {
        bootprompt.alert();
      }

      it("throws an error", function() {
        expect(create).to.throw();
      });
    });

    describe("with one argument", function() {

      describe("where the argument is a string", function() {
        beforeEach(function() {
          dialog = bootprompt.alert("Hello world!");
        });

        it("applies the bootprompt-alert class to the dialog", function() {
          expect(dialog.hasClass("bootprompt-alert")).to.be.true;
        });

        it("shows the expected body copy", function() {
          expect(text(".bootprompt-body")).to.equal("Hello world!");
        });

        it("shows an OK button", function() {
          expect(text(".modal-footer button:first")).to.equal("OK");
        });

        it("applies the primary class to the button", function() {
          expect(find(".modal-footer button:first").hasClass("btn-primary")).to.be.true;
        });

        it("applies the bootprompt-accept class to the button", function() {
          expect(find(".modal-footer button:first").hasClass("bootprompt-accept")).to.be.true;
        });

        it("shows a close button inside the body", function() {
          expect(text(".modal-body button")).to.equal("×");
        });

        it("applies the close class to the close button", function() {
          expect(find(".modal-body button").hasClass("close")).to.be.true;
        });

        it("applies the correct aria-hidden attribute to the close button", function() {
          expect(find("button.close").attr("aria-hidden")).to.equal("true");
        });

        it("applies the correct class to the body", function() {
          expect($("body").hasClass("modal-open")).to.be.true;
        });
      });
    });

    describe("with two arguments", function() {
      describe("where the second argument is not a function", function() {
        function create() {
          bootprompt.alert("Hello world!", "not a callback");
        };

        it("throws an error requiring a callback", function() {
          expect(create).to.throw(/alert requires callback property to be a function when provided/);
        });
      });

      describe("where the second argument is a function", function() {
        function create() {
          self.dialog = bootprompt.alert("Hello world!", function() {});
        }

        it("does not throw an error", function() {
          expect(create).not.to.throw(Error);
        });
      });
    });
  });

  describe("configuration options tests", function() {
    var options;

    function create() {
      dialog = bootprompt.alert(options);
    }

    beforeEach(function() {
      options = {
        message: "Hello world",
        callback: function() {}
      };
    });

    describe("with a custom ok button", function() {
      var button;

      beforeEach(function() {
        options.buttons = {
          ok: {
            label: "Custom OK",
            className: "btn-danger"
          }
        };

        create();

        button = dialog.find(".btn:first");
      });

      it("adds the correct ok button", function() {
        expect(button.text()).to.equal("Custom OK");
        expect(button.hasClass("btn-danger")).to.be.true;
        expect(button.hasClass("bootprompt-accept")).to.be.true;
      });
    });

    describe("with an unrecognised button key", function() {
      beforeEach(function() {
        options.buttons = {
          "Another key": {
            label: "Custom OK",
            className: "btn-danger"
          }
        };
      });

      it("throws an error", function() {
        expect(create).to.throw('button key "Another key" is not allowed (options are ok)');
      });
    });

    describe("with a custom title", function() {
      beforeEach(function() {
        options.title = "Hello?";
        create();
      });

      it("shows the correct title", function() {
        expect(text(".modal-title")).to.equal("Hello?");
      });
    });
  });

  describe("callback tests", function() {
    var hidden;

    describe("with no callback", function() {
      beforeEach(function() {
        dialog = bootprompt.alert({
          message:"Hello!"
        });

        hidden = sinon.spy(dialog, "modal");
      });

      describe("when dismissing the dialog by clicking OK", function() {
        beforeEach(function() {
          dialog.find(".bootprompt-accept").trigger("click");
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when clicking the close button", function() {
        beforeEach(function() {
          dialog.find(".close").trigger("click");
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", function() {
        beforeEach(function() {
          dialog.trigger("escape.close.bb");
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    describe("with a simple callback", function() {
      var callback;

      beforeEach(function() {
        callback = sinon.spy();

        dialog = bootprompt.alert({
          message:"Hello!",
          callback: callback
        });

        hidden = sinon.spy(dialog, "modal");
      });

      describe("when dismissing the dialog by clicking OK", function() {
        beforeEach(function() {
          dialog.find(".bootprompt-accept").trigger("click");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when clicking the close button", function() {
        beforeEach(function() {
          dialog.find(".close").trigger("click");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", function() {
        beforeEach(function() {
          dialog.trigger("escape.close.bb");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    describe("with a callback which returns false", function() {
      var callback;
      beforeEach(function() {
        callback = sinon.stub();
        callback.returns(false);

        dialog = bootprompt.alert({
          message:"Hello!",
          callback: callback
        });

        hidden = sinon.spy(dialog, "modal");
      });

      describe("when dismissing the dialog by clicking OK", function() {
        beforeEach(function() {
          dialog.find(".bootprompt-accept").trigger("click");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when clicking the close button", function() {
        beforeEach(function() {
          dialog.find(".close").trigger("click");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when triggering the escape event", function() {
        beforeEach(function() {
          dialog.trigger("escape.close.bb");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
        });
      });
    });
  });
});
