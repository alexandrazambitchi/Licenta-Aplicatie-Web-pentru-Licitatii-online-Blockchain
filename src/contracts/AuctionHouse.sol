pragma solidity ^0.5.0;
// pragma solidity >=0.7.0 <0.9.0;

/**
 * The AuctionHouse
 contract does this and that...
 */

contract AuctionHouse {
	string public name;
	uint public productCount = 0;
    uint public auctionCount = 0;
	mapping(uint => Product) public products;
    mapping(uint => Auction) public auctionList;
    

	struct Product{
        uint id_product;
        string name;
        uint price;
        string artist_name;
        address payable owner;
        bool purchased;
        // uint id_auction;
    }

    // struct Client{
    //     uint id_client;
    //     string name;
    //     address payable client_address;
    //     uint bid_value;
    //     // uint auction_id;
    // }

    struct Auction{
        uint id_auction;
        address payable beneficiary;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
        uint clientCount;
        bool ended;
        uint id_product;
        mapping(address => uint) clients;
        mapping(address => string) clientNames;
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

    event AuctionCreated(
        uint id_auction,
        address payable beneficiary,
        uint auctionEndTime,
        address highestBidder,
        uint highestBid,
        uint clientCount,
        bool ended,
        uint id_product
    );

    event AuctionUpdated(
        uint id_auction,
        address payable beneficiary,
        uint auctionEndTime,
        address highestBidder,
        uint highestBid,
        uint clientCount,
        bool ended,
        uint id_product
    );

    event NewClient(
        uint id_client,
        string name,
        address payable client_address,
        uint bid_value
    );

    event HighestBidIncreased(
        address bidder, 
        uint amount
    );

    event AuctionEnded(
        address winner, 
        uint amount
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

	// function purchaseProduct(uint _id) public payable {
 //        // Fetch the product
 //        Product storage _product = products[_id];
 //        address payable _seller = _product.owner;
 //        // Make sure the product has a valid id
 //        require(_product.id_product > 0 && _product.id_product <= productCount);
 //        // Require that there is enough Ether in the transaction
 //        require(msg.value >= _product.price);
 //        // Require that the product has not been purchased already
 //        require(!_product.purchased);
 //        // Mark as purchased
 //        _product.purchased = true;
 //        // Update the product
 //        products[_id] = _product;
 //        // Pay the seller by sending them Ether
 //        address(_seller).transfer(msg.value);
 //        // Trigger an event
 //        emit ProductPurchased(productCount, _product.name, _product.price, _product.artist_name, msg.sender, true);
 //    }

    function createAuction (uint _id) public {
        Product storage _product = products[_id];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        auctionCount++;
        uint endTime = now + 20 days;
        auctionList[auctionCount] = Auction(auctionCount, msg.sender, endTime, msg.sender, 0, 0, false, _product.id_product);
        emit AuctionCreated(auctionCount, msg.sender, endTime, msg.sender, 0, 0, false, _product.id_product);
    }

    function bid(uint product_id, string memory clientName) public payable {
        Product storage _product = products[product_id];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        // Product storage _product
        // uint auction_id = auctionList[product_id];
        Auction storage _auction = auctionList[product_id];
        require(block.timestamp <= _auction.auctionEndTime);
        require(msg.value > _auction.highestBid);
        require (msg.sender != _auction.beneficiary);
        
        if (_auction.highestBid != 0){
            _auction.clients[_auction.highestBidder] += _auction.highestBid;
            _auction.clientNames[_auction.highestBidder] = clientName;
        }
        _auction.clientCount += 1;
        _auction.highestBidder = msg.sender;
        _auction.highestBid = msg.value;
        auctionList[product_id] = _auction;
        emit AuctionUpdated(_auction.id_auction, _auction.beneficiary, _auction.auctionEndTime, msg.sender, msg.value, _auction.clientCount, _auction.ended, product_id);
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw(uint auction_id) public returns (bool) {
        Auction storage _auction = auctionList[auction_id];
        uint bid_value = _auction.clients[msg.sender];
        if (bid_value > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            _auction.clients[msg.sender] = 0;

            if (!msg.sender.send(bid_value)) {
                //Calling throw not necessary here, simply reset the bid_value owing
                _auction.clients[msg.sender] = bid_value;
                return false;
            }
        }
        return true;
    }
    

    function auctionEnd(uint _id_auction) public {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.
        Auction storage _auction = auctionList[_id_auction];
        require(_auction.id_auction > 0 && _auction.id_auction <= auctionCount);
        
        // 1. Conditions
        require(block.timestamp >= _auction.auctionEndTime, "Auction not yet ended.");
        require(!_auction.ended, "auctionEnd has already been called.");

        // 2. Effects
        _auction.ended = true;
        auctionList[_id_auction] = _auction;

        Product storage _product = products[_auction.id_product];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        require(!_product.purchased);
        _product.purchased = true;
        products[_auction.id_product] = _product;
        emit AuctionEnded(_auction.highestBidder, _auction.highestBid);

        // 3. Interaction
        _auction.beneficiary.transfer(_auction.highestBid);
    }
    
    
}
