describe("bootshine.dialog", function() {
  var dialog;
  function find(s) {
    return dialog.find(s);
  }

  function exists(s) {
    return find(s).length !== 0;
  }

  function text(s) {
    return find(s).text();
  }

  function hasClass(s, c) {
    return find(s).hasClass(c);
  }

  describe("invalid usage tests", function() {
    describe("with no arguments", function() {
      function create() {
        bootshine.dialog();
      }

      it("throws an error", function() {
        expect(create).to.throw(/supply an object/);
      });
    });

    describe("with one argument", function() {
      describe("where the argument is not an object", function() {
        function create() {
          bootshine.dialog("test");
        }

        it("throws an error", function() {
          expect(create).to.throw(/supply an object/);
        });
      });

      describe("where the argument has no message property", function() {
        function create() {
          bootshine.dialog({
            invalid: "options"
          });
        }

        it("throws an error", function() {
          expect(create).to.throw(/specify a message/);
        });
      });

      describe("where the argument has a button with an invalid value", function() {
        function create() {
          bootshine.dialog({
            message: "test",
            buttons: {
              ok: "foo"
            }
          });
        }

        it("throws an error", function() {
          expect(create).to.throw(/button with key "ok" must be an object/);
        });
      });
    });
  });
  describe("when creating a minimal dialog", function() {
    beforeEach(function() {
      dialog = bootshine.dialog({
        message: "test"
      });
    });

    it("adds the bootshine class to the dialog", function() {
      expect(dialog.hasClass("bootshine")).to.be.true;
    });

    it("adds the bootstrap modal class to the dialog", function() {
      expect(dialog.hasClass("modal")).to.be.true;
    });

    it("adds the fade class to the dialog", function() {
      expect(dialog.hasClass("fade")).to.be.true;
    });

    it("shows the expected message", function() {
      expect(text(".bootshine-body")).to.equal("test");
    });

    it("does not have a header", function() {
      expect(exists(".modal-header")).not.to.be.ok;
    });

    it("has a close button inside the body", function() {
      expect(exists(".modal-body .close")).to.be.ok;
    });

    it("does not have a footer", function() {
      expect(exists(".modal-footer")).not.to.be.ok;
    });

    xit("has a backdrop", function() {
      expect(dialog.children(".modal-backdrop").length).to.equal(1);
    });
  });

  describe("when creating a dialog with a button", function() {
    function create(button) {
      if (button == null) {
        button = {};
      }

      dialog = bootshine.dialog({
        message: "test",
        buttons: {
          one: button
        }
      });
    }

    describe("when the button has no callback", function() {
      beforeEach(function() {
        create({
          label: "My Label"
        });
        hidden = sinon.spy(dialog, "modal");
      });

      it("shows a footer", function() {
        expect(exists(".modal-footer")).to.be.ok;
      });

      it("shows one button", function() {
        expect(find(".btn").length).to.equal(1);
      });

      it("shows the correct button text", function() {
        expect(text(".btn")).to.equal("My Label");
      });

      it("applies the correct button class", function() {
        expect(hasClass(".btn", "btn-primary")).to.be.true;
      });

      describe("when triggering the escape event", function() {
        beforeEach(function() {
          dialog.trigger("escape.close.bb");
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
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
    });
    describe("when the button has a label and callback", function() {
      var callback;

      beforeEach(function() {
        callback = sinon.spy();
        create({
          label: "Another Label",
          callback: callback
        });
        hidden = sinon.spy(dialog, "modal");
      });

      it("shows a footer", function() {
        expect(exists(".modal-footer")).to.be.ok;
      });

      it("shows the correct button text", function() {
        expect(text(".btn")).to.equal("Another Label");
      });

      describe("when dismissing the dialog by clicking OK", function() {
        beforeEach(function() {
          dialog.find(".btn-primary").trigger("click");
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

        it("should not invoke the callback", function() {
          expect(callback).not.to.have.been.called;
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when clicking the close button", function() {
        beforeEach(function() {
          dialog.find(".close").trigger("click");
        });

        it("should not invoke the callback", function() {
          expect(callback).not.to.have.been.called;
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.called;
        });
      });
    });

    describe("when the button has a custom class", function() {
      beforeEach(function() {
        create({
          label: "Test Label",
          className: "btn-custom"
        });
      });

      it("shows the correct button text", function() {
        expect(text(".btn")).to.equal("Test Label");
      });

      it("adds the custom class to the button", function() {
        expect(hasClass(".btn", "btn-custom")).to.be.true;
      });
    });

    describe("when the button has no explicit label", function() {
      function create(buttons) {
        dialog = bootshine.dialog({
            message: "test",
            buttons: buttons
        });
      }

      describe("when its value is an object", function() {
        beforeEach(function() {
          create({
            "Short form": {
              className: "btn-custom",
              callback: function() {
                return true;
              }
            }
          });
        });

        it("uses the key name as the button text", function() {
          expect(text(".btn")).to.equal("Short form");
        });

        it("adds the custom class to the button", function() {
          expect(hasClass(".btn", "btn-custom")).to.be.true;
        });
      });

      describe("when its value is a function", function() {
        var callback;

        beforeEach(function() {
          callback = sinon.spy();
          create({
            my_label: callback
          });
        });

        it("uses the key name as the button text", function() {
          expect(text(".btn")).to.equal("my_label");
        });

        describe("when dismissing the dialog by clicking the button", function() {
          beforeEach(function() {
            dialog.find(".btn-primary").trigger("click");
          });

          it("should invoke the callback", function() {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function() {
            expect(callback.thisValues[0]).to.equal(dialog);
          });
        });
      });

      describe("when its value is not an object or function", function() {
        function badCreate() {
          create({
            "Short form": "hello world"
          });
        }

        it("throws an error", function() {
          expect(badCreate).to.throw(/button with key "Short form" must be an object/);
        });
      });
    });
  });

  describe("when creating a dialog with a title", function() {
    beforeEach(function() {
      dialog = bootshine.dialog({
        title: "My Title",
        message: "test"
      });
    });

    it("has a header", function() {
      expect(exists(".modal-header")).to.be.ok;
    });

    it("shows the correct title text", function() {
      expect(text(".modal-title")).to.equal("My Title");
    });

    it("has a close button inside the header", function() {
      expect(exists(".modal-header .close")).to.be.ok;
    });
  });

  describe("when creating a dialog with no backdrop", function() {
    beforeEach(function() {
      dialog = bootshine.dialog({
        message: "No backdrop in sight",
        backdrop: false
      });
    });

    it("does not have a backdrop", function() {
      expect(dialog.next(".modal-backdrop").length).to.equal(0);
    });
  });

  describe("when creating a dialog with no close button", function() {
    beforeEach(function() {
      dialog = bootshine.dialog({
        message: "No backdrop in sight",
        closeButton: false
      });
    });

    it("does not have a close button inside the body", function() {
      expect(exists(".modal-body .close")).not.to.be.ok;
    });
  });

  describe("when creating a dialog with an onEscape handler", function() {
    function e(keyCode) {
      $(dialog).trigger($.Event("keyup", {
        which: keyCode,
      }));
    }

    describe("with a simple callback", function() {
      var callback;
      var hidden;
      var trigger;

      beforeEach(function() {
        callback = sinon.spy();
        dialog = bootshine.dialog({
          message: "Are you sure?",
          onEscape: callback
        });
        hidden = sinon.spy(dialog, "modal");
        trigger = sinon.spy(dialog, "trigger").withArgs("escape.close.bb");
      });

      describe("when triggering the keyup event", function() {
        describe("when the key is not the escape key", function() {
          beforeEach(function() {
            e(15);
          });

          it("does not trigger the escape event", function() {
            expect(trigger).not.to.have.been.called;
          });

          it("should not hide the modal", function() {
            expect(hidden).not.to.have.been.called;
          });
        });

        describe("when the key is the escape key", function() {
          beforeEach(function() {
            e(27);
          });

          it("triggers the escape event", function() {
            expect(trigger).to.have.been.calledWithExactly("escape.close.bb");
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
    });

    describe("with a callback which returns false", function() {
      var callback;
      var hidden;

      beforeEach(function() {
        callback = sinon.stub().returns(false);
        dialog = bootshine.dialog({
          message: "Are you sure?",
          onEscape: callback
        });
        hidden = sinon.spy(dialog, "modal");
      });

      describe("when triggering the escape keyup event", function() {
        beforeEach(function() {
          e(27);
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

      describe("when clicking the escape button", function() {
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
    });
  });

  describe("with size option", function() {
    describe("when the size option is set to large", function() {
      beforeEach(function() {
        dialog = bootshine.dialog({
          message: "test",
          size: "large"
        });
      });

      it("adds the large class to the innerDialog", function() {
        expect(dialog.children(".modal-dialog").hasClass("modal-lg")).to.be.true;
      });
    });

    describe("when the size option is set to small", function() {
      beforeEach(function() {
        dialog = bootshine.dialog({
          message: "test",
          size: "small"
        });
      });

      it("adds the large class to the innerDialog", function() {
        expect(dialog.children(".modal-dialog").hasClass("modal-sm")).to.be.true;
      });
    });
  });
});
