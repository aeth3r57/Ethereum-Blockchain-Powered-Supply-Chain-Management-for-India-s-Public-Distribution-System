const routes = require('next-routes')();
routes
    .add('/marketyard','/marketyardhome')
    .add('/warehouse','/warehousehome')
    .add('/rationshop','/rationshophome')
    .add('/summary','/shipmentsummary')
    .add('/customer','/customerhome')
    
    ;
module.exports = routes;
