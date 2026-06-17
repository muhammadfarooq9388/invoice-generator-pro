const productTable =
document.getElementById("productTable");

const subtotalEl =
document.getElementById("subtotal");

const taxAmountEl =
document.getElementById("taxAmount");

const grandTotalEl =
document.getElementById("grandTotal");

const invoicePreview =
document.getElementById("invoicePreview");

const themeBtn =
document.getElementById("themeBtn");

let products = [];

/* ==========================
   INVOICE SETUP
========================== */

document.getElementById(
"invoiceNumber"
).value =
"INV-" +
Math.floor(
1000 + Math.random() * 9000
);

document.getElementById(
"invoiceDate"
).value =
new Date()
.toISOString()
.split("T")[0];

/* ==========================
   ADD PRODUCT
========================== */

function addProduct(){

    const name =
    document
    .getElementById(
    "productName"
    )
    .value
    .trim();

    const qty =
    parseFloat(
    document
    .getElementById(
    "productQty"
    )
    .value
    );

    const price =
    parseFloat(
    document
    .getElementById(
    "productPrice"
    )
    .value
    );

    if(
        !name ||
        !qty ||
        !price
    ){

        showToast(
        "Fill All Fields"
        );

        return;
    }

    products.push({

        id: Date.now(),

        name,

        qty,

        price,

        total:
        qty * price

    });

    document
    .getElementById(
    "productName"
    )
    .value = "";

    document
    .getElementById(
    "productQty"
    )
    .value = "";

    document
    .getElementById(
    "productPrice"
    )
    .value = "";

    saveProducts();

    showToast(
    "Product Added"
    );
}

/* ==========================
   RENDER PRODUCTS
========================== */

function renderProducts(){

    productTable.innerHTML = "";

    products.forEach(
    product => {

        productTable.innerHTML +=

        `
        <tr>

            <td>
            ${product.name}
            </td>

            <td>
            ${product.qty}
            </td>

            <td>
            ₹${product.price}
            </td>

            <td>
            ₹${product.total}
            </td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteProduct(${product.id})">

                Delete

                </button>

            </td>

        </tr>
        `;

    });

    updateSummary();

    generatePreview();
}

/* ==========================
   DELETE PRODUCT
========================== */

function deleteProduct(id){

    products =
    products.filter(
    item =>
    item.id !== id
    );

    saveProducts();

    showToast(
    "Product Deleted"
    );
}

/* ==========================
   SUMMARY
========================== */

function updateSummary(){

    const subtotal =

    products.reduce(
    (sum,item)=>
    sum + item.total,
    0
    );

    const tax =
    subtotal * 0.10;

    const grandTotal =
    subtotal + tax;

    subtotalEl.textContent =
    `₹${subtotal.toFixed(2)}`;

    taxAmountEl.textContent =
    `₹${tax.toFixed(2)}`;

    grandTotalEl.textContent =
    `₹${grandTotal.toFixed(2)}`;
}

/* ==========================
   PREVIEW
========================== */

function generatePreview(){

    const companyName =
    document.getElementById(
    "companyName"
    ).value;

    const clientName =
    document.getElementById(
    "clientName"
    ).value;

    const invoiceNumber =
    document.getElementById(
    "invoiceNumber"
    ).value;

    const invoiceDate =
    document.getElementById(
    "invoiceDate"
    ).value;

    let html =

    `
    <h3>${companyName || "Your Company"}</h3>

    <p>
    Invoice No:
    ${invoiceNumber}
    </p>

    <p>
    Date:
    ${invoiceDate}
    </p>

    <hr>

    <h4>
    Client:
    ${clientName || "Client Name"}
    </h4>

    <br>

    <table style="width:100%;">

        <tr>

            <th>Product</th>

            <th>Qty</th>

            <th>Total</th>

        </tr>
    `;

    products.forEach(
    item => {

        html +=

        `
        <tr>

            <td>
            ${item.name}
            </td>

            <td>
            ${item.qty}
            </td>

            <td>
            ₹${item.total}
            </td>

        </tr>
        `;

    });

    html +=

    `
    </table>

    <br>

    <strong>

    Grand Total:

    ${grandTotalEl.textContent}

    </strong>
    `;

    invoicePreview.innerHTML =
    html;
}

/* ==========================
   STORAGE
========================== */

function saveProducts(){

    localStorage.setItem(

        "invoiceProducts",

        JSON.stringify(products)

    );

    renderProducts();
}

function loadProducts(){

    products =

    JSON.parse(

    localStorage.getItem(
    "invoiceProducts"
    )

    ) || [];

    renderProducts();
}

/* ==========================
   PDF
========================== */

function downloadPDF(){

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    doc.setFontSize(18);

    doc.text(
    "Invoice Report",
    20,
    20
    );

    doc.setFontSize(12);

    doc.text(

    invoicePreview
    .innerText,

    20,

    40

    );

    doc.save(
    "invoice.pdf"
    );

    showToast(
    "PDF Downloaded"
    );
}

/* ==========================
   PRINT
========================== */

function printInvoice(){

    const printWindow =

    window.open(
    "",
    "",
    "width=900,height=700"
    );

    printWindow.document.write(

    `
    <html>

    <head>

    <title>
    Invoice
    </title>

    </head>

    <body>

    ${invoicePreview.innerHTML}

    </body>

    </html>
    `
    );

    printWindow.document.close();

    printWindow.print();
}

/* ==========================
   CLEAR
========================== */

function clearInvoice(){

    if(
        !confirm(
        "Clear Invoice?"
        )
    ){
        return;
    }

    products = [];

    localStorage.removeItem(
    "invoiceProducts"
    );

    renderProducts();

    invoicePreview.innerHTML =

    `
    <p>
    Invoice preview will appear here...
    </p>
    `;

    showToast(
    "Invoice Cleared"
    );
}

/* ==========================
   THEME
========================== */

themeBtn.addEventListener(
"click",
() => {

    document.body
    .classList.toggle(
    "light-mode"
    );

    if(
    document.body
    .classList.contains(
    "light-mode"
    )
    ){

        themeBtn.textContent =
        "🌙 Dark Mode";

    }else{

        themeBtn.textContent =
        "☀ Light Mode";
    }

}
);

/* ==========================
   TOAST
========================== */

function showToast(message){

    const toast =
    document.getElementById(
    "toast"
    );

    toast.textContent =
    message;

    toast.classList.add(
    "show"
    );

    setTimeout(() => {

        toast.classList.remove(
        "show"
        );

    },2000);
}

/* ==========================
   AUTO PREVIEW
========================== */

document
.querySelectorAll(
"input"
)
.forEach(input => {

    input.addEventListener(
    "input",
    generatePreview
    );

});

/* ==========================
   INIT
========================== */

loadProducts();
generatePreview();