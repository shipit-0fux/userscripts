// ==UserScript==
// @name         AutoZone Order History Exporter
// @namespace    https://github.com/shipit-0fux/userscripts
// @version      1.0
// @description  Adds a button to the AutoZone order history page to export all orders to a CSV file.
// @author       zerofux <shipit@zerofux.dev>
// @match        https://www.autozone.com/user/orderHistory*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/shipit-0fux/userscripts
// @supportURL   https://github.com/shipit-0fux/userscripts/issues
// ==/UserScript==

(function () {
'use strict';
function jsonToCsv(jsonData) {
const headers = ['Order ID', 'Order Date', 'Order Status', 'Total Price', 'Item Name', 'Item Price',
            'Item Quantity'];
let csv = headers.join(',') + '\n';
        jsonData.orders.forEach(order => {
const orderId = order.orderId;
const orderDate = order.orderSubmittedDate;
const orderStatus = order.orderStatus;
const totalPrice = order.orderPriceInfo.totalPrice;
            order.shipmentInfoList.forEach(shipment => {
shipment.lineItemList.forEach(item => {
const itemName = item.productInfo.skuDisplayName.replace(/,/g, ''); // Remove commas to avoid CSV issues
const itemPrice = item.lineItemPriceInfo.unitPrice;
const itemQuantity = item.quantity;
csv += `${orderId},${orderDate},${orderStatus},${totalPrice},"${itemName}",${itemPrice},
      ${itemQuantity}\n`;
});
});
});         
        return csv;
}
    // Function to download the CSV file
function downloadCsv(csvData) {
const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
const url = URL.createObjectURL(blob);
link.setAttribute('href', url);
link.setAttribute('download', 'autozone_orders.csv');
link.style.visibility = 'hidden';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}
     // Function to fetch and process order history
async function fetchAndProcessOrders() {
const currentYear = new Date().getFullYear();
const allOrders = { orders: [] };
         for (let year = currentYear; year >= 2020; year--) { // Adjust the starting year as needed
const response = await fetch(`https://www.autozone.com/ecomm/b2c/v3/currentUser/orders?fromDate=
      ${year}0101&toDate=${year}1231`);
const data = await response.json();
if (data.orders && data.orders.length > 0) {
allOrders.orders.push(...data.orders);
}
}
         if (allOrders.orders.length > 0) {
const csvData = jsonToCsv(allOrders);
downloadCsv(csvData);
} else {
alert('No orders found.');
}
}
     // Create and add the download button
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download Order History';
downloadButton.style.position = 'fixed';
downloadButton.style.top = '10px';
downloadButton.style.right = '10px';
downloadButton.style.zIndex = '9999';
downloadButton.style.padding = '10px';
downloadButton.style.backgroundColor = '#007bff';
downloadButton.style.color = 'white';
downloadButton.style.border = 'none';
downloadButton.style.borderRadius = '5px';
downloadButton.style.cursor = 'pointer';
     downloadButton.addEventListener('click', fetchAndProcessOrders);
     document.body.appendChild(downloadButton);
})();