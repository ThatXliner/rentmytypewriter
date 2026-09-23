const plan = document.querySelector('#plan');
const date = document.querySelector('#rental-date');
const period = document.querySelector('#period');
const singleFields = document.querySelector('#single-fields');
const monthlyNotice = document.querySelector('#monthly-notice');
const textLink = document.querySelector('#text-request');
const status = document.querySelector('#request-status');
const signerName = document.querySelector('#signer-name');
const agreeTerms = document.querySelector('#agree-terms');
const parentDeposit = document.querySelector('#parent-deposit');
const termsStatement = 'I have read and agree to the Rental Terms (September 23, 2026): https://rentmytypewriter.bryanhu.com/terms.html';

const today = new Date();
date.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().slice(0, 10);

function updateRequest() {
  const monthly = plan.value === 'monthly';
  singleFields.hidden = monthly;
  monthlyNotice.hidden = !monthly;
  date.required = !monthly;
  period.required = !monthly;
  status.textContent = '';
  const signature = signerName.value.trim();
  const parentNote = parentDeposit.checked ? ' My parent or guardian will provide the deposit and can confirm directly before handoff.' : '';
  const agreement = signature && agreeTerms.checked ? `${parentNote} Signed: ${signature}. ${termsStatement}` : parentNote;

  if (monthly) {
    const message = "Hi! I'd like the GX-6750 monthly unlimited plan ($20/month). I understand each use requires 24-hour notice, and the monthly plan has a $30 refundable deposit. How do I get started?" + agreement;
    textLink.href = `sms:+16696891368?body=${encodeURIComponent(message)}`;
    return;
  }
  if (!date.value || !period.value) {
    textLink.href = 'sms:+16696891368';
    return;
  }
  const selectedDate = new Date(`${date.value}T12:00:00`);
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const message = `Hi! I'd like to rent your GX-6750 for one use ($5, plus $50 refundable deposit) on ${formattedDate} during ${period.value}. Is it available?${agreement}`;
  textLink.href = `sms:+16696891368?body=${encodeURIComponent(message)}`;
}

textLink.addEventListener('click', event => {
  if (!signerName.value.trim()) {
    event.preventDefault();
    status.textContent = 'Enter your full name first.';
    signerName.focus();
    return;
  }
  if (!agreeTerms.checked) {
    event.preventDefault();
    status.textContent = 'Read and agree to the Rental Terms first.';
    agreeTerms.focus();
    return;
  }
  if (plan.value === 'single' && (!date.value || !period.value || !date.checkValidity())) {
    event.preventDefault();
    status.textContent = 'Choose a date and class period first.';
    (!date.value || !date.checkValidity() ? date : period).focus();
  }
});
plan.addEventListener('change', updateRequest);
date.addEventListener('change', updateRequest);
period.addEventListener('change', updateRequest);
signerName.addEventListener('input', updateRequest);
agreeTerms.addEventListener('change', updateRequest);
parentDeposit.addEventListener('change', updateRequest);
updateRequest();
