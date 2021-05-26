const AuctionHouse = artifacts.require('./AuctionHouse.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('AuctionHouse', ([deployer, seller, buyer]) =>{
	let auctionHouse

	before(async () => {
		auctionHouse = await AuctionHouse.deployed()
	})

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await auctionHouse.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it('has a name', async () => {
			const name = await auctionHouse.name()
			assert.equal(name, 'Auction House of Art')
		})

		it('has an owner', async () => {
			const owner = await auctionHouse.owner()
			assert.equal(owner, deployer)
		})

	})

	describe('products', async () => {
		let result, productCount, new_auction, auctionCount, bid

		before(async () => {
			// this.enableTimeouts(false)
			// setOwner = await auctionHouse.setOwner({ from: deployer})
			result = await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123')
			productCount = await auctionHouse.productCount()
			new_auction = await auctionHouse.createAuction(productCount, { from: deployer})
			auctionCount = await auctionHouse.auctionCount()
			bid = await auctionHouse.bid(auctionCount, web3.utils.toWei('2', 'Ether'), productCount, { from: buyer})
			
			// ended = await auctionHouse.auctionEnd(auctionCount)
		})


		it('create products', async () => {
			// Success
			assert.equal(productCount, 1)
		    const event = result.logs[0].args
		    assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(event.name, 'Picture1', 'name is correct')
		    assert.equal(event.price, '1000000000000000000', 'price is correct')
		    assert.equal(event.artist_name, 'John Doe', 'Artist name is correct')
		    assert.equal(event.category, 'painting', 'Type is correct')
		    assert.equal(event.description, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Description is correct')
		    assert.equal(event.image_hash, 'hash123', 'Image is correct')
			assert.equal(event.purchased, false, 'Purchased is correct')
			assert.equal(event.auction_started, false, 'Auction started is correct')

			// Failure
			await await auctionHouse.createProduct('', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', 0, 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), '', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', '', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '').should.be.rejected;
		})


		it('create auction', async () => {
			assert.equal(auctionCount, 1)
		    const event = new_auction.logs[0].args
		    assert.equal(event.id_auction.toNumber(), auctionCount.toNumber(), 'id is correct')
		    assert.equal(event.highestBidder, 0, 'highest bidder is correct')
		    assert.equal(event.highestBid, '1000000000000000000', 'highestBid is correct')
		    assert.equal(event.offerCount, '0', 'client count is correct')
			assert.equal(event.ended, false, 'Ended is correct')
			assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'product is correct')

			await await auctionHouse.createAuction('').should.be.rejected;
		})

		it('bids', async () => {
			const event1 = bid.logs[0].args
			assert.equal(event1.id_auction.toNumber(), auctionCount.toNumber(), 'id is correct')
			assert.equal(event1.highestBidder, buyer, 'highest bidder is correct')
			assert.equal(event1.highestBid, '2000000000000000000', 'highestBid is correct')
			assert.equal(event1.offerCount, '1', 'client count is correct')
			assert.equal(event1.ended, false, 'Ended is correct')
			assert.equal(event1.id_product.toNumber(), productCount.toNumber(), 'product is correct')

			const event2 = bid.logs[1].args
			assert.equal(event2.bidder, buyer, 'bidder is correct')
			assert.equal(event2.amount, '2000000000000000000', 'bid value is correct')

			await await auctionHouse.bid(0, 'John Doe').should.be.rejected;
			await await auctionHouse.bid(1, '').should.be.rejected;
		})

		it('lists products', async () => {
			const product = await auctionHouse.products(productCount)
			assert.equal(product.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(product.name, 'Picture1', 'name is correct')
		    assert.equal(product.price, '1000000000000000000', 'price is correct')
		    assert.equal(product.artist_name, 'John Doe', 'Artist name is correct')
			assert.equal(product.purchased, false, 'Purchased is correct')
		})

	})


})