describe("bootprompt.setDefaults", function() {

  beforeEach(function() {
    this.find = function(selector) {
      return this.dialog.find(selector);
    };
  });

  describe("animate", function() {
    describe("when set to false", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          animate: false
        });
        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("does not add the fade class to the dialog", function() {
        expect(this.dialog.hasClass("fade")).to.be.false;
      });

      it("applies the correct class to the body", function() {
        expect($("body").hasClass("modal-open")).to.be.true;
      });

      describe("when clicking the close button", function() {
        beforeEach(function() {
          this.dialog.find(".close").trigger("click");
        });

        it("removes the modal-open class from the body", function() {
          expect($("body").hasClass("modal-open")).to.be.false;
        });
      });
    });

    describe("when set to true", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          animate: true
        });
        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("adds the fade class to the dialog", function() {
        expect(this.dialog.hasClass("fade")).to.be.true;
      });
    });
  });

  describe("className", function() {
    describe("when passed as a string", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          className: "my-class"
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("adds the extra class to the outer dialog", function() {
        expect(this.dialog.hasClass("bootprompt")).to.be.true;
        expect(this.dialog.hasClass("my-class")).to.be.true;
      });
    });
  });

  describe("size", function() {
    describe("when set to large", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          size: "large"
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("adds the large class to the innerDialog", function() {
        expect(this.dialog.children(".modal-dialog").hasClass("modal-lg")).to.be.true;
      });
    });
    describe("when set to small", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          size: "small"
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("adds the small class to the innerDialog", function() {
        expect(this.dialog.children(".modal-dialog").hasClass("modal-sm")).to.be.true;
      });
    });
  });

  describe("backdrop", function() {
    describe("when set to false", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          backdrop: false
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("does not show a backdrop", function() {
        expect(this.dialog.next(".modal-backdrop").length).to.equal(0);
      });
    });
  });

  describe("centerVertical", function() {
    describe("when set to true", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          centerVertical: true
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("adds the modal-dialog-centered class to the innerDialog", function() {
        expect(this.dialog.children(".modal-dialog").hasClass("modal-dialog-centered")).to.be.true;
      });
    });
  });

  describe("when passed two arguments", function() {
    beforeEach(function() {
      bootprompt.setDefaults("className", "my-class");
      this.dialog = bootprompt.dialog({
        message: "test"
      });
    });

    it("applies the arguments as a key/value pair", function() {
      expect(this.dialog.hasClass("bootprompt")).to.be.true;
      expect(this.dialog.hasClass("my-class")).to.be.true;
    });
  });

  describe("container", function () {
    describe("when not explicitly set", function() {
      beforeEach(function() {
        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("defaults to the body element", function() {
        expect(this.dialog.parent().is("body")).to.be.true;
      });
    });

    describe("when explicitly set to body", function() {
      beforeEach(function() {
        bootprompt.setDefaults({
          container: "body"
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("sets the correct parent element", function() {
        expect(this.dialog.parent().is("body")).to.be.true;
      });
    });

    describe("when set to another dom element", function() {

      beforeEach(function() {
        this.container = $("<div></div>");
        bootprompt.setDefaults({
          container: this.container
        });

        this.dialog = bootprompt.dialog({
          message: "test"
        });
      });

      it("sets the correct parent element", function() {
        expect(this.dialog.parent().is(this.container)).to.be.true;
      });
    });
  });
});
