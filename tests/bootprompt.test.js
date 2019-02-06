describe("Bootprompt", function() {

  "use strict";

  it("is attached to the window object", function() {
    expect(window.bootprompt).to.be.an("object");
  });

  it("exposes the correct public API", function() {
    expect(bootprompt.alert).to.be.a("function");
    expect(bootprompt.confirm).to.be.a("function");
    expect(bootprompt.dialog).to.be.a("function");
    expect(bootprompt.setDefaults).to.be.a("function");
    expect(bootprompt.setLocale).to.be.a("function");
    expect(bootprompt.removeLocale).to.be.a("function");
    expect(bootprompt.locales).to.be.a("function");
    expect(bootprompt.hideAll).to.be.a("function");
  });

  describe("hideAll", function() {
    var hidden;

    beforeEach(function() {
      hidden = sinon.spy($.fn, "modal");
      bootprompt.hideAll();
    });

    afterEach(function() {
      hidden.restore();
    });

    it("should hide all .bootprompt modals", function() {
      expect(hidden).to.have.been.calledWithExactly("hide");
    });
  });

  describe("event listeners", function() {
    describe("hidden.bs.modal", function() {
      var dialog;
      var removed;

      function e(target) {
        $(dialog).trigger($.Event("hidden.bs.modal", {
          target: target
        }));
      }

      beforeEach(function() {
        dialog = bootprompt.alert("hi");
        removed = sinon.stub(dialog, "remove");
      });

      afterEach(function() {
        removed.restore();
      });

      describe("when triggered with the wrong target", function() {
        beforeEach(function() {
          e({an: "object"});
        });

        it("does not remove the dialog", function() {
          expect(removed).not.to.have.been.called;
        });
      });

      describe("when triggered with the correct target", function() {
        beforeEach(function() {
          e(dialog.get(0));
        });

        it("removes the dialog", function() {
          expect(removed).to.have.been.called;
        });
      });
    });
  });

  describe("If $.fn.modal is undefined", function() {
    var oldModal;

    beforeEach(function() {
      oldModal = window.jQuery.fn.modal;
      window.jQuery.fn.modal = undefined;
    });

    afterEach(function() {
      window.jQuery.fn.modal = oldModal;
    });

    describe("When invoking a dialog", function() {
      it("throws the correct error", function() {
        expect(function () {
          bootprompt.alert("Hi", function() {});
        }).to.throw(Error, '$.fn.modal" is not defined');
      });
    });
  });

  describe("adding and removing locales", function() {

    describe("bootprompt.addLocale", function() {
      describe("with invalid values", function() {
        it("throws the expected error", function() {
          expect(function () {
            bootprompt.addLocale("xy", {
              OK: "BTN1"
            });
          }).to.throw(Error, 'Please supply a translation for "CANCEL"');
        });
      });

      describe("with valid values", function() {
        var labels;

        beforeEach(function() {
          bootprompt
          .addLocale("xy", {
            OK: "BTN1",
            CANCEL: "BTN2",
            CONFIRM: "BTN3"
          })
          .setLocale("xy");

          var d1 = bootprompt.alert("foo");
          var d2 = bootprompt.confirm("foo", function() { return true; });
          labels = {
            ok: d1.find(".btn:first").text(),
            cancel: d2.find(".btn:first").text(),
            confirm: d2.find(".btn:last").text()
          };
        });

        it("shows the expected OK translation", function() {
          expect(labels.ok).to.equal("BTN1");
        });
        it("shows the expected CANCEL translation", function() {
          expect(labels.cancel).to.equal("BTN2");
        });
        it("shows the expected PROMPT translation", function() {
          expect(labels.confirm).to.equal("BTN3");
        });
      });
    });

    describe("bootprompt.removeLocale", function () {
      var labels;

      beforeEach(function () {
        bootprompt.removeLocale("xy");

        var d1 = bootprompt.alert("foo");
        var d2 = bootprompt.confirm("foo", function () { return true; });
        labels = {
          ok: d1.find(".btn:first").text(),
          cancel: d2.find(".btn:first").text(),
          confirm: d2.find(".btn:last").text()
        };
      });

      it("falls back to the default OK translation", function () {
        expect(labels.ok).to.equal("OK");
      });
      it("falls back to the default CANCEL translation", function () {
        expect(labels.cancel).to.equal("Cancel");
      });
      it("falls back to the default PROMPT translation", function () {
        expect(labels.confirm).to.equal("OK");
      });
    });
  });

  describe("backdrop variations", function() {
    function e(target) {
      $(dialog).trigger($.Event("click.dismiss.bs.modal", {
        target: target
      }));
    }

    describe("with the default value", function() {
      var callback;

      beforeEach(function() {
        callback = sinon.spy();
        dialog = bootprompt.alert("hi", callback);
      });

      describe("When triggering the backdrop click dismiss event", function() {
        beforeEach(function() {
          e({an: "object"});
        });

        it("does not invoke the callback", function() {
          expect(callback).not.to.have.been.called;
        });
      });
    });

    describe("when set to false", function() {
      var callback;

      beforeEach(function() {
        callback = sinon.spy();
        dialog = bootprompt.alert({
          message: "hi",
          callback: callback,
          backdrop: false
        });
      });

      describe("When triggering the backdrop click dismiss event", function() {
        describe("With the wrong target", function() {
          beforeEach(function() {
            e({an: "object"});
          });

          it("does not invoke the callback", function() {
            expect(callback).not.to.have.been.called;
          });
        });

        describe("With the correct target", function() {
          beforeEach(function() {
            e(dialog.get(0));
          });

          it("invokes the callback", function() {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function() {
            expect(callback.thisValues[0]).to.equal(dialog);
          });
        });
      });
    });

    describe("when set to true", function() {
      var callback;

      beforeEach(function() {
        callback = sinon.spy();
        dialog = bootprompt.alert({
          message: "hi",
          callback: callback,
          backdrop: true
        });
      });

      describe("When triggering the backdrop click dismiss event", function() {
        describe("With the wrong target", function() {
          beforeEach(function() {
            e({an: "object"});
          });

          it("does not invoke the callback", function() {
            expect(callback).not.to.have.been.called;
          });
        });

        describe("With the correct target", function() {
          beforeEach(function() {
            e(dialog.children(".modal-backdrop").get(0));
          });

          it("invokes the callback", function() {
            expect(callback).to.have.been.called;
          });

          it('should pass the dialog as "this"', function() {
            expect(callback.thisValues[0]).to.equal(dialog);
          });
        });
      });
    });
  });
});
