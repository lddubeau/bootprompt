function find($dialog: JQuery, selector: string): HTMLElement {
  return $dialog[0].querySelector(selector) as HTMLElement;
}

function text($dialog: JQuery, selector: string): string {
  // tslint:disable-next-line:no-non-null-assertion
  return find($dialog, selector).textContent!;
}

function exists($dialog: JQuery, selector: string): boolean {
  return $dialog[0].querySelector(selector) !== null;
}

function reload(done: () => void): void {
  //
  // What we are doing here is essentially resetting bootprompt.
  //

  // Look for the path to bootprompt.
  // tslint:disable-next-line:no-any
  const files = Object.keys((window as any).__karma__.files);
  let src: string | undefined;
  for (const candidate of files) {
    if (/\/bootprompt\..*\.js$/.test(candidate)) {
      src = candidate;
      break;
    }
  }

  if (src === undefined) {
    throw new Error("couldn't find the path to bootprompt!");
  }

  // Reload it. We don't need to load the locales here.
  const script = document.createElement("script");
  script.addEventListener("load", () => {
    done();
  });
  script.src = src;
  document.body.appendChild(script);
}
