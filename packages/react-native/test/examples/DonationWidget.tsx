import { useState } from 'react';
import { View } from 'react-native';
import { DonationCompact, DonationGoal, DonationWidget, type DonationAmount, type DonationFrequency } from '../../src/components/DonationWidget';

export default function Example() {
  const [freq, setFreq] = useState<DonationFrequency>('monthly');
  const [amount, setAmount] = useState<DonationAmount>(50);
  const [other, setOther] = useState('');
  const [small, setSmall] = useState(50);
  const word = freq === 'monthly' ? 'monthly' : 'one-time';
  return (
    <View style={{ gap: 24 }}>
      <DonationWidget
        frequency={freq} onFrequencyChange={setFreq} amount={amount} onAmountChange={setAmount} otherValue={other} onOtherValueChange={setOther}
        impact={{ strong: '$50 places 10 Bibles', text: ' with new readers every month. (sample)' }} giveLabel={`Give $50 ${word}`} onGive={() => {}}
      />
      <DonationWidget
        frequency="once" onFrequencyChange={() => {}} amount="other" onAmountChange={() => {}} otherValue="35"
        impact={{ strong: 'Every $5 places a Bible', text: ' with a new reader.' }} giveLabel="Give $35 one-time" onGive={() => {}} submitting
      />
      <DonationCompact amount={small} onAmountChange={setSmall} giveLabel="Give $50 monthly" onGive={() => {}} impactText="Every $5 places a Bible with a new reader." />
      <DonationGoal title="Year-end Bible drive" meta="18 days left" raised={18400} goal={25000} raisedLabel="$18,400" summaryText=" of $25,000 raised · 74% (sample)" />
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <DonationGoal onDark title="Year-end Bible drive" meta="18 days left" raised={18400} goal={25000} raisedLabel="$18,400" summaryText=" of $25,000 raised · 74%" />
      </View>
    </View>
  );
}
