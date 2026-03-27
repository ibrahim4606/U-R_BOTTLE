const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ebrahimvpathan@gmail.com",
    pass: process.env.GOOGLE_PASSKEY,
  },
});

const sendMail = async (email, order) => {
  const items = order.items || [];

  const itemsHTML = items
    .map(
      (item) => `
      <tr>
        <td>${item.title}</td>
        <td>${item.bottleVolume} ml</td>
        <td>${item.units}</td>
        <td>₹${item.perUnitPrice}</td>
        <td>₹${item.TotalPrice}</td>
      </tr>
    `,
    )
    .join("");

  const mailOptions = {
    from: '"U\'R Bottle" <no-reply@urbottle.com>',
    to: email,
    subject: "Order Confirmed - U'R Bottle",

    html: `
    <h2>Your Order is Confirmed 🎉</h2>

    <p>Thank you for ordering from <strong>U'R Bottle</strong></p>

    <p>
    <h3>
    <strong>Order Number:</strong> ${order.orderNumber} <br>
    <strong>Status:</strong> ${order.orderStatus}
    </h3>
    </p>

    <h3>Items</h3>

    <table border="1" cellpadding="8" cellspacing="0">
      <tr>
        <th>For Brand</th>
        <th>Volume</th>
        <th>Units</th>
        <th>Price</th>
        <th>Total</th>
      </tr>

      ${itemsHTML}

    </table>

    <h3>Total Amount : ₹${order.totalAmount}</h3>

    <h3>Shipping Address</h3>

    <p>
    ${order.shippingDetails.fullName}<br>
    ${order.shippingDetails.address}<br>
    ${order.shippingDetails.city} - ${order.shippingDetails.pincode}<br>
    Phone: ${order.shippingDetails.phone}
    </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
