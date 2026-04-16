const PDFDocument = require("pdfkit");
const Settings = require("../models/Setting");

const generateInvoice = async (sale, res) => {
    try{

        const settings = await Settings.findOne();

        const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${sale.invoiceNumber}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // SHOP HEADER
    doc
        .fontSize(24)
        .fillColor("#1f2937")
        .text(settings?.shopName || "My Shop", 50, 40);

    doc
        .fontSize(10)
        .fillColor("gray")
        .text(settings?.address || "", 50, 70)
        .text(`GST No. ${settings?.gstNumber || ""}`, 50, 85)
        .text("Phone: 9921923609", 50, 100);


    doc
        .fontSize(14)
        .fillColor("#000")
        .text("INVOICE", 450, 40);
    
    doc
        .fontSize(10)
        .text(`Invoice No: ${sale.invoiceNumber}`, 400, 70)
        .text(
            `Date: ${new Date(sale.createdAt).toLocaleDateString()}`,
            400,
            85
        );

    doc.moveDown(4);

    // INVOICE DETAILS
    doc
        .fontSize(12)
        .text(`Customer: ${sale.customerName}`, 50, 130);

    // TABLE 
    
    const tableTop = 170;

    //table header
    
    doc
        .rect(50, tableTop, 500, 20)
        .fill("#4f46e5");

    doc.fillColor("#fff");

    doc.text("Product", 60, tableTop + 7);
    doc.text("Qty", 260, tableTop + 7);
    doc.text("Price", 330, tableTop + 7);
    doc.text("Total", 450, tableTop + 7);

    doc.fillColor("#000");

    let y = tableTop + 35;

    // ITEMS
    sale.items.forEach((item) => {
        doc.text(item.name, 60, y);
        doc.text(item.quantity.toString(), 260, y);
        doc.text(`${item.price}`, 340, y);
        doc.text(`${item.total}`, 450, y);

        y += 20;

        doc 
            .moveTo(50, y - 5)
            .lineTo(550, y - 5)
            .strokeColor("#e5e7eb")
            .stroke();
    });


     // TOTAL SECTION
    
    y += 20;

    const tax = sale.grandTotal - sale.subTotal;

    doc 
        .rect(320, y, 250, 100)
        .stroke("#d15db");

    doc
        .fontSize(12)
        .text(`Subtotal: ${sale.subTotal}`, 340, y + 10);
    
    doc.text(`Tax: ${tax}`, 340, y + 30);

    doc
        .fontSize(14)
        .text(`Grand Total: ${sale.grandTotal}`, 340, y + 50);

    y += 100;

    //payment

    doc
        .fontSize(12)
        .text(`Payment Method: ${sale.paymentMethod.toUpperCase()}`, 50, y);


        // Footer
    doc.moveDown(4);
    doc
        .fontSize(11)
        .fillColor("gray")
        .text("Thank you for shopping with us!", { align: "center" });

    doc.end();

    } catch (error) {
        console.error("Invoice generation error:", error);
    }
    
};

module.exports = generateInvoice;