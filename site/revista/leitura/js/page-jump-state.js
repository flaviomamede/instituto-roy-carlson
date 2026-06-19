'use strict';

let editing = false;

export function setPageJumpEditing(value) {
  editing = !!value;
}

export function isEditingPage() {
  return editing;
}
