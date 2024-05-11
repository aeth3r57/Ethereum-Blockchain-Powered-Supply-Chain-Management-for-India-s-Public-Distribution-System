// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract pds {

    address public owner;
    address public marketyardAdmin =0xA7d3364E8FD28F35CC7Ff3302f27e6CC6886eac6;
    address public warehouseAdmin =0xdd061FA24c705A2E7CB4500b7e356b148a6945f5;
    address public rationshopAdmin =0x63b192Df345aE4e84E14bbb059643b4bab074287;

    struct entity {
        uint256 wheat;
        uint256 rice;
        uint256 sugar;
    }

    struct shipments {
        uint256 id;
        uint256 wheat;
        uint256 rice;
        uint256 sugar;
    }

    struct summary {
        uint256 id;
        uint256 wheat;
        uint256 rice;
        uint256 sugar;
        string from;
        string to;
        string status;
    }

    entity public marketyard;
    entity public warehouse;
    entity public rationshop;

    shipments[] public arrWHapproval;
    shipments[] public arrRSapproval;
    shipments[] public REJbyWH;
    shipments[] public REJbyRS;
    summary[] public Summary;

    uint256 public shipmentID; // Counter for incrementing transfer request IDs

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    modifier onlyMarketyardAdmin() {
        require(msg.sender == marketyardAdmin, "Only marketyard admin can call this function");
        _;
    }

    modifier onlyWarehouseAdmin() {
        require(msg.sender == warehouseAdmin, "Only warehouse admin can call this function");
        _;
    }

    modifier onlyRationshopAdmin() {
        require(msg.sender == rationshopAdmin, "Only rationshop admin can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        marketyard = entity(0, 0, 0);
        warehouse = entity(0, 0, 0);
        rationshop = entity(0, 0, 0);
        shipmentID = 0; // Initialize the counter
    }

    function MYdeposit(uint256 _wheat, uint256 _rice, uint256 _sugar) public onlyMarketyardAdmin{
        marketyard.wheat += _wheat;
        marketyard.rice += _rice;
        marketyard.sugar += _sugar;
    }

    function requestTransferToWarehouse(uint256 _wheat, uint256 _rice, uint256 _sugar) public onlyMarketyardAdmin{
        // Increment the transfer request counter
        shipmentID++;
        // Add the request with the incremented ID
        arrWHapproval.push(shipments(shipmentID, _wheat, _rice, _sugar));
    }

    function approveTransferToWarehouse(uint256 id) public onlyWarehouseAdmin{
        for (uint256 i = 0; i < arrWHapproval.length; i++) {
            if (arrWHapproval[i].id == id) {
                shipments storage request = arrWHapproval[i];

                marketyard.wheat -= request.wheat;
                marketyard.rice -= request.rice;
                marketyard.sugar -= request.sugar;
            
                warehouse.wheat += request.wheat;
                warehouse.rice += request.rice;
                warehouse.sugar += request.sugar;

                Summary.push(summary(id, request.wheat, request.rice, request.sugar,"Market Yard","Warehouse","Approved"));
                // Remove the request from the array after approval
                removeWHApprovalRequest(i);
                return;
            }
        }
        revert("Request with given ID not found");
    }

    function getWHApprovalRequestsCount() public view returns (uint256) {
        return arrWHapproval.length;
    }

    function removeWHApprovalRequest(uint256 i) internal {
        for (uint256 j = i; j < arrWHapproval.length - 1; j++) {
            arrWHapproval[j] = arrWHapproval[j + 1];
        }
        arrWHapproval.pop();
        return;
    }
    
    
    function rejectTransferToWarehouse(uint256 id) public onlyWarehouseAdmin{
        for (uint256 i = 0; i < arrWHapproval.length; i++) {
            if (arrWHapproval[i].id == id) {
                shipments storage request = arrWHapproval[i];
                // Deduct the rejected shipment from the source inventory
                marketyard.wheat -= request.wheat;
                marketyard.rice -= request.rice;
                marketyard.sugar -= request.sugar;
                // Add the rejected shipment to the REJbyWH array
                REJbyWH.push(request);
                Summary.push(summary(id, request.wheat, request.rice, request.sugar,"Market Yard","Warehouse","Rejected"));
                // Remove the request from the array after rejection
                removeWHApprovalRequest(i);
                return;
            }
        }
        revert("Request with given ID not found");
    }


    function requestTransferToRationShop(uint256 _wheat, uint256 _rice, uint256 _sugar) public onlyWarehouseAdmin {
        // Increment the transfer request counter
        shipmentID++;
        // Add the request with the incremented ID
        arrRSapproval.push(shipments(shipmentID, _wheat, _rice, _sugar));
    }

    function approveTransferToRationShop(uint256 id) public onlyRationshopAdmin{
        for (uint256 i = 0; i < arrRSapproval.length; i++) {
            if (arrRSapproval[i].id == id) {
                shipments storage request = arrRSapproval[i];

                warehouse.wheat -= request.wheat;
                warehouse.rice -= request.rice;
                warehouse.sugar -= request.sugar;

                rationshop.wheat += request.wheat;
                rationshop.rice += request.rice;
                rationshop.sugar += request.sugar;

                Summary.push(summary(id, request.wheat, request.rice, request.sugar,"Warehouse","Ration Shop","Approved"));
                // Remove the request from the array after approval
                removeRSApprovalRequest(i);
                return;
            }
        }
        revert("Request with given ID not found");
    }
    function getRSApprovalRequestsCount() public view returns (uint256) {
        return arrRSapproval.length;
    }

    function getSummaryCount() public view returns (uint256) {
        return Summary.length;
    }

    function    (uint256 i) internal {
        for (uint256 j = i; j < arrRSapproval.length - 1; j++) {
            arrRSapproval[j] = arrRSapproval[j + 1];
        }
        arrRSapproval.pop();
        return;
    }

    function rejectTransferToRationShop(uint256 id) public onlyRationshopAdmin{
        for (uint256 i = 0; i < arrRSapproval.length; i++) {
            if (arrRSapproval[i].id == id) {
                shipments storage request = arrRSapproval[i];
                // Deduct the rejected shipment from the source inventory
                warehouse.wheat -= request.wheat;
                warehouse.rice -= request.rice;
                warehouse.sugar -= request.sugar;
                // Add the rejected shipment to the REJbyRS array
                REJbyRS.push(request);
                Summary.push(summary(id, request.wheat, request.rice, request.sugar,"Warehouse","Ration Shop","Rejected"));
                // Remove the request from the array after rejection
                removeRSApprovalRequest(i);
                return;
            }
        }
        revert("Request with given ID not found");
    }

    function getarrWHapproval() public view returns( shipments[] memory ){
        return arrWHapproval;
    }

    function getarrRSapproval() public view returns( shipments[] memory ){
        return arrRSapproval;
    }

    
    function paymoney(uint256 totalPriceWei) public payable {
        // Transfer Ether to the specified account address
        payable(rationshopAdmin).transfer(totalPriceWei);
    }

    function reduceStock(string memory cardType, uint256 numAdults, uint256 numChildren) public returns(uint256){
        require(numAdults > 0 || numChildren > 0, "At least one adult or child required");
        
        uint256 wheatQty;
        uint256 wheatpricepaise;
        uint256 riceQty;
        uint256 sugarQty;
        uint256 sugarpricepaise;
        uint256 totalpricepaise;
        
        if (keccak256(bytes(cardType)) == keccak256(bytes("PHH"))) {
            wheatQty = 5;
            wheatpricepaise = 3750;
            riceQty = 4 * numAdults + 2 * numChildren;
            if (riceQty<=12){
                riceQty=12;
            }
            if (riceQty>=20){
                riceQty=20;
            }
            sugarQty = (numAdults + numChildren);
            sugarpricepaise = sugarQty * 2500;

        } else if (keccak256(bytes(cardType)) == keccak256(bytes("PHH-AAY"))) {
            wheatQty = 5;
            wheatpricepaise = 3750;
            riceQty = 35;
            sugarQty = (numAdults + numChildren);
            sugarpricepaise = sugarQty * 1350;

        } else if (keccak256(bytes(cardType)) == keccak256(bytes("NPHH"))) {
            wheatQty = 5;
            wheatpricepaise = 3750;
            riceQty = 4 * numAdults + 2 * numChildren;
            if (riceQty<=12){
                riceQty=12;
            }
            if (riceQty>=20){
                riceQty=20;
            }
            sugarQty = (numAdults + numChildren);
            sugarpricepaise = sugarQty * 2500;

        } else if (keccak256(bytes(cardType)) == keccak256(bytes("NPHH-S"))) {
            wheatQty = 5;
            wheatpricepaise = 3750;
            riceQty = 0;
            sugarQty = 3 +((numAdults + numChildren));
            sugarpricepaise = (numAdults + numChildren) * 2500;

        } else {
            revert("Invalid card type");
        }
        
        require(rationshop.wheat >= wheatQty, "Insufficient wheat stock");
        require(rationshop.rice >= riceQty, "Insufficient rice stock");
        require(rationshop.sugar >= sugarQty, "Insufficient sugar stock");
        
        rationshop.wheat -= wheatQty;
        rationshop.rice -= riceQty;
        rationshop.sugar -= sugarQty;

        totalpricepaise = wheatpricepaise + sugarpricepaise;

        return totalpricepaise;

    }

}