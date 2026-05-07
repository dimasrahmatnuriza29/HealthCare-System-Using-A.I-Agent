import CustomerPanel from '../CustomerPanel.jsx';

export default function CustomerStep({ activeCustomerId, onSelectCustomer, onContinue }) {
  return (
    <section className="px-3 sm:px-0">
      <CustomerPanel
        activeCustomerId={activeCustomerId}
        onSelectCustomer={onSelectCustomer}
        onContinue={onContinue}
      />
    </section>
  );
}
