pragma solidity ^0.5.0;
// pragma solidity >=0.7.0 <0.9.0;

/**
 * The AuctionHouse
 contract does this and that...
 */

import "./Auction.sol";

contract AuctionHouse {
	string public name;
	uint public productCount = 0;
	mapping(uint => Product) public products;

	struct Product{
        uint id_product;
        string name;
        uint price;
        string artist_name;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id_product,
        string name,
        uint price,
        string artist_name,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id_product,
        string name,
        uint price,
        string artist_name,
		address payable owner,
        bool purchased
    );

    event AuctionDetails(
        uint id_product,
        address payable beneficiary,
        Auction auction
    );

	constructor() public {
		name = "Auction House of Art";
	}

	function createProduct (string memory _name, uint _price, string memory _artist) public {
		require(bytes(_name).length > 0);
        require(_price > 0);
        require (bytes(_artist).length > 0);
		productCount++;
		products[productCount] = Product(productCount, _name,_price, _artist, msg.sender, false);
		emit ProductCreated(productCount, _name,_price, _artist, msg.sender, false);
	}

	function purchaseProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id_product > 0 && _product.id_product <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require that the product has not been purchased already
        require(!_product.purchased);
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, _product.artist_name, msg.sender, true);
    }

    function createAuction (uint _id) public {
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id_product > 0 && _product.id_product <= productCount);
        require(!_product.purchased);
        require (time!=0);
        Auction new_auction = Auction();
        emit AuctionDetails(_id, _seller, new_auction);
        
    }
    
}
