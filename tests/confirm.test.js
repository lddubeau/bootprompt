describe("bootprompt.confirm", function() {

  describe("basic usage tests", function() {

    describe("with one argument", function() {

      describe("where the argument is not an object", function() {
        function create() {
          bootprompt.confirm("Are you sure?");
        }

        it("throws an error", function() {
          expect(create).to.throw(/confirm requires a callback/);
        });
      });

      describe("where the argument is an object", function() {
        var options;

        function create() {
          dialog = bootprompt.confirm(options);
        }

        beforeEach(function () {
          options = {};
        });

        describe("with a message property", function() {
          beforeEach(function() {
            options.message = "Are you sure?";
          });

          it("throws an error requiring a callback", function() {
            expect(create).to.throw(/confirm requires a callback/);
          });
        });

        describe("with a callback property", function() {

          describe("where the callback is not a function", function() {
            beforeEach(function() {
              options.callback = "Are you sure?";
            });

            it("throws an error requiring a callback", function() {
              expect(create).to.throw(/confirm requires a callback/);
            });
          });

          describe("where the callback is a function", function() {
            beforeEach(function() {
              options.callback = function() {
                return true;
              };
            });

            it("throws an error requiring a message", function() {
              expect(create).to.throw(/Please specify a message/);
            });
          });
        });

        describe("with a message and a callback", function() {
          beforeEach(function() {
            options = {
              callback: function() {
                return true;
              },
              message: "Are you sure?"
            };
          });

          it("does not throw an error", function() {
            expect(create).not.to.throw(Error);
          });

          it("creates a dialog object", function() {
            expect(dialog).to.be.an("object");
          });

          it("adds the correct button labels", function() {
            expect(dialog.find(".btn:first").text()).to.equal("Cancel");
            expect(dialog.find(".btn:last").text()).to.equal("OK");
          });

          it("adds the correct button classes", function() {
            expect(dialog.find(".btn:first").hasClass("btn-default")).to.be.true;
            expect(dialog.find(".btn:first").hasClass("btn-secondary")).to.be.true;
            expect(dialog.find(".btn:first").hasClass("bootprompt-cancel")).to.be.true;

            expect(dialog.find(".btn:last").hasClass("btn-primary")).to.be.true;
            expect(dialog.find(".btn:last").hasClass("bootprompt-accept")).to.be.true;
          });
        });
      });
    });
    describe("with two arguments", function() {
      describe("where the second argument is not a function", function() {
        function create() {
          dialog = bootprompt.confirm("Are you sure?", "callback here");
        }

        it("throws an error requiring a callback", function() {
          expect(create).to.throw(/confirm requires a callback/);
        });
      });

      describe("where the second argument is a function", function() {
        function create() {
          dialog = bootprompt.confirm("Are you sure?", function() {
            return true;
          });
        }

        it("does not throw an error", function() {
          expect(create).not.to.throw(Error);
        });

        it("creates a dialog object", function() {
          expect(dialog).to.be.an("object");
        });

        it("applies the bootprompt-confirm class to the dialog", function() {
          expect(dialog.hasClass("bootprompt-confirm")).to.be.true;
        });

        it("adds the correct button labels", function() {
          expect(dialog.find(".btn:first").text()).to.equal("Cancel");
          expect(dialog.find(".btn:last").text()).to.equal("OK");
        });

        it("adds the correct button classes", function() {
          expect(dialog.find(".btn:first").hasClass("btn-default")).to.be.true;
          expect(dialog.find(".btn:first").hasClass("btn-secondary")).to.be.true;
          expect(dialog.find(".btn:first").hasClass("bootprompt-cancel")).to.be.true;

          expect(dialog.find(".btn:last").hasClass("btn-primary")).to.be.true;
          expect(dialog.find(".btn:last").hasClass("bootprompt-accept")).to.be.true;
        });

        it("shows the dialog", function() {
          expect(dialog.is(":visible")).to.be.true;
        });
      });
    });
  });
  describe("configuration options tests", function() {
    function create() {
      dialog = bootprompt.confirm(options);
    }

    beforeEach(function() {
      options = {
        message: "Are you sure?",
        callback: function() {
          return true;
        }
      };
    });

    describe("with a custom cancel button", function() {
      var button;

      beforeEach(function() {
        options.buttons = {
          cancel: {
            label: "Custom cancel",
            className: "btn-danger"
          }
        };
        create();
        button = dialog.find(".btn:first");
      });

      it("adds the correct cancel button", function() {
        expect(button.text()).to.equal("Custom cancel");
        expect(button.hasClass("btn-danger")).to.be.true;
      });
    });

    describe("with a custom confirm button", function() {
      var button;

      beforeEach(function() {
        options.buttons = {
          confirm: {
            label: "Custom confirm",
            className: "btn-warning"
          }
        };
        create();
        button = dialog.find(".btn:last");
      });

      it("adds the correct confirm button", function() {
        expect(button.text()).to.equal("Custom confirm");
        expect(button.hasClass("btn-warning")).to.be.true;
      });
    });

    describe("with an unrecognised button key", function() {
      beforeEach(function() {
        options.buttons = {
          "Bad key": {
            label: "Custom confirm",
            className: "btn-warning"
          }
        };
      });

      it("throws an error", function() {
        expect(create).to.throw('button key "Bad key" is not allowed (options are cancel confirm)');
      });
    });
  });

  describe("callback tests", function() {
    describe("with a simple callback", function() {
      var callback;
      var hidden;

      beforeEach(function() {
        callback = sinon.spy();
        dialog = bootprompt.confirm({
          message: "Are you sure?",
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

        it("with the correct value", function() {
          expect(callback).to.have.been.calledWithExactly(true);
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when dismissing the dialog by clicking Cancel", function() {
        beforeEach(function() {
          dialog.find(".bootprompt-cancel").trigger("click");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function() {
          expect(callback).to.have.been.calledWithExactly(false);
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

        it("with the correct value", function() {
          expect(callback).to.have.been.calledWithExactly(false);
        });

        it("should hide the modal", function() {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });
    describe("with a callback which returns false", function() {
      var callback;
      var hidden;

      beforeEach(function() {
        callback = sinon.stub();
        callback.returns(false);
        dialog = bootprompt.confirm({
          message: "Are you sure?",
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

        it("with the correct value", function() {
          expect(callback).to.have.been.calledWithExactly(true);
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when dismissing the dialog by clicking Cancel", function() {
        beforeEach(function() {
          dialog.find(".bootprompt-cancel").trigger("click");
        });

        it("should invoke the callback", function() {
          expect(callback).to.have.been.called;
        });

        it('should pass the dialog as "this"', function() {
          expect(callback.thisValues[0]).to.equal(dialog);
        });

        it("with the correct value", function() {
          expect(callback).to.have.been.calledWithExactly(false);
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

        it("with the correct value", function() {
          expect(callback).to.have.been.calledWithExactly(false);
        });

        it("should not hide the modal", function() {
          expect(hidden).not.to.have.been.called;
        });
      });
    });
  });
});
