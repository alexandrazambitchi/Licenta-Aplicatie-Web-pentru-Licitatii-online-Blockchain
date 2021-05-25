pragma solidity ^0.5.0;
// pragma solidity >=0.7.0 <0.9.0;

/**
 * The AuctionHouse
 contract does this and that...
 */

contract AuctionHouse {
	string public name;
    address payable public owner;
	uint public productCount = 0;
    uint public auctionCount = 0;
	mapping(uint => Product) public products;
    mapping(uint => Auction) public auctionList;

	struct Product{
        uint id_product;
        string name;
        uint price;
        string artist_name;
        string category;
        string description;
        string image_hash;
        bool purchased;
        bool auction_started;
        bool auction_ended;
    }

    struct Auction{
        uint id_auction;
        // address payable beneficiary;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
        uint offerCount;
        bool ended;
        uint id_product;
        mapping(address => uint) clients;
        // mapping(address => string) clientNames;
    }

    event ProductCreated(
        uint id_product,
        string name,
        uint price,
        string artist_name,
        string category,
        string description,
        string image_hash,
        bool purchased,
        bool auction_started
    );

    event ProductSold(
        uint id_product,
        string name,
        uint price,
        string artist_name,
        string category,
        string description,
        string image_hash,
        bool purchased
    );

    event AuctionCreated(
        uint id_auction,
        // address payable beneficiary,
        uint auctionEndTime,
        address highestBidder,
        uint highestBid,
        uint offerCount,
        bool ended,
        uint id_product
    );

    event AuctionUpdated(
        uint id_auction,
        // address payable beneficiary,
        uint auctionEndTime,
        address highestBidder,
        uint highestBid,
        uint offerCount,
        bool ended,
        uint id_product
    );

    event HighestBidIncreased(
        address bidder, 
        uint amount
    );

    event AuctionEnded(
        address winner, 
        uint amount
    );

    // event SetOwner(address payable owner);
    

	constructor() public {
		name = "Auction House of Art";
        // owner = 0x87334fFB04eF3b2C0194213AB65B74A7989f0671;
        owner = msg.sender;
	}

    // function setOwner() public {
    //     // require (owner == address(0));
    //     owner = address(msg.sender);
    //     emit SetOwner();
    // }

	function createProduct (string memory _name, uint _price, string memory _artist, string memory _category, string memory _description, string memory _imageHash) public {
		require(msg.sender == owner);
        require(bytes(_name).length > 0);
        require(_price > 0);
        require(bytes(_artist).length > 0);
        require(bytes(_category).length > 0);
        require(bytes(_description).length > 0);
        require(bytes(_imageHash).length > 0);
		productCount++;
        products[productCount] = Product(productCount, _name, _price, _artist, _category, _description, _imageHash, false, false, false);
		emit ProductCreated(productCount, _name, _price, _artist, _category, _description, _imageHash, false, false);
	}

    function createAuction (uint _id) public {
        Product storage _product = products[_id];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        require(msg.sender == owner);
        _product.auction_started = true;
        products[_id] = _product;
        auctionCount++;
        uint endTime = now + 20 days;
        auctionList[auctionCount] = Auction(auctionCount, endTime, address(0), _product.price, 0, false, _product.id_product);
        emit AuctionCreated(auctionCount, endTime, address(0), _product.price, 0, false, _product.id_product);
    }

    function bid(uint product_id) public payable {
        Product storage _product = products[product_id];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        Auction storage _auction = auctionList[product_id];
        require(block.timestamp <= _auction.auctionEndTime);
        require(msg.value > _auction.highestBid);
        require(msg.sender != owner);
        if (_auction.highestBid != _product.price){
            _auction.clients[_auction.highestBidder] = _auction.highestBid;
        }
        _auction.offerCount += 1;
        _auction.highestBidder = msg.sender;
        _auction.highestBid = msg.value;
        // _auction.clientNames[_auction.highestBidder] = clientName;
        auctionList[product_id] = _auction;
        emit AuctionUpdated(_auction.id_auction, _auction.auctionEndTime, msg.sender, msg.value, _auction.offerCount, _auction.ended, product_id);
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    // function withdraw(uint auction_id) public returns (bool) {
    //     Auction storage _auction = auctionList[auction_id];
    //     uint bid_value = _auction.clients[msg.sender];
    //     if (bid_value > 0) {
    //         // It is important to set this to zero because the recipient
    //         // can call this function again as part of the receiving call
    //         // before `send` returns.
    //         _auction.clients[msg.sender] = 0;

    //         if (!msg.sender.send(bid_value)) {
    //             //Calling throw not necessary here, simply reset the bid_value owing
    //             _auction.clients[msg.sender] = bid_value;
    //             return false;
    //         }
    //     }
    //     return true;
    // }

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

        Product storage _product = products[_auction.id_product];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        require(!_product.purchased);

        if(_auction.offerCount==0){
            _product.purchased = false;
        }
        else{
            _product.purchased = true;
        }
        
        

        // 2. Effects
        _auction.ended = true;
        auctionList[_id_auction] = _auction;

        _product.auction_ended = true;
        products[_auction.id_product] = _product;

        require (_auction.highestBidder != address(0), "No one bid at this auction");

        emit AuctionEnded(_auction.highestBidder, _auction.highestBid);
        emit ProductSold(_product.id_product, _product.name, _product.price, _product.artist_name, _product.category, _product.description, _product.image_hash, _product.purchased);
        // 3. Interaction
        if(_auction.highestBidder != owner)
            owner.transfer(_auction.highestBid);
    }
    
    
}
