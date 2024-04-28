const routes = require('next-routes')();
routes
    .add('/marketyard','/marketyardhome')
    .add('/warehouse','/warehousehome2')
    .add('/rationshop','/rationshophome')
    .add('/summary','/shipmentsummary')
    ;
module.exports = routes;