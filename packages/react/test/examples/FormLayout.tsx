import { FormLayout, FormSet, FormField, FormSummary, FormActions, FormChoiceGroup, CharacterCount } from '../../src/components/FormLayout';
import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <FormLayout aria-label="Become a church partner">
      <FormSummary
        id="form-errors"
        title="Please fix 2 things before sending"
        items={[
          { fieldId: 'email', message: 'Email: enter a full email, like name@example.com' },
          { fieldId: 'story', message: 'Share your story: please shorten this a little' },
        ]}
      />
      <FormSet legend="About you" description="So our partnership team knows who to contact.">
        <FormField label="First name" required>{(c) => <input className="input" {...c} />}</FormField>
        <FormField label="Phone" optionalText="(optional)">{(c) => <input className="input" type="tel" {...c} />}</FormField>
        <FormField label="Email" full error="Enter a full email, like name@example.com" id="email">
          {(c) => <input className="input" type="email" defaultValue="name@" {...c} />}
        </FormField>
      </FormSet>
      <FormSet legend="Your church" description="We use this to send the right Bibles.">
        <FormField label="Share your story" optionalText="(optional)" full id="story" describedBy="story-count" error="Please shorten this a little.">
          {(c) => <textarea className="input" defaultValue="Thank you" {...c} />}
        </FormField>
        <CharacterCount className="fm-full" count={520} max={500} counterId="story-count" helper="How has the Bible in your language helped?" />
        <CharacterCount className="fm-full" count={462} max={500} format={(n, m, left) => `${n} / ${m} · ${left} left`} />
        <FormChoiceGroup legend="Attendance" columns>
          <label className="fm-row"><input type="radio" name="a" className="fm-radio" />Under 50</label>
          <label className="fm-row"><input type="radio" name="a" className="fm-radio" />50 to 200</label>
        </FormChoiceGroup>
      </FormSet>
      <FormActions>
        <Button size="lg" type="submit">Send application</Button>
        <Button variant="outlineLight" size="lg">Save for later</Button>
      </FormActions>
    </FormLayout>
  );
}
