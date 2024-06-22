const { send } = require("./services");

const handleSendEmail = async (billNotSend) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    road,
    note,
    province,
    district,
    village,
    cart,
  } = billNotSend;

  const textEmail = `Kính chào quý khách hàng ${firstName} ${lastName}!`;
  const html = `<p style="color: red;">Cảm ơn quý khách đã tín nhiệm dịch vụ của Shoes</p> <br />
     <p">Dưới đây là thông tin liên quan đến đơn hàng của Anh/Chị: </p> <br />
     <p>Email: <strong>${email}</strong></p> <br />
     <p>Số Điện Thoại: <strong>${phoneNumber}</strong></p> <br />
     <p>Địa Chỉ Nhận : <strong>${road}</strong> ${village}, ${district}, ${province} </p> <br />
     <p>Ghi chú : ${note}</p> <br />

     <p>Sản Phẩm: </p> <br />
     <ol>
     ${cart
       .map((product) => {
         const { code, productName, quantity, size } = product;

         return `<li style="width: "300px" display: flex; gap: "30px";">
           <strong>${code}</strong>
           ${productName}
           ${size}
           x ${quantity}
          </li>`;
       })
       .join("<br />")}
     </ol> <br />
     
     <p style="color: red;">Sau khi nhận được mail này, Shop sẽ liên hệ lại thông qua số điện thoại để xác nhận đơn hàng. Trân trọng!</p> 

    `;

  try {
    await send(`${email}`, textEmail, html);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleSendEmail,
};
