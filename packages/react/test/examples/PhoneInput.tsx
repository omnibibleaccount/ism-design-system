import { PhoneInput } from '../../src/components/PhoneInput';

const labels = { search: 'Search countries', suggested: 'Suggested', all: 'All countries', empty: 'No countries match.' };

export default function Example() {
  return (
    <>
      <PhoneInput label="Phone" optionalText="(optional)" labels={labels} suggested={['PH', 'ET']} />
      <PhoneInput label="Phone" labels={labels} defaultCountry="ET" defaultValue="+251911234567" error="This number looks too short." required />
      <PhoneInput label="Phone" labels={labels} disabled hint="We call back within a day." />
    </>
  );
}
