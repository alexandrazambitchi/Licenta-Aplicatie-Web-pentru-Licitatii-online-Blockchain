pragma solidity >=0.5.0 <0.9.0;

contract AuctionHouse {
    string public name;
    address payable public owner;
    uint public productCount = 0;
    uint public auctionCount = 0;
    uint public productsOnAuction = 0;
    uint public activeAuction = 0;
    uint public artistCount = 0;
    uint public donationsCount = 0;
    uint public soldCount = 0;
    mapping (uint => Artist) public artists;
	mapping(uint => Product) public products;
    mapping(uint => Auction) public auctionList;
    mapping(address => uint) public donations;

	struct Product{
        uint id_product;
        string name;
        uint price;
        uint id_artist;
        string category;
        string description;
        string image_hash;
        bool purchased;
        bool auction_started;
        bool auction_ended;
        bool active;
    }

    struct Auction{
        uint id_auction;
        uint target_price;
        uint auctionEndTime;
        address payable highestBidder;
        uint highestBid;
        uint offerCount;
        bool ended;
        uint id_product;
        bool moneySent;
        bool sellUnderTarget;
        mapping(address => uint) clients;
    }

    struct Artist{
        uint id_artist;
        string artist_name;
        string details;
        uint amount_collected;
    }

    event ProductCreated(
        uint id_product,
        string name,
        uint price,
        uint id_artist,
        string category,
        string description,
        string image_hash
    );

    event ProductUpdated(
        uint id_product,
        string name,
        uint price,
        uint id_artist,
        string category,
        string description,
        string image_hash
    );

    event ProductSold(
        uint id_product,
        string name,
        uint price,
        uint id_artist,
        string category,
        string description,
        string image_hash,
        bool purchased,
        uint priceSold,
        address payable winner
    );

    event ArtistCreated(
        uint id_artist,
        string artist_name,
        string details
    );

    event ArtistUpdated(
        uint id_artist,
        string artist_name,
        string details
    );

    event IncreasedDonation(
        uint id_artist,
        string artist_name,
        uint amount
    );

    event AuctionCreated(
        uint id_auction,
        uint target_price,
        uint auctionEndTime,
        uint id_product
    );

    event AuctionUpdated(
        uint id_auction,
        uint target_price,
        uint auctionEndTime,
        address payable highestBidder,
        uint highestBid,
        uint offerCount,
        bool ended,
        uint id_product, 
        bool moneySent,
        bool sellUnderTarget
    );

    event NewHighestBid(
        address payable bidder, 
        uint amount
    );

    event AuctionEnded(
        address payable winner, 
        uint amount
    );
    

	constructor() public {
		name = "Auction House of Art";
        owner = msg.sender;
	}

    function createArtist (string memory _name, string memory _details) public {
        require(bytes(_name).length > 0, "name too short");
        require(bytes(_details).length > 0, "empty details");
        artistCount++;
        artists[artistCount] = Artist(artistCount, _name, _details, 0);
        emit ArtistCreated(artistCount, _name, _details);
    }

    function editArtist (uint _id, string memory _name, string memory _details) public {
        require(bytes(_name).length > 0);
        require(bytes(_details).length > 0);
        Artist storage _artist = artists[_id];
        _artist.artist_name= _name;
        _artist.details = _details;
        artists[_id] = _artist;
        emit ArtistUpdated(_id, _name, _details);
    }

	function createProduct (string memory _name, uint _price, uint _id_artist, string memory _category, string memory _description, string memory _imageHash) public {
        require(msg.sender == owner);
        require(bytes(_name).length > 0);
        require(_price > 0);
        require(bytes(_category).length > 0);
        require(bytes(_description).length > 0);
        require(bytes(_imageHash).length > 0);
		productCount++;
        productsOnAuction++;
        products[productCount] = Product(productCount, _name, _price, _id_artist, _category, _description, _imageHash, false, false, false, true);
		emit ProductCreated(productCount, _name, _price, _id_artist, _category, _description, _imageHash);
	}

    function editProduct (uint _id, string memory _name, uint _price, uint id_artist, string memory _category, string memory _description, string memory _imageHash) public {
        require(msg.sender == owner);
        require(bytes(_name).length > 0);
        require(_price > 0);
        require(bytes(_category).length > 0);
        require(bytes(_description).length > 0);
        require(bytes(_imageHash).length > 0);
        Artist storage _artist = artists[id_artist];
        require(_artist.id_artist > 0 && _artist.id_artist <= artistCount);
        Product storage _product = products[_id];
        _product.name= _name;
        _product.price = _price;
        _product.id_artist = id_artist;
        _product.category = _category;
        _product.description = _description;
        _product.image_hash = _imageHash;
        products[productCount] = _product;
        emit ProductUpdated(productCount, _name, _price, id_artist, _category, _description, _imageHash);
    }

    function deleteProduct (uint _id_product) public {
        Product storage _product = products[_id_product];
        require(_product.id_product > 0 && _product.id_product <= productCount, "Product not found");
        _product.purchased = true;
        _product.auction_ended = false;
        _product.active = false;
        products[_id_product] = _product;
        productsOnAuction--;
        if(_product.auction_started){
            activeAuction--;
        }
        emit ProductSold(_product.id_product, _product.name, _product.price, _product.id_artist, _product.category, _product.description, _product.image_hash, _product.purchased, 0, address(0));
    }

    function createAuction (uint _id) public {
        Product storage _product = products[_id];
        require(_product.id_product > 0 && _product.id_product <= productCount);
        require(msg.sender == owner);
        _product.auction_started = true;
        auctionCount++;
        activeAuction++;
        uint endTime = now + 10 days;
        uint target_price = _product.price * 2;
        products[_id] = _product;
        auctionList[auctionCount] = Auction(auctionCount, target_price, endTime, address(0), 0, 0, false, _product.id_product, false, false);
        emit AuctionCreated(auctionCount, target_price, endTime, _product.id_product);
    }

    function editAuction (uint _id, uint _target_price) public{
        Auction storage _auction = auctionList[_id];
        require(_auction.id_auction > 0 && _auction.id_auction <= auctionCount, "Auction not found");
        Product storage _product = products[_id];
        require (_target_price > _product.price);
        
        _auction.target_price = _target_price;
        auctionList[_id] = _auction;
        emit AuctionUpdated(_id, _auction.target_price, _auction.auctionEndTime, _auction.highestBidder, _auction.highestBid, _auction.offerCount, _auction.ended, _auction.id_product, _auction.moneySent, _auction.sellUnderTarget);
    }

    function bid (uint auction_id, uint bid_value, uint product_id) public payable {
        Product storage _product = products[product_id];
        require(_product.id_product > 0 && _product.id_product <= productCount, "Product not found");
        Auction storage _auction = auctionList[auction_id];
        require(_auction.id_auction > 0 && _auction.id_auction <= auctionCount, "Auction not found");
        require(block.timestamp <= _auction.auctionEndTime, "Auction ended");
        require(msg.sender != owner, "Owner!!!");
        require(bid_value > _auction.highestBid, "Value too little");
        if (_auction.highestBid >= _product.price){
            _auction.clients[_auction.highestBidder] = _auction.highestBid;
        }        
        _auction.offerCount += 1;
        _auction.highestBidder = msg.sender;
        _auction.highestBid = bid_value;
        auctionList[auction_id] = _auction;
        emit AuctionUpdated(auction_id, _auction.target_price, _auction.auctionEndTime, msg.sender, bid_value, _auction.offerCount, _auction.ended, product_id, _auction.moneySent, _auction.sellUnderTarget);
        emit NewHighestBid(msg.sender, bid_value);
    }

    function donation (uint value, uint artist_id) public payable {
        Artist storage _artist = artists[artist_id];
        require (value > 0);
        if(donations[msg.sender]==0){
            donationsCount++;
        }
        donations[msg.sender] += value;
        _artist.amount_collected += value;
        address(owner).transfer(msg.value);
        emit IncreasedDonation(artist_id, _artist.artist_name, msg.value);
    }
    
    function sendValue(uint _id) public payable {
        Auction storage _auction = auctionList[_id];
        _auction.moneySent = true;
        auctionList[_id] = _auction;
        emit AuctionUpdated(_id, _auction.target_price, _auction.auctionEndTime, _auction.highestBidder, _auction.highestBid, _auction.offerCount, _auction.ended, _auction.id_product, _auction.moneySent, _auction.sellUnderTarget);
        address(owner).transfer(msg.value);
    }

    function sellingUnderTarget(uint _id) public payable {
        require(msg.sender == owner);
        Auction storage _auction = auctionList[_id];
        _auction.sellUnderTarget = true;
        auctionList[_id] = _auction;
        emit AuctionUpdated(_id, _auction.target_price, _auction.auctionEndTime, _auction.highestBidder, _auction.highestBid, _auction.offerCount, _auction.ended, _auction.id_product, _auction.moneySent, _auction.sellUnderTarget);
    }

    function auctionEnd(uint _id) public payable {
        Auction storage _auction = auctionList[_id];
        require(_auction.id_auction > 0 && _auction.id_auction <= auctionCount);
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
        
        _product.auction_ended = true;
        _auction.ended = true;
        productsOnAuction--;
        activeAuction--;
        soldCount++;

        auctionList[_id] = _auction;
        products[_auction.id_product] = _product;
        emit AuctionEnded(_auction.highestBidder, _auction.highestBid);
        emit ProductSold(_product.id_product, _product.name, _product.price, _product.id_artist, _product.category, _product.description, _product.image_hash, _product.purchased, _auction.highestBid, _auction.highestBidder);

    }
    
    
}
