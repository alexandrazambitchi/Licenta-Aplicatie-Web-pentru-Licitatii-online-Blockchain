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
			assert.equal(name, 'Auction House Art')
		})
	})

	describe('products', async () => {
		let result, productCount

		before(async () => {
			result = await auctionHouse.createProduct('Picture1', web3.utils.toWei('1', 'Ether'), 'John Doe', { from: seller})
			productCount = await auctionHouse.productCount()
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

		it('lists products', async () => {
			const product = await auctionHouse.products(productCount)
			assert.equal(product.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(product.name, 'Picture1', 'name is correct')
		    assert.equal(product.price, '1000000000000000000', 'price is correct')
		    assert.equal(product.artist_name, 'John Doe', 'Artist name is correct')
		    assert.equal(product.owner, seller, 'owner is correct')
			assert.equal(product.purchased, false, 'Purchased is correct')
		})

		it('sells products', async () => {
			let oldSellerBalance
      		oldSellerBalance = await web3.eth.getBalance(seller)
      		oldSellerBalance = new web3.utils.BN(oldSellerBalance)

			result = await auctionHouse.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
			
			const event = result.logs[0].args
		    assert.equal(event.id_product.toNumber(), productCount.toNumber(), 'id is correct')
		    assert.equal(event.name, 'Picture1', 'name is correct')
		    assert.equal(event.price, '1000000000000000000', 'price is correct')
		    assert.equal(event.artist_name, 'John Doe', 'Artist name is correct')
		    assert.equal(event.owner, buyer, 'owner is correct')
			assert.equal(event.purchased, true, 'Purchased is correct')

			let newSellerBalance
		    newSellerBalance = await web3.eth.getBalance(seller)
		    newSellerBalance = new web3.utils.BN(newSellerBalance)

		    let price
		    price = web3.utils.toWei('1', 'Ether')
		    price = new web3.utils.BN(price)

		    const exepectedBalance = oldSellerBalance.add(price)

		    assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

		      // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
		    await auctionHouse.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
		      // FAILURE: Buyer tries to buy without enough ether
		    await auctionHouse.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
		      // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
		    await auctionHouse.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
		      // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
		    await auctionHouse.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
		})
	})


})