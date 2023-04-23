// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ILandMinting{
   function transferFrom (address from, address to, uint256 tokenId) external;
   function ownerOf(uint256 tokenId) external returns(address owner); 
}

contract landTrading {
    event Selling(uint indexed landId, address indexed seller, uint indexed price);
    event CancelSelling(uint indexed landId, address indexed seller);
    event Buying(uint indexed landId, address indexed buyer, uint indexed price);

    ILandMinting landNFT;
    
    mapping(uint =>bool) public forSale;
    mapping(uint=>uint) public price;

    modifier _ownerOf(uint id){
        require(msg.sender == landNFT.ownerOf(id),"Not the actual owner");
        _;
    }
    constructor(address _landNFT){
        landNFT = ILandMinting(_landNFT);
    }
    
    function sell(uint _id,uint _price) external _ownerOf(_id) {
        require(!forSale[_id],"ALREADY FOR SALE");
        forSale[_id] = true;
        price[_id] = _price;
        landNFT.transferFrom(msg.sender,address(this),_id);
        emit Selling(_id,msg.sender,_price);
    }

    function cancelSelling(uint _id)external _ownerOf(_id){
        require(forSale[_id],"NOT FOR SALE");
        forSale[_id] = false;
        landNFT.transferFrom(address(this),msg.sender,_id);//change to transfer if possible
        emit CancelSelling(_id,msg.sender);
    }

    function buy(uint _id) external payable{
        require(forSale[_id],"NOT FOR SALE");
        require(msg.sender != landNFT.ownerOf(_id),"NOT ALLOWING");
        require(msg.value == price[_id],"NOT ENOUGH MONEY");
        sendToOwner(msg.value,_id);
        landNFT.transferFrom(address(this),msg.sender,_id);
        require(landNFT.ownerOf(_id)==msg.sender,"I think transfer failled");
        emit Buying(_id,msg.sender,msg.value);
    }

    function sendToOwner(uint _price,uint _id) internal {
        require(_price >0,"PLOBLEMO");
        require(address(this).balance >= _price,"PLOBLEMO");
        (bool success,) = payable(landNFT.ownerOf(_id)).call{value:_price}("");
        require(success,"Not sent");
    }
    
}