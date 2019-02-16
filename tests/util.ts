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
