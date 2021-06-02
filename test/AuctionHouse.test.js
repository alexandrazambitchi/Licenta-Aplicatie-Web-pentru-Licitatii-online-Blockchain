const AuctionHouse = artifacts.require('./AuctionHouse.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('AuctionHouse', ([deployer, seller, buyer, account1, account2]) =>{
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
		let result, productCount, new_auction, auctionCount, bid, new_artist, artistCount, edited_artist, editedProduct, editedAuction, donated

		before(async () => {
			// this.enableTimeouts(false)
			// setOwner = await auctionHouse.setOwner({ from: deployer})
			new_artist = await auctionHouse.createArtist("artist1", "details")
			artistCount = await auctionHouse.artistCount()
			edited_artist = await auctionHouse.editArtist(artistCount, 'Artist2', 'details')
			result = await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), artistCount, 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123', {from: deployer})
			productCount = await auctionHouse.productCount()
			editedProduct = await auctionHouse.editProduct(productCount, 'Product1', web3.utils.toWei('1', 'Ether'), artistCount, 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123')
			new_auction = await auctionHouse.createAuction(productCount, { from: deployer})
			auctionCount = await auctionHouse.auctionCount()
			// activeAuction = await auctionHouse.activeAuction()
			// productsOnAuction = await auctionHouse.productsOnAuction()
			editedAuction = await auctionHouse.editAuction(auctionCount, web3.utils.toWei('3', 'Ether'))
			bid = await auctionHouse.bid(auctionCount, web3.utils.toWei('2', 'Ether'), productCount, { from: buyer})
			// deletes = await auctionHouse.deleteProduct(productCount)
			donated = await auctionHouse.donation(web3.utils.toWei('1', 'Ether'), artistCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
			// ends = await auctionHouse.auctionEnd(auctionCount)
		})

		it('creates artist', async () => {
			assert.equal(artistCount, 1)
			const event = new_artist.logs[0].args
			assert.equal(event.id_artist.toNumber(), artistCount.toNumber(), 'id correct')
			assert.equal(event.artist_name, 'artist1', 'name is correct')
			assert.equal(event.details, 'details', 'details correct')
		})

		it('edits artist', async () => {
			assert.equal(artistCount, 1)
			const event = edited_artist.logs[0].args
			assert.equal(event.id_artist.toNumber(), artistCount.toNumber(), 'id correct')
			assert.equal(event.artist_name, 'Artist2', 'name is correct')
			assert.equal(event.details, 'details', 'details correct')
		})


		it('create products', async () => {
			// Success
			assert.equal(artistCount, 1)
			assert.equal(productCount, 1)
		    const event = result.logs[0].args
		    assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(event.name, 'Picture1', 'name is correct')
		    assert.equal(event.price, '1000000000000000000', 'price is correct')
		    assert.equal(event.id_artist.toNumber(), artistCount.toNumber(), 'Artist is correct')
		    assert.equal(event.category, 'painting', 'Type is correct')
		    assert.equal(event.description, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Description is correct')
		    assert.equal(event.image_hash, 'hash123', 'Image is correct')
			
			// Failure
			await await auctionHouse.createProduct('', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', 0, 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), '', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', '', 'hash123').should.be.rejected;
			await await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '').should.be.rejected;
		})

		it('edits products', async () => {
			// Success
			assert.equal(productCount, 1)
		    const event = editedProduct.logs[0].args
		    assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(event.name, 'Product1', 'name is correct')
		    assert.equal(event.price, '1000000000000000000', 'price is correct')
		    assert.equal(event.id_product.toNumber(), artistCount.toNumber(), 'Artist is correct')
		    assert.equal(event.category, 'painting', 'Type is correct')
		    assert.equal(event.description, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Description is correct')
		    assert.equal(event.image_hash, 'hash123', 'Image is correct')
			
			// Failure
			await await auctionHouse.editProduct('', web3.utils.toWei('1', 'Ether'), artistCount, 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.editProduct('Product1', 0, artistCount, 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.editProduct('Product1', web3.utils.toWei('1', 'Ether'), 0, 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.editProduct('Product1', web3.utils.toWei('1', 'Ether'), artistCount, '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'hash123').should.be.rejected;
			await await auctionHouse.editProduct('Product1', web3.utils.toWei('1', 'Ether'), artistCount, 'painting', '', 'hash123').should.be.rejected;
			await await auctionHouse.editProduct('Product1', web3.utils.toWei('1', 'Ether'), artistCount, 'painting', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '').should.be.rejected;
		})


		it('create auction', async () => {
			assert.equal(auctionCount, 1)
		    const event = new_auction.logs[0].args
		    assert.equal(event.id_auction.toNumber(), auctionCount.toNumber(), 'id is correct')
		    // assert.equal(activeAuctionCount.toNumber(), '1', 'id is correct')
		    assert.equal(event.target_price, '2000000000000000000', 'target price correct')
		    assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'product is correct')

			await await auctionHouse.createAuction('').should.be.rejected;
		})

		it('edit auction', async () => {
			assert.equal(auctionCount, 1)
		    const event = editedAuction.logs[0].args
		    assert.equal(event.id_auction.toNumber(), auctionCount.toNumber(), 'id is correct')
		    // assert.equal(activeAuctionCount.toNumber(), '1', 'id is correct')
		    assert.equal(event.target_price, '3000000000000000000', 'target price correct')
		    assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'product is correct')

			// await await auctionHouse.editAuction(0, web3.utils.toWei('3', 'Ether')).should.be.rejected;
			// await await auctionHouse.editAuction(auctionCount, 0).should.be.rejected;
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

			// await await auctionHouse.bid(0, 'John Doe').should.be.rejected;
			// await await auctionHouse.bid(1, '').should.be.rejected;
		})

		it('donates', async () => {
			const event = donated.logs[0].args
			assert.equal(event.id_artist.toNumber(), artistCount.toNumber(), 'id correct')
			assert.equal(event.artist_name, 'Artist2', 'artist correct')
			assert.equal(event.amount, '1000000000000000000', 'amount correct')
		})

		// it('lists products', async () => {
		// 	const product = await auctionHouse.products(productCount)
		// 	assert.equal(product.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		//     assert.equal(product.name, 'Picture1', 'name is correct')
		//     assert.equal(product.price, '1000000000000000000', 'price is correct')
		//     assert.equal(product.artist_name, 'John Doe', 'Artist name is correct')
		// 	assert.equal(product.purchased, false, 'Purchased is correct')
		// })

		// it('ends', async () => {
		// 	let initialOwnerBalance
  //     		initialOwnerBalance = await web3.eth.getBalance(buyer)
  //     		initialOwnerBalance = new web3.utils.BN(initialOwnerBalance)

  //     		ended = await auctionHouse.auctionEnd(auctionCount, {from: buyer, value: web3.utils.toWei('2', 'Ether')})
 	// 		const event = ended.logs[0].args
 	// 		assert.equal(event.winner, buyer, 'winner is correct')
 	// 		assert.equal(event.amount, '2000000000000000000', 'amount is correct')

 	// 		let newOwnerBalance
  //     		newOwnerBalance = await web3.eth.getBalance(buyer)
  //     		newOwnerBalance = new web3.utils.BN(newOwnerBalance)

  //     		let price
  //     		price = web3.utils.toWei('2', 'Ether')
  //     		price = new web3.utils.BN(price)

  //     		const exepectedBalance = initialOwnerBalance.add(price)

  //     		assert.equal(newOwnerBalance.toString(), exepectedBalance.toString(), "Idk")

 	// 		await await auctionHouse.auctionEnd('').should.be.rejected;
 	// 	})


	})


})