const Auction = artifacts.require('./Auction.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Auction', ([deployer, seller, buyer]) =>{
	let auction

	before(async () => {
		auction = await Auction.deployed()
	})

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await Auction.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it('has a time', async () => {
			const time = await Auction.auctionEndTime
			assert.notEqual(time, 0)
		})
	})

})