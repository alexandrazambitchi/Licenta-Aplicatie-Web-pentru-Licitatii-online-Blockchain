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
	})

	describe('products', async () => {
		let result, productCount

		before(async () => {
			result = await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', { from: seller})
			productCount = await auctionHouse.productCount()
			new_auction = await auctionHouse.createAuction(productCount, { from: seller})
			auctionCount = await auctionHouse.auctionCount()
			bid = await auctionHouse.bid(productCount, 'John', { from: buyer, value: '2'})
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
		    assert.equal(event.owner, seller, 'owner is correct')
			assert.equal(event.purchased, false, 'Purchased is correct')

			// Failure
			await await auctionHouse.createProduct('', web3.utils.toWei('1', 'Ether'), 'John Doe').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', 0, 'John Doe').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), '').should.be.rejected;
		})


		it('create auction', async () => {
			assert.equal(auctionCount, 1)
		    const event = new_auction.logs[0].args
		    assert.equal(event.id_auction.toNumber(), auctionCount.toNumber(), 'id is correct')
		    assert.equal(event.beneficiary, seller, 'beneficiary is correct')
		    assert.equal(event.highestBidder, seller, 'highest bidder is correct')
		    assert.equal(event.highestBid, '0', 'highestBid is correct')
		    assert.equal(event.clientCount, '0', 'client count is correct')
			assert.equal(event.ended, false, 'Ended is correct')
			assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'product is correct')

			await await auctionHouse.createAuction('').should.be.rejected;
		})

		it('bids', async () => {
			const event1 = bid.logs[0].args
			assert.equal(event1.id_auction.toNumber(), auctionCount.toNumber(), 'id is correct')
		    assert.equal(event1.beneficiary, seller, 'beneficiary is correct')
			assert.equal(event1.highestBidder, buyer, 'highest bidder is correct')
			assert.equal(event1.highestBid, '2', 'highestBid is correct')
			assert.equal(event1.clientCount, '1', 'client count is correct')
			assert.equal(event1.ended, false, 'Ended is correct')
			assert.equal(event1.id_product.toNumber(), productCount.toNumber(), 'product is correct')

			const event2 = bid.logs[1].args
			assert.equal(event2.bidder, buyer, 'bidder is correct')
			assert.equal(event2.amount, '2', 'bid value is correct')

			await await auctionHouse.createProduct(0, 'John Doe').should.be.rejected;
			await await auctionHouse.createProduct(1, '').should.be.rejected;
		})

		// it('ends', async () => {
		// 	const event = ended.logs[0].args
		// 	assert.equal(event.winner, buyer, 'winner is correct')
		// 	assert.equal(event.amount, '2', 'amount is correct')

		// 	await await auctionHouse.auctionEnd('').should.be.rejected;
		// })

		it('lists products', async () => {
			const product = await auctionHouse.products(productCount)
			assert.equal(product.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(product.name, 'Picture1', 'name is correct')
		    assert.equal(product.price, '1000000000000000000', 'price is correct')
		    assert.equal(product.artist_name, 'John Doe', 'Artist name is correct')
		    assert.equal(product.owner, seller, 'owner is correct')
			assert.equal(product.purchased, false, 'Purchased is correct')
		})

		// it('sells products', async () => {
		// 	let oldSellerBalance
  //     		oldSellerBalance = await web3.eth.getBalance(seller)
  //     		oldSellerBalance = new web3.utils.BN(oldSellerBalance)

		// 	result = await auctionHouse.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
			
		// 	const event = result.logs[0].args
		//     assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		//     assert.equal(event.name, 'Picture1', 'name is correct')
		//     assert.equal(event.price, '1000000000000000000', 'price is correct')
		//     assert.equal(event.artist_name, 'John Doe', 'Artist name is correct')
		//     assert.equal(event.owner, buyer, 'owner is correct')
		// 	assert.equal(event.purchased, true, 'Purchased is correct')

		// 	let newSellerBalance
		//     newSellerBalance = await web3.eth.getBalance(seller)
		//     newSellerBalance = new web3.utils.BN(newSellerBalance)

		//     let price
		//     price = web3.utils.toWei('1', 'Ether')
		//     price = new web3.utils.BN(price)

		//     const exepectedBalance = oldSellerBalance.add(price)

		//     assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

		//       // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
		//     await auctionHouse.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
		//       // FAILURE: Buyer tries to buy without enough ether
		//     await auctionHouse.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
		//       // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
		//     await auctionHouse.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
		//       // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
		//     await auctionHouse.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
		// })

	})


})