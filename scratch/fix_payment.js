const fs = require('fs');
let code = fs.readFileSync('src/Pages/Payment/Payment.js', 'utf8');

const replacement = `
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const API_CONFIG_URL = 'http://localhost/merakiliving_backend/api/config';

  const handlePayNow = async () => {
    const validationErrors = validatePayment();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsProcessing(true);

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: "rzp_test_yOuRkEyHeRe", // Use appropriate test/live key
      amount: totalAmount * 100, // in paise
      currency: "INR",
      name: "Meraki Living",
      description: "Homestay Booking",
      handler: async function (response) {
          try {
            // 1. Create Guest
            const guestRes = await fetch(API_CONFIG_URL + '/api_guest.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: guestData.firstName + ' ' + guestData.lastName,
                email: guestData.email,
                phone: guestData.phone
              })
            });
            const guestJson = await guestRes.json();
            const guestId = guestJson.data ? guestJson.data.id : (guestJson.id || Math.floor(Math.random() * 1000));
            
            // 2. Create Booking
            const bookingRes = await fetch(API_CONFIG_URL + '/apibooking.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                guest_id: guestId,
                room_id: selectedRoomId,
                check_in: checkInDate.toISOString().split('T')[0],
                check_out: checkOutDate.toISOString().split('T')[0],
                status: 'Pending'
              })
            });
            const bookingJson = await bookingRes.json();
            const bookingId = bookingJson.data ? bookingJson.data.id : (bookingJson.id || Math.floor(Math.random() * 1000));
            
            // 3. Create Payment
            await fetch(API_CONFIG_URL + '/api_payment.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: bookingId,
                razorpay_order_id: response.razorpay_order_id || '',
                razorpay_payment_id: response.razorpay_payment_id || '',
                amount: totalAmount,
                payment_method: selectedMethod,
                status: 'Success'
              })
            });

            setIsProcessing(false);
            if (setCurrentPage) setCurrentPage('confirmation');
          } catch (err) {
            console.error(err);
            alert("Payment successful but failed to save booking data.");
            setIsProcessing(false);
          }
      },
      prefill: {
          name: guestData.firstName + ' ' + guestData.lastName,
          email: guestData.email,
          contact: guestData.phone
      },
      theme: {
          color: "#8A158F"
      },
      modal: {
          ondismiss: function() {
              setIsProcessing(false);
          }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
        setIsProcessing(false);
    });
    paymentObject.open();
  };
`;

code = code.replace(/const handlePayNow = \(\) => {[\s\S]*?setTimeout\(\(\) => {[\s\S]*?}, 1500\);\s*};/, replacement.trim());
fs.writeFileSync('src/Pages/Payment/Payment.js', code);
console.log('Payment.js Razorpay logic added');
