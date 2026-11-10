import React from 'react';

/**
 * The two hidden inputs every Netlify form needs: `form-name` to route the
 * submission, and a honeypot that people can't see but bots tend to fill.
 */
const NetlifyFormFields: React.FC<{ formName: string }> = ({ formName }) => (
  <>
    <input type="hidden" name="form-name" value={formName} />
    <p className="hidden" aria-hidden="true">
      <label>
        Do not fill this in
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  </>
);

export default NetlifyFormFields;
