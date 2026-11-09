/** Curated complementary examples shared by the four markup languages. */
export const componentDocScenarios = {
  callout: [
    { label: 'Dismissible notice', source: '<tp-callout variant="success" heading="Saved" closable>Your changes have been saved.</tp-callout>', description: 'Dismiss the saved confirmation with its Close button.' },
    { label: 'Outlined warning', source: '<tp-callout variant="warning" heading="Before leaving" outlined>Save your work before closing this page.</tp-callout>', description: 'Compare the outlined warning with the filled introductory notice.' },
  ],
  button: [
    { label: 'Navigation link', source: '<tp-button href="https://example.org" target="_blank" outlined variant="brand">Open example.org</tp-button>', description: 'Open the destination in a new tab using a button rendered as a link.' },
    { label: 'Unavailable action', source: '<tp-button disabled>Submit answer</tp-button>', description: 'Compare the disabled action with the active introductory button.' },
  ],
  badge: [{ label: 'Status labels', source: '<tp-badge variant="success">Complete</tp-badge> <tp-badge variant="warning">Pending</tp-badge>', description: 'Compare two short status labels with different semantic colors.' }],
  textfield: [{ label: 'Clearable search', source: '<tp-textfield label="Search" value="Garden" clearable></tp-textfield>', description: 'Edit the search text, then use Clear to empty the field.' }],
  avatar: [{ label: 'Initials fallback', source: '<tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>', description: 'Inspect the initials displayed when no portrait is supplied.' }],
  'code-editor': [{ label: 'Read-only code', source: '<tp-code-editor language="javascript" readonly line-numbers><script type="tp/javascript">const answer = 42;</script></tp-code-editor>', description: 'Select and copy the code while editing is disabled.' }],
};
